package com.smartfootball.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartfootball.dto.AppleHealthImportRequest;
import com.smartfootball.dto.AppleHealthImportResponse;
import com.smartfootball.entity.AppleHealthData;
import com.smartfootball.entity.TrainingData;
import com.smartfootball.repository.AppleHealthDataRepository;
import com.smartfootball.repository.TrainingDataRepository;
import com.smartfootball.service.AppleHealthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppleHealthServiceImpl implements AppleHealthService {

    private final AppleHealthDataRepository appleHealthDataRepository;
    private final TrainingDataRepository trainingDataRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public AppleHealthImportResponse importHealthData(AppleHealthImportRequest request) {
        log.info("Starting Apple Health data import for user: {}", request.getUserId());
        
        AppleHealthImportResponse.ImportStats stats = new AppleHealthImportResponse.ImportStats();
        List<String> warnings = new ArrayList<>();
        List<String> errors = new ArrayList<>();
        
        try {
            // Process workout data
            if (request.getWorkouts() != null && !request.getWorkouts().isEmpty()) {
                processWorkouts(request, stats, warnings, errors);
            }
            
            // Update statistics
            stats.setHeartRateSamples(request.getHeartRateData() != null ? request.getHeartRateData().size() : 0);
            stats.setLocationSamples(request.getLocationData() != null ? request.getLocationData().size() : 0);
            stats.setAccelerometerSamples(request.getAccelerometerData() != null ? request.getAccelerometerData().size() : 0);
            stats.setGyroscopeSamples(request.getGyroscopeData() != null ? request.getGyroscopeData().size() : 0);
            
            // Find earliest and latest data
            Optional<LocalDateTime> earliest = appleHealthDataRepository.findEarliestDataByUserId(request.getUserId());
            Optional<LocalDateTime> latest = appleHealthDataRepository.findLatestDataByUserId(request.getUserId());
            stats.setEarliestData(earliest.orElse(null));
            stats.setLatestData(latest.orElse(null));
            
            log.info("Apple Health data import completed for user: {}. Stats: {}", 
                    request.getUserId(), stats);
            
            return AppleHealthImportResponse.success("Successfully imported Apple Health data", stats);
            
        } catch (Exception e) {
            log.error("Error importing Apple Health data for user: {}", request.getUserId(), e);
            errors.add("Import failed: " + e.getMessage());
            return AppleHealthImportResponse.error("Failed to import Apple Health data", errors);
        }
    }

    private void processWorkouts(AppleHealthImportRequest request, 
                               AppleHealthImportResponse.ImportStats stats, 
                               List<String> warnings, 
                               List<String> errors) {
        
        stats.setTotalWorkouts(request.getWorkouts().size());
        int successCount = 0;
        int failureCount = 0;
        
        for (AppleHealthImportRequest.WorkoutData workout : request.getWorkouts()) {
            try {
                AppleHealthData healthData = new AppleHealthData();
                healthData.setUserId(request.getUserId());
                healthData.setWorkoutType(workout.getWorkoutType());
                healthData.setStartDate(workout.getStartDate());
                healthData.setEndDate(workout.getEndDate());
                healthData.setTotalEnergyBurned(workout.getTotalEnergyBurned());
                healthData.setDistanceMeters(workout.getTotalDistance());
                healthData.setSourceName(workout.getSourceName());
                healthData.setSourceVersion(workout.getSourceVersion());
                
                // Convert additional data to JSON
                if (workout.getMetadata() != null) {
                    healthData.setMetadata(objectMapper.writeValueAsString(workout.getMetadata()));
                }
                
                // Convert sensor data to JSON strings
                convertSensorDataToJson(healthData, request);
                
                appleHealthDataRepository.save(healthData);
                successCount++;
                
                log.debug("Successfully imported workout: {} for user: {}", 
                         workout.getWorkoutType(), request.getUserId());
                
            } catch (Exception e) {
                failureCount++;
                String errorMsg = "Failed to import workout: " + workout.getWorkoutType() + " - " + e.getMessage();
                errors.add(errorMsg);
                log.warn(errorMsg, e);
            }
        }
        
        stats.setSuccessfulWorkouts(successCount);
        stats.setFailedWorkouts(failureCount);
    }

    private void convertSensorDataToJson(AppleHealthData healthData, AppleHealthImportRequest request) {
        try {
            if (request.getHeartRateData() != null && !request.getHeartRateData().isEmpty()) {
                healthData.setHeartRateSamples(objectMapper.writeValueAsString(request.getHeartRateData()));
            }
            
            if (request.getLocationData() != null && !request.getLocationData().isEmpty()) {
                healthData.setLocationSamples(objectMapper.writeValueAsString(request.getLocationData()));
            }
            
            if (request.getAccelerometerData() != null && !request.getAccelerometerData().isEmpty()) {
                List<AppleHealthImportRequest.MotionSample> accelData = request.getAccelerometerData()
                    .stream()
                    .filter(sample -> "accelerometer".equals(sample.getSensorType()))
                    .collect(Collectors.toList());
                if (!accelData.isEmpty()) {
                    healthData.setAccelerometerSamples(objectMapper.writeValueAsString(accelData));
                }
            }
            
            if (request.getGyroscopeData() != null && !request.getGyroscopeData().isEmpty()) {
                List<AppleHealthImportRequest.MotionSample> gyroData = request.getGyroscopeData()
                    .stream()
                    .filter(sample -> "gyroscope".equals(sample.getSensorType()))
                    .collect(Collectors.toList());
                if (!gyroData.isEmpty()) {
                    healthData.setGyroscopeSamples(objectMapper.writeValueAsString(gyroData));
                }
            }
            
        } catch (JsonProcessingException e) {
            log.warn("Failed to convert sensor data to JSON", e);
        }
    }

    @Override
    public List<AppleHealthData> getUserHealthData(String userId) {
        return appleHealthDataRepository.findByUserIdOrderByStartDateDesc(userId);
    }

    @Override
    public List<AppleHealthData> getRecentUserHealthData(String userId) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return appleHealthDataRepository.findRecentDataByUserId(userId, thirtyDaysAgo);
    }

    @Override
    public List<AppleHealthData> getUserHealthDataInRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
        return appleHealthDataRepository.findByUserIdAndStartDateBetween(userId, startDate, endDate);
    }

    @Override
    public List<AppleHealthData> getUserHealthDataByWorkoutType(String userId, String workoutType) {
        return appleHealthDataRepository.findByUserIdAndWorkoutType(userId, workoutType);
    }

    @Override
    public Optional<AppleHealthData> getHealthDataById(String id) {
        return appleHealthDataRepository.findById(id);
    }

    @Override
    @Transactional
    public void deleteHealthData(String id) {
        appleHealthDataRepository.deleteById(id);
    }

    @Override
    public AppleHealthImportResponse.ImportStats getImportStats(String userId) {
        AppleHealthImportResponse.ImportStats stats = new AppleHealthImportResponse.ImportStats();
        
        List<AppleHealthData> allData = appleHealthDataRepository.findByUserId(userId);
        stats.setTotalWorkouts(allData.size());
        stats.setSuccessfulWorkouts(allData.size()); // All stored data is considered successful
        stats.setFailedWorkouts(0);
        
        // Calculate total samples
        stats.setHeartRateSamples(allData.stream()
            .mapToInt(data -> data.getHeartRateSamples() != null ? countJsonArrayElements(data.getHeartRateSamples()) : 0)
            .sum());
        
        stats.setLocationSamples(allData.stream()
            .mapToInt(data -> data.getLocationSamples() != null ? countJsonArrayElements(data.getLocationSamples()) : 0)
            .sum());
        
        // Find earliest and latest data
        Optional<LocalDateTime> earliest = appleHealthDataRepository.findEarliestDataByUserId(userId);
        Optional<LocalDateTime> latest = appleHealthDataRepository.findLatestDataByUserId(userId);
        stats.setEarliestData(earliest.orElse(null));
        stats.setLatestData(latest.orElse(null));
        
        return stats;
    }

    @Override
    public boolean isHealthKitConnected(String userId) {
        // Check if user has any recent Apple Health data (within last 7 days)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<AppleHealthData> recentData = appleHealthDataRepository.findRecentImportsByUserId(userId, sevenDaysAgo);
        return !recentData.isEmpty();
    }

    @Override
    @Transactional
    public void convertToTrainingData(String healthDataId) {
        Optional<AppleHealthData> healthDataOpt = appleHealthDataRepository.findById(healthDataId);
        
        if (healthDataOpt.isPresent()) {
            AppleHealthData healthData = healthDataOpt.get();
            
            TrainingData trainingData = new TrainingData();
            trainingData.setUserId(healthData.getUserId());
            trainingData.setSessionStart(healthData.getStartDate());
            trainingData.setSessionEnd(healthData.getEndDate());
            trainingData.setAccelerometerData(healthData.getAccelerometerSamples());
            trainingData.setGyroscopeData(healthData.getGyroscopeSamples());
            trainingData.setHeartRateData(healthData.getHeartRateSamples());
            trainingData.setGpsData(healthData.getLocationSamples());
            
            trainingDataRepository.save(trainingData);
            
            log.info("Converted Apple Health data {} to TrainingData for user {}", 
                    healthDataId, healthData.getUserId());
        }
    }
    
    private int countJsonArrayElements(String jsonString) {
        try {
            Object[] array = objectMapper.readValue(jsonString, Object[].class);
            return array.length;
        } catch (Exception e) {
            return 0;
        }
    }
} 