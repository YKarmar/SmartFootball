package com.smartfootball.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "activity_type")
    private String activityType; // FOOTBALL, TRAINING, etc.

    @Column(name = "gps_data", columnDefinition = "TEXT")
    private String gpsData; // JSON string of GPS coordinates

    @Column(name = "heart_rate_data", columnDefinition = "TEXT")
    private String heartRateData; // JSON string of heart rate measurements

    @Column(name = "motion_data", columnDefinition = "TEXT")
    private String motionData; // JSON string of accelerometer and gyroscope data

    @Column(name = "field_boundary", columnDefinition = "TEXT")
    private String fieldBoundary; // JSON string of field boundary coordinates

    @Column(name = "heatmap_data", columnDefinition = "TEXT")
    private String heatmapData; // JSON string of heatmap data

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 