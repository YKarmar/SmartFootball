package com.smartfootball.repository;

import com.smartfootball.entity.Activity;
import com.smartfootball.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByUser(User user);
    List<Activity> findByUserAndStartTimeBetween(User user, LocalDateTime startTime, LocalDateTime endTime);
    List<Activity> findByUserAndActivityType(User user, String activityType);
} 