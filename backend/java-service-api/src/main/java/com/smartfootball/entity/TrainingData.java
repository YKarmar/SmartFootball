package com.smartfootball.entity;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "training_data")
public class TrainingData {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "session_start", nullable = false)
    private LocalDateTime sessionStart;

    @Column(name = "session_end", nullable = false)
    private LocalDateTime sessionEnd;

    @Column(name = "accelerometer_data", columnDefinition = "JSON")
    private String accelerometerData;

    @Column(name = "gyroscope_data", columnDefinition = "JSON")
    private String gyroscopeData;

    @Column(name = "heart_rate_data", columnDefinition = "JSON")
    private String heartRateData;

    @Column(name = "gps_data", columnDefinition = "JSON")
    private String gpsData;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Getters
    public String getId() { return id; }
    public String getUserId() { return userId; }
    public LocalDateTime getSessionStart() { return sessionStart; }
    public LocalDateTime getSessionEnd() { return sessionEnd; }
    public String getAccelerometerData() { return accelerometerData; }
    public String getGyroscopeData() { return gyroscopeData; }
    public String getHeartRateData() { return heartRateData; }
    public String getGpsData() { return gpsData; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setSessionStart(LocalDateTime sessionStart) { this.sessionStart = sessionStart; }
    public void setSessionEnd(LocalDateTime sessionEnd) { this.sessionEnd = sessionEnd; }
    public void setAccelerometerData(String accelerometerData) { this.accelerometerData = accelerometerData; }
    public void setGyroscopeData(String gyroscopeData) { this.gyroscopeData = gyroscopeData; }
    public void setHeartRateData(String heartRateData) { this.heartRateData = heartRateData; }
    public void setGpsData(String gpsData) { this.gpsData = gpsData; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
} 