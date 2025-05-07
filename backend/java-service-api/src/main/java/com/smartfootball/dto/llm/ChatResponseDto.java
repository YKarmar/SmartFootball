package com.smartfootball.dto.llm;

import com.fasterxml.jackson.annotation.JsonProperty;

// Corresponds to Pydantic ChatResponse model in Python
public class ChatResponseDto {
    @JsonProperty("assistant_response") // Ensure Jackson maps the JSON key correctly
    private String assistantResponse;

    public ChatResponseDto() {}

    public String getAssistantResponse() {
        return assistantResponse;
    }

    public void setAssistantResponse(String assistantResponse) {
        this.assistantResponse = assistantResponse;
    }
} 