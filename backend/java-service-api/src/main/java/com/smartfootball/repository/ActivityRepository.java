package com.smartfootball.repository;

import com.smartfootball.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, String> {
    List<Activity> findByUserId(String userId);
    List<Activity> findByUserIdAndStartTimeBetween(String userId, LocalDateTime startTime, LocalDateTime endTime);
    List<Activity> findByUserIdAndActivityType(String userId, String activityType);
}
