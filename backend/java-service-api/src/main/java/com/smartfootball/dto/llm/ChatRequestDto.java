package com.smartfootball.dto.llm;

import java.util.List;

// Corresponds to Pydantic ChatRequest model in Python
public class ChatRequestDto {
    private List<MessageDto> messages;
    private Double temperature;
    private Integer max_tokens;

    public ChatRequestDto() {}

    public ChatRequestDto(List<MessageDto> messages, Double temperature, Integer maxTokens) {
        this.messages = messages;
        this.temperature = temperature;
        this.max_tokens = maxTokens;
    }

    public List<MessageDto> getMessages() {
        return messages;
    }

    public void setMessages(List<MessageDto> messages) {
        this.messages = messages;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Integer getMax_tokens() {
        return max_tokens;
    }

    public void setMax_tokens(Integer max_tokens) {
        this.max_tokens = max_tokens;
    }
} 