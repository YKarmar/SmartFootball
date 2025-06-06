package com.smartfootball.service;

import com.smartfootball.dto.AppleHealthImportRequest;
import com.smartfootball.dto.AppleHealthImportResponse;
import com.smartfootball.entity.AppleHealthData;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AppleHealthService {
    
    /**
     * Import Apple Health data from HealthKit
     */
    AppleHealthImportResponse importHealthData(AppleHealthImportRequest request);
    
    /**
     * Get all Apple Health data for a user
     */
    List<AppleHealthData> getUserHealthData(String userId);
    
    /**
     * Get recent Apple Health data for a user (last 30 days)
     */
    List<AppleHealthData> getRecentUserHealthData(String userId);
    
    /**
     * Get Apple Health data for a user within a date range
     */
    List<AppleHealthData> getUserHealthDataInRange(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Get Apple Health data by workout type
     */
    List<AppleHealthData> getUserHealthDataByWorkoutType(String userId, String workoutType);
    
    /**
     * Get a specific Apple Health data record
     */
    Optional<AppleHealthData> getHealthDataById(String id);
    
    /**
     * Delete Apple Health data
     */
    void deleteHealthData(String id);
    
    /**
     * Get import statistics for a user
     */
    AppleHealthImportResponse.ImportStats getImportStats(String userId);
    
    /**
     * Check HealthKit connection status for a user
     */
    boolean isHealthKitConnected(String userId);
    
    /**
     * Convert Apple Health data to TrainingData format
     */
    void convertToTrainingData(String healthDataId);
} 