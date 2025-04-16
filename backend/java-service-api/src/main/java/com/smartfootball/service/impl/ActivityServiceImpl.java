package com.smartfootball.service.impl;

import com.smartfootball.entity.Activity;
import com.smartfootball.entity.User;
import com.smartfootball.repository.ActivityRepository;
import com.smartfootball.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;

    @Autowired
    public ActivityServiceImpl(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    @Override
    public Activity createActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    @Override
    public Optional<Activity> getActivityById(Long id) {
        return activityRepository.findById(id);
    }

    @Override
    public List<Activity> getActivitiesByUser(User user) {
        return activityRepository.findByUser(user);
    }

    @Override
    public List<Activity> getActivitiesByUserAndTimeRange(User user, LocalDateTime startTime, LocalDateTime endTime) {
        return activityRepository.findByUserAndStartTimeBetween(user, startTime, endTime);
    }

    @Override
    public List<Activity> getActivitiesByUserAndType(User user, String activityType) {
        return activityRepository.findByUserAndActivityType(user, activityType);
    }

    @Override
    public Activity updateActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    @Override
    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }
} 