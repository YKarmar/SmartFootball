package com.smartfootball.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
public class Activity {
    @Id
    @Column(length = 36)
    private String id;

    // ====== 外键字段，用 String 存储 user_id ======
    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;

    @Column(name = "activity_type", nullable = false, length = 50)
    private String activityType;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Integer duration;

    @Column
    private Float distance;

    @Column(name = "calories_burned")
    private Float caloriesBurned;

    @Column(name = "average_heart_rate")
    private Float averageHeartRate;

    @Column(name = "max_heart_rate")
    private Float maxHeartRate;

    // JSON 可以先映射成 String，后面再手动 parse
    @Column(name = "activity_data", columnDefinition = "JSON")
    private String activityData;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ====== 关联到 User 实体，不重复映射 user_id 列 ======
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    // ———— Getter & Setter ————
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Float getDistance() { return distance; }
    public void setDistance(Float distance) { this.distance = distance; }

    public Float getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(Float caloriesBurned) { this.caloriesBurned = caloriesBurned; }

    public Float getAverageHeartRate() { return averageHeartRate; }
    public void setAverageHeartRate(Float averageHeartRate) { this.averageHeartRate = averageHeartRate; }

    public Float getMaxHeartRate() { return maxHeartRate; }
    public void setMaxHeartRate(Float maxHeartRate) { this.maxHeartRate = maxHeartRate; }

    public String getActivityData() { return activityData; }
    public void setActivityData(String activityData) { this.activityData = activityData; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public User getUser() { return user; }
    // 不需要 setUser，若真要用，也可以加

    // ———— 自动填充创建时间 ————
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
