package com.smartfootball.service;

import com.smartfootball.entity.Activity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ActivityService {
    Activity createActivity(Activity activity);
    Optional<Activity> getActivityById(String id);
    List<Activity> getActivitiesByUserId(String userId);
    List<Activity> getActivitiesByUserIdAndTimeRange(String userId, LocalDateTime from, LocalDateTime to);
    List<Activity> getActivitiesByUserIdAndType(String userId, String activityType);
    Activity updateActivity(Activity activity);
    void deleteActivity(String id);
}