package com.smartfootball.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AppleHealthImportResponse {
    private boolean success;
    private String message;
    private ImportStats stats;
    private List<String> warnings;
    private List<String> errors;
    private LocalDateTime importedAt;

    @Data
    public static class ImportStats {
        private int totalWorkouts;
        private int successfulWorkouts;
        private int failedWorkouts;
        private int heartRateSamples;
        private int locationSamples;
        private int accelerometerSamples;
        private int gyroscopeSamples;
        private LocalDateTime earliestData;
        private LocalDateTime latestData;
    }

    // Convenience constructors
    public AppleHealthImportResponse() {
        this.importedAt = LocalDateTime.now();
    }

    public AppleHealthImportResponse(boolean success, String message) {
        this();
        this.success = success;
        this.message = message;
    }

    public static AppleHealthImportResponse success(String message, ImportStats stats) {
        AppleHealthImportResponse response = new AppleHealthImportResponse(true, message);
        response.setStats(stats);
        return response;
    }

    public static AppleHealthImportResponse error(String message, List<String> errors) {
        AppleHealthImportResponse response = new AppleHealthImportResponse(false, message);
        response.setErrors(errors);
        return response;
    }
} 