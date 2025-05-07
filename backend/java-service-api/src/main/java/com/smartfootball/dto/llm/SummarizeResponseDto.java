package com.smartfootball.dto.llm;

import com.fasterxml.jackson.annotation.JsonProperty;

// Corresponds to Pydantic SummarizeResponse model in Python
public class SummarizeResponseDto {

    @JsonProperty("summary")
    private String summary;

    @JsonProperty("priority")
    private String priority; // Will be "High", "Medium", or "Low"

    public SummarizeResponseDto() {}

    // Getters and Setters
    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
} 