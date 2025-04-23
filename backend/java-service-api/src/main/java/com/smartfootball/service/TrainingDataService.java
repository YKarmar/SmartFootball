package com.smartfootball.service;

import com.smartfootball.entity.TrainingData;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TrainingDataService {
    TrainingData createTrainingData(
        TrainingData d
    );

    Optional<TrainingData> getTrainingDataById(
        String id
    );

    List<TrainingData> getTrainingDataByUserId(
        String userId
    );

    List<TrainingData> getTrainingDataByUserIdAndSession(
        String userId,
        LocalDateTime start,
        LocalDateTime end
    );

    List<TrainingData> getTrainingDataByUserIdAndTimeRange(
        String userId,
        LocalDateTime from,
        LocalDateTime to
    );

    TrainingData updateTrainingData(
        TrainingData d
    );

    void deleteTrainingData(
        String id
    );
}