package com.smartfootball.service;

import com.smartfootball.entity.Recommendation;

public interface LLMIntegrationService {
    /**
     * Fetches user training data, constructs a prompt, calls the Analysis LLM API,
     * and stores the LLM's detailed response as a new recommendation.
     *
     * @param userId The ID of the user for whom to generate the detailed analysis.
     * @param userQuery The specific query or topic the user wants analysis on.
     * @return The Recommendation entity (containing the detailed analysis) saved to the database.
     * @throws RuntimeException if the LLM API call fails or an error occurs.
     */
    Recommendation generateDetailedAnalysis(String userId, String userQuery);

    /**
     * Takes an existing recommendation (which contains a detailed analysis and original query),
     * calls the Summarization LLM API, and updates the recommendation with a summary and priority.
     *
     * @param recommendationId The ID of the Recommendation record to summarize and prioritize.
     * @return The updated Recommendation entity.
     * @throws RuntimeException if the LLM API call fails, the recommendation is not found, or an error occurs.
     */
    Recommendation summarizeAndPrioritizeAnalysis(String recommendationId);
} 