package com.smartfootball.dto.llm;

import com.fasterxml.jackson.annotation.JsonProperty;

// Corresponds to Pydantic SummarizeRequest model in Python
public class SummarizeRequestDto {

    @JsonProperty("original_query")
    private String originalQuery;

    @JsonProperty("detailed_analysis")
    private String detailedAnalysis;

    private Double temperature;
    
    @JsonProperty("max_tokens")
    private Integer maxTokens;

    public SummarizeRequestDto() {}

    public SummarizeRequestDto(String originalQuery, String detailedAnalysis, Double temperature, Integer maxTokens) {
        this.originalQuery = originalQuery;
        this.detailedAnalysis = detailedAnalysis;
        this.temperature = temperature;
        this.maxTokens = maxTokens;
    }

    // Getters and Setters
    public String getOriginalQuery() {
        return originalQuery;
    }

    public void setOriginalQuery(String originalQuery) {
        this.originalQuery = originalQuery;
    }

    public String getDetailedAnalysis() {
        return detailedAnalysis;
    }

    public void setDetailedAnalysis(String detailedAnalysis) {
        this.detailedAnalysis = detailedAnalysis;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Integer getMaxTokens() {
        return maxTokens;
    }

    public void setMaxTokens(Integer maxTokens) {
        this.maxTokens = maxTokens;
    }
} 