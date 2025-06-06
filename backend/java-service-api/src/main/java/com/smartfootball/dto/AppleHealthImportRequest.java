package com.smartfootball.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class AppleHealthImportRequest {
    private String userId;
    private List<WorkoutData> workouts;
    private List<HealthSample> heartRateData;
    private List<LocationSample> locationData;
    private List<MotionSample> accelerometerData;
    private List<MotionSample> gyroscopeData;
    private DeviceInfo deviceInfo;

    @Data
    public static class WorkoutData {
        private String workoutType;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Double totalEnergyBurned;
        private Double totalDistance;
        private String sourceName;
        private String sourceVersion;
        private Map<String, Object> metadata;
    }

    @Data
    public static class HealthSample {
        private LocalDateTime date;
        private Double value;
        private String unit;
        private String sourceName;
        private Map<String, Object> metadata;
    }

    @Data
    public static class LocationSample {
        private LocalDateTime timestamp;
        private Double latitude;
        private Double longitude;
        private Double altitude;
        private Double horizontalAccuracy;
        private Double verticalAccuracy;
        private Double speed;
        private Double course;
    }

    @Data
    public static class MotionSample {
        private LocalDateTime timestamp;
        private Double x;
        private Double y;
        private Double z;
        private String sensorType; // "accelerometer" or "gyroscope"
    }

    @Data
    public static class DeviceInfo {
        private String name;
        private String model;
        private String systemName;
        private String systemVersion;
        private String appVersion;
    }
} 