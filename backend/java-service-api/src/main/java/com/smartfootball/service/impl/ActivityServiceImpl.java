package com.smartfootball.service.impl;

import com.smartfootball.entity.Activity;
import com.smartfootball.repository.ActivityRepository;
import com.smartfootball.repository.Jbdc.ActivityJdbcRepository;
import com.smartfootball.service.ActivityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;
    private final ActivityJdbcRepository jdbcRepository;

    public ActivityServiceImpl(ActivityRepository activityRepository,
                               ActivityJdbcRepository jdbcRepository) {
        this.activityRepository = activityRepository;
        this.jdbcRepository = jdbcRepository;
    }

    @Override
    public Activity createActivity(Activity activity) {
        // use JDBC repository for insert
        return jdbcRepository.createActivity(activity);
    }

    @Override
    public Optional<Activity> getActivityById(String id) {
        // delegate to JDBC and wrap
        return Optional.ofNullable(jdbcRepository.getActivityById(id));
    }

    @Override
    public List<Activity> getActivitiesByUserId(String userId) {
        return jdbcRepository.getActivitiesByUserId(userId);
    }

    @Override
    public List<Activity> getActivitiesByUserIdAndTimeRange(String userId, LocalDateTime startTime, LocalDateTime endTime) {
        // fall back to JPA for range query
        return activityRepository.findByUserIdAndStartTimeBetween(userId, startTime, endTime);
    }

    @Override
    public List<Activity> getActivitiesByUserIdAndType(String userId, String activityType) {
        // fall back to JPA for type filter
        return activityRepository.findByUserIdAndActivityType(userId, activityType);
    }

    @Override
    public Activity updateActivity(Activity activity) {
        // use JDBC for update
        jdbcRepository.updateActivity(activity.getId(), activity);
        return activity;
    }

    @Override
    public void deleteActivity(String id) {
        activityRepository.deleteById(id);
    }
}