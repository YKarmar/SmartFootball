package com.smartfootball.repository;

import com.smartfootball.entity.TrainingData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrainingDataRepository
    extends JpaRepository<TrainingData, String> {

    List<TrainingData> findByUserId(
        String userId
    );

    List<TrainingData> findByUserIdAndCreatedAtBetween(
        String userId,
        LocalDateTime from,
        LocalDateTime to
    );

    List<TrainingData> findByUserIdAndSessionStartBetween(
        String userId,
        LocalDateTime start,
        LocalDateTime end
    );
}