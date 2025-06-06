package com.smartfootball.entity;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "apple_health_data")
public class AppleHealthData {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "workout_type", length = 50)
    private String workoutType;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "distance_meters")
    private Double distanceMeters;

    @Column(name = "total_energy_burned")
    private Double totalEnergyBurned;

    @Column(name = "heart_rate_samples", columnDefinition = "JSON")
    private String heartRateSamples;

    @Column(name = "location_samples", columnDefinition = "JSON")
    private String locationSamples;

    @Column(name = "accelerometer_samples", columnDefinition = "JSON")
    private String accelerometerSamples;

    @Column(name = "gyroscope_samples", columnDefinition = "JSON")
    private String gyroscopeSamples;

    @Column(name = "source_name", length = 100)
    private String sourceName;

    @Column(name = "source_version", length = 50)
    private String sourceVersion;

    @Column(name = "metadata", columnDefinition = "JSON")
    private String metadata;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "imported_at")
    private LocalDateTime importedAt;

    // Constructors
    public AppleHealthData() {}

    public AppleHealthData(String userId, String workoutType, LocalDateTime startDate, LocalDateTime endDate) {
        this.userId = userId;
        this.workoutType = workoutType;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Custom methods
    public void calculateDuration() {
        if (startDate != null && endDate != null) {
            this.durationSeconds = (int) java.time.Duration.between(startDate, endDate).getSeconds();
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        importedAt = LocalDateTime.now();
        calculateDuration();
    }

    @PreUpdate
    protected void onUpdate() {
        calculateDuration();
    }
} 