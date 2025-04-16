package com.smartfootball.service;

import com.smartfootball.entity.Activity;
import com.smartfootball.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ActivityService {
    Activity createActivity(Activity activity);
    Optional<Activity> getActivityById(Long id);
    List<Activity> getActivitiesByUser(User user);
    List<Activity> getActivitiesByUserAndTimeRange(User user, LocalDateTime startTime, LocalDateTime endTime);
    List<Activity> getActivitiesByUserAndType(User user, String activityType);
    Activity updateActivity(Activity activity);
    void deleteActivity(Long id);
} 