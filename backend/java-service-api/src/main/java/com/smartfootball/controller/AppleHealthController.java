package com.smartfootball.controller;

import com.smartfootball.dto.AppleHealthImportRequest;
import com.smartfootball.dto.AppleHealthImportResponse;
import com.smartfootball.entity.AppleHealthData;
import com.smartfootball.service.AppleHealthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/apple-health")
@RequiredArgsConstructor
@Tag(name = "Apple Health", description = "Apple Health data import and management APIs")
public class AppleHealthController {

    private final AppleHealthService appleHealthService;

    @PostMapping("/import")
    @Operation(summary = "Import Apple Health data", description = "Import health and workout data from Apple HealthKit")
    public ResponseEntity<AppleHealthImportResponse> importHealthData(
            @RequestBody AppleHealthImportRequest request) {
        
        log.info("Received Apple Health import request for user: {}", request.getUserId());
        
        try {
            AppleHealthImportResponse response = appleHealthService.importHealthData(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
        } catch (Exception e) {
            log.error("Error processing Apple Health import request", e);
            AppleHealthImportResponse errorResponse = AppleHealthImportResponse.error(
                "Internal server error during import", 
                List.of(e.getMessage())
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/connection-status/{userId}")
    @Operation(summary = "Check HealthKit connection status", description = "Check if HealthKit is connected for a user")
    public ResponseEntity<Map<String, Object>> getConnectionStatus(
            @PathVariable @Parameter(description = "User ID") String userId) {
        
        boolean isConnected = appleHealthService.isHealthKitConnected(userId);
        AppleHealthImportResponse.ImportStats stats = appleHealthService.getImportStats(userId);
        
        Map<String, Object> response = Map.of(
            "connected", isConnected,
            "userId", userId,
            "stats", stats,
            "lastChecked", LocalDateTime.now()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/data/{userId}")
    @Operation(summary = "Get user's Apple Health data", description = "Retrieve all Apple Health data for a user")
    public ResponseEntity<List<AppleHealthData>> getUserHealthData(
            @PathVariable @Parameter(description = "User ID") String userId) {
        
        List<AppleHealthData> data = appleHealthService.getUserHealthData(userId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/data/{userId}/recent")
    @Operation(summary = "Get recent Apple Health data", description = "Get Apple Health data from the last 30 days")
    public ResponseEntity<List<AppleHealthData>> getRecentUserHealthData(
            @PathVariable @Parameter(description = "User ID") String userId) {
        
        List<AppleHealthData> data = appleHealthService.getRecentUserHealthData(userId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/data/{userId}/range")
    @Operation(summary = "Get Apple Health data by date range", description = "Get Apple Health data within a specific date range")
    public ResponseEntity<List<AppleHealthData>> getUserHealthDataInRange(
            @PathVariable @Parameter(description = "User ID") String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) 
            @Parameter(description = "Start date (ISO format)") LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            @Parameter(description = "End date (ISO format)") LocalDateTime endDate) {
        
        List<AppleHealthData> data = appleHealthService.getUserHealthDataInRange(userId, startDate, endDate);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/data/{userId}/workout-type/{workoutType}")
    @Operation(summary = "Get Apple Health data by workout type", description = "Get Apple Health data filtered by workout type")
    public ResponseEntity<List<AppleHealthData>> getUserHealthDataByWorkoutType(
            @PathVariable @Parameter(description = "User ID") String userId,
            @PathVariable @Parameter(description = "Workout type (e.g., 'Running', 'Football')") String workoutType) {
        
        List<AppleHealthData> data = appleHealthService.getUserHealthDataByWorkoutType(userId, workoutType);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/data/details/{id}")
    @Operation(summary = "Get specific Apple Health data", description = "Get detailed information about a specific health data record")
    public ResponseEntity<AppleHealthData> getHealthDataById(
            @PathVariable @Parameter(description = "Health data ID") String id) {
        
        Optional<AppleHealthData> data = appleHealthService.getHealthDataById(id);
        
        if (data.isPresent()) {
            return ResponseEntity.ok(data.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/data/{id}")
    @Operation(summary = "Delete Apple Health data", description = "Delete a specific Apple Health data record")
    public ResponseEntity<Map<String, String>> deleteHealthData(
            @PathVariable @Parameter(description = "Health data ID") String id) {
        
        try {
            Optional<AppleHealthData> data = appleHealthService.getHealthDataById(id);
            
            if (data.isPresent()) {
                appleHealthService.deleteHealthData(id);
                return ResponseEntity.ok(Map.of(
                    "message", "Apple Health data deleted successfully",
                    "deletedId", id
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("Error deleting Apple Health data: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete Apple Health data"));
        }
    }

    @PostMapping("/convert-to-training/{healthDataId}")
    @Operation(summary = "Convert to training data", description = "Convert Apple Health data to TrainingData format")
    public ResponseEntity<Map<String, String>> convertToTrainingData(
            @PathVariable @Parameter(description = "Health data ID") String healthDataId) {
        
        try {
            Optional<AppleHealthData> data = appleHealthService.getHealthDataById(healthDataId);
            
            if (data.isPresent()) {
                appleHealthService.convertToTrainingData(healthDataId);
                return ResponseEntity.ok(Map.of(
                    "message", "Successfully converted Apple Health data to TrainingData",
                    "healthDataId", healthDataId
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            log.error("Error converting Apple Health data to TrainingData: {}", healthDataId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to convert Apple Health data"));
        }
    }

    @GetMapping("/stats/{userId}")
    @Operation(summary = "Get import statistics", description = "Get statistics about imported Apple Health data for a user")
    public ResponseEntity<AppleHealthImportResponse.ImportStats> getImportStats(
            @PathVariable @Parameter(description = "User ID") String userId) {
        
        AppleHealthImportResponse.ImportStats stats = appleHealthService.getImportStats(userId);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/sync/{userId}")
    @Operation(summary = "Trigger data sync", description = "Trigger a sync with Apple HealthKit for new data")
    public ResponseEntity<Map<String, Object>> triggerSync(
            @PathVariable @Parameter(description = "User ID") String userId) {
        
        // This endpoint would typically trigger a background job to sync with HealthKit
        // For now, we'll return a response indicating the sync has been triggered
        
        Map<String, Object> response = Map.of(
            "message", "Sync triggered successfully",
            "userId", userId,
            "syncTriggeredAt", LocalDateTime.now(),
            "status", "pending"
        );
        
        return ResponseEntity.accepted().body(response);
    }
} 