package com.smartfootball.controller;

import com.smartfootball.entity.Recommendation;
import com.smartfootball.service.LLMIntegrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// DTO for the request body of the new endpoint
class LLMQueryRequest {
    private String userId;
    private String query;

    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getQuery() {
        return query;
    }
    public void setQuery(String query) {
        this.query = query;
    }
}

@RestController
@RequestMapping("/api/llm") // Base path for LLM related operations
public class LLMController {

    private final LLMIntegrationService llmIntegrationService;
    private static final Logger logger = LoggerFactory.getLogger(LLMController.class);

    public LLMController(LLMIntegrationService llmIntegrationService) {
        this.llmIntegrationService = llmIntegrationService;
    }

    @PostMapping("/basic-chat")
    public ResponseEntity<Recommendation> analyzeUserData(@RequestBody LLMQueryRequest request) {
        if (request.getUserId() == null || request.getUserId().isEmpty() || 
            request.getQuery() == null || request.getQuery().isEmpty()) {
            return ResponseEntity.badRequest().build(); // Or a more specific error response
        }
        try {
            Recommendation recommendation = llmIntegrationService.generateDetailedAnalysis(request.getUserId(), request.getQuery());
            return ResponseEntity.ok(recommendation);
        } catch (RuntimeException e) {
            // The GlobalExceptionHandler should ideally catch this and format it,
            // but a specific catch here can also be useful for logging or specific status codes.
            // For now, let GlobalExceptionHandler handle it to keep this simpler.
            // Or, return a more specific error based on e.g. LLM API failure.
            return ResponseEntity.status(503).body(null); // Example: Service Unavailable
        }
    }

    @PostMapping("/summarize/{recommendationId}")
    public ResponseEntity<Recommendation> summarizeAnalysis(@PathVariable String recommendationId) {
        if (recommendationId == null || recommendationId.isEmpty()) {
            return ResponseEntity.badRequest().build(); // Or a more specific error response for invalid ID
        }
        try {
            Recommendation recommendation = llmIntegrationService.summarizeAndPrioritizeAnalysis(recommendationId);
            return ResponseEntity.ok(recommendation);
        } catch (RuntimeException e) {
            // Rely on GlobalExceptionHandler or return a specific error
            // For example, if recommendationId is not found, a 404 might be appropriate
            // but current service throws RuntimeException for that.
            logger.error("Error summarizing recommendation {}: {}", recommendationId, e.getMessage());
            return ResponseEntity.status(503).body(null); // Example: Service Unavailable
        }
    }
} 