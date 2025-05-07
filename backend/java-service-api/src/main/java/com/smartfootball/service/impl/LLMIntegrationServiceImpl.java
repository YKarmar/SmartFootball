package com.smartfootball.service.impl;

import com.smartfootball.dto.llm.*; // Import all DTOs from the package
import com.smartfootball.entity.Recommendation;
import com.smartfootball.entity.TrainingData;
import com.smartfootball.service.LLMIntegrationService;
import com.smartfootball.service.RecommendationService;
import com.smartfootball.service.TrainingDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.List;
import java.util.Map; // For priority mapping
import java.util.HashMap; // For priority mapping
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LLMIntegrationServiceImpl implements LLMIntegrationService {

    private static final Logger logger = LoggerFactory.getLogger(LLMIntegrationServiceImpl.class);

    private final RestTemplate restTemplate;
    private final TrainingDataService trainingDataService;
    private final RecommendationService recommendationService;

    private final String analysisLlmApiUrl = "http://localhost:8001/api/chat/"; 
    private final String summarizeLlmApiUrl = "http://localhost:8001/api/summarize/";

    private static final Map<String, Integer> PRIORITY_MAP = new HashMap<>();
    static {
        PRIORITY_MAP.put("Low", 0);
        PRIORITY_MAP.put("Medium", 1);
        PRIORITY_MAP.put("High", 2);
    }

    public LLMIntegrationServiceImpl(RestTemplate restTemplate,
                                   TrainingDataService trainingDataService,
                                   RecommendationService recommendationService) {
        this.restTemplate = restTemplate;
        this.trainingDataService = trainingDataService;
        this.recommendationService = recommendationService;
    }

    // private static final String ANALYSIS_SYSTEM_PROMPT = 
    //     "You are a professional football data analysis assistant. You can help users analyze their football activity data,\n" +
    //     "including position coverage, running distance, heart rate changes, etc. Please answer users' questions in a professional\n" +
    //     "but easy-to-understand language.";

    @Override
    public Recommendation generateDetailedAnalysis(String userId, String userQuery) {
        logger.info("Generating detailed analysis for userId: {}, query: {}", userId, userQuery);

        List<TrainingData> trainingSessions = trainingDataService.getTrainingDataByUserId(userId);
        String trainingDataSummary = formatTrainingDataForLLM(trainingSessions);

        List<MessageDto> analysisMessages = new ArrayList<>();
        // analysisMessages.add(new MessageDto("system", ANALYSIS_SYSTEM_PROMPT)); 
        if (!trainingDataSummary.isEmpty() && !trainingDataSummary.equals("No recent training data available.")) {
            analysisMessages.add(new MessageDto("user", "Here is a summary of my recent training data:\n" + trainingDataSummary));
        }
        analysisMessages.add(new MessageDto("user", userQuery));
        ChatRequestDto analysisChatRequest = new ChatRequestDto(analysisMessages, 1.0, 500);

        ChatResponseDto analysisLlmResponse = callLlmApi(analysisLlmApiUrl, analysisChatRequest, "Analysis", ChatResponseDto.class);
        String detailedAnalysis = analysisLlmResponse.getAssistantResponse();
        logger.info("Detailed analysis for userId {}: {}", userId, detailedAnalysis);

        Recommendation recommendation = new Recommendation();
        recommendation.setUserId(userId);
        recommendation.setRecommendationType("DETAILED_ANALYSIS"); 
        recommendation.setTitle("Personalized AI Analysis"); // Truncated query as initial title
        recommendation.setDescription(detailedAnalysis);
        recommendation.setOriginalQuery(userQuery);
        recommendation.setPriority(1); // Default to Medium, to be updated by summarizer
        recommendation.setStatus("PENDING_SUMMARY"); // New status

        Recommendation savedRecommendation = recommendationService.createRecommendation(recommendation);
        logger.info("Saved detailed analysis recommendation with ID: {} for userId: {}", savedRecommendation.getId(), userId);
        return savedRecommendation;
    }

    @Override
    public Recommendation summarizeAndPrioritizeAnalysis(String recommendationId) {
        logger.info("Summarizing and prioritizing analysis for recommendationId: {}", recommendationId);

        Optional<Recommendation> optRecommendation = recommendationService.getRecommendationById(recommendationId);
        if (!optRecommendation.isPresent()) {
            logger.error("Recommendation with ID {} not found for summarization.", recommendationId);
            throw new RuntimeException("Recommendation not found: " + recommendationId);
        }
        Recommendation existingRecommendation = optRecommendation.get();

        if (existingRecommendation.getOriginalQuery() == null || existingRecommendation.getOriginalQuery().isEmpty() ||
            existingRecommendation.getDescription() == null || existingRecommendation.getDescription().isEmpty()) {
            logger.error("Original query or detailed analysis missing for recommendationId: {}. Cannot summarize.", recommendationId);
            throw new RuntimeException("Cannot summarize: Original query or detailed analysis is missing.");
        }

        SummarizeRequestDto summarizeRequest = new SummarizeRequestDto(
            existingRecommendation.getOriginalQuery(), 
            existingRecommendation.getDescription(), // This is the detailedAnalysis
            0.7, 
            100
        );

        SummarizeResponseDto summarizeLlmResponse = callLlmApi(summarizeLlmApiUrl, summarizeRequest, "Summarization", SummarizeResponseDto.class);
        String summary = summarizeLlmResponse.getSummary();
        String priorityStr = summarizeLlmResponse.getPriority();
        logger.info("Summarizer LLM response for recommendationId {}: Summary='{}', Priority='{}'", recommendationId, summary, priorityStr);

        existingRecommendation.setTitle(summary);
        existingRecommendation.setPriority(PRIORITY_MAP.getOrDefault(priorityStr.trim(), 1)); // Default to Medium if unknown, trim space
        existingRecommendation.setRecommendationType("SUMMARIZED_ANALYSIS"); // Update type
        existingRecommendation.setStatus("COMPLETED"); // Update status
        // updatedAt will be set by @PreUpdate

        Recommendation updatedRecommendation = recommendationService.updateRecommendation(existingRecommendation);
        logger.info("Updated recommendation with summary and priority. ID: {}", updatedRecommendation.getId());
        return updatedRecommendation;
    }

    // Generic helper method to call an LLM API
    private <T_REQ, T_RES> T_RES callLlmApi(String apiUrl, T_REQ requestPayload, String callType, Class<T_RES> responseClass) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<T_REQ> entity = new HttpEntity<>(requestPayload, headers);

        T_RES llmApiResponse;
        try {
            logger.debug("Sending {} request to LLM API: URL={}, Body: {}", callType, apiUrl, requestPayload);
            llmApiResponse = restTemplate.postForObject(apiUrl, entity, responseClass);
        } catch (RestClientException e) {
            logger.error("Error calling {} LLM API: {}", callType, e.getMessage(), e);
            throw new RuntimeException("Failed to get response from " + callType + " LLM assistant: " + e.getMessage(), e);
        }

        if (llmApiResponse == null) {
            logger.warn("{} LLM API returned a null response.", callType);
            throw new RuntimeException(callType + " LLM assistant provided no response.");
        }
        
        if (responseClass == ChatResponseDto.class) {
            ChatResponseDto chatResponse = (ChatResponseDto) llmApiResponse;
            if (chatResponse.getAssistantResponse() == null || chatResponse.getAssistantResponse().isEmpty()){
                logger.warn("{} LLM API returned an empty or null assistant_response.", callType);
                throw new RuntimeException(callType + " LLM assistant provided no textual response.");
            }
        } else if (responseClass == SummarizeResponseDto.class) {
            SummarizeResponseDto summarizeResponse = (SummarizeResponseDto) llmApiResponse;
            if (summarizeResponse.getSummary() == null || summarizeResponse.getSummary().isEmpty() || 
                summarizeResponse.getPriority() == null || summarizeResponse.getPriority().isEmpty()){
                logger.warn("{} LLM API returned null or empty summary or priority.", callType);
                throw new RuntimeException(callType + " LLM assistant did not provide complete summary/priority.");
            }
        }
        return llmApiResponse;
    }

    private String formatTrainingDataForLLM(List<TrainingData> sessions) {
        if (sessions == null || sessions.isEmpty()) {
            return "No recent training data available.";
        }
        return sessions.stream()
            .limit(3) 
            .map(td -> String.format(
                "Session on %s (ended %s): Accel data: %s, Gyro data: %s, HR data: %s, GPS data: %s.",
                td.getSessionStart() != null ? td.getSessionStart().toLocalDate() : "N/A",
                td.getSessionEnd() != null ? td.getSessionEnd().toLocalDate() : "N/A",
                td.getAccelerometerData() != null && !td.getAccelerometerData().isEmpty() ? "Yes" : "No",
                td.getGyroscopeData() != null && !td.getGyroscopeData().isEmpty() ? "Yes" : "No",
                td.getHeartRateData() != null && !td.getHeartRateData().isEmpty() ? "Yes" : "No",
                td.getGpsData() != null && !td.getGpsData().isEmpty() ? "Yes" : "No"
            ))
            .collect(Collectors.joining("\n"));
    }
} 