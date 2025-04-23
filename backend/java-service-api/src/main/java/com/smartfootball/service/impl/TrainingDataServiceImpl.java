package com.smartfootball.service.impl;

import com.smartfootball.entity.TrainingData;
import com.smartfootball.repository.TrainingDataRepository;
import com.smartfootball.repository.Jbdc.TrainingDataJdbcRepository;
import com.smartfootball.service.TrainingDataService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TrainingDataServiceImpl
    implements TrainingDataService {

    private final TrainingDataRepository repo;
    private final TrainingDataJdbcRepository jdbc;

    public TrainingDataServiceImpl(
        TrainingDataRepository repo,
        TrainingDataJdbcRepository jdbc
    ) {
        this.repo = repo;
        this.jdbc = jdbc;
    }

    @Override
    public TrainingData createTrainingData(
        TrainingData d
    ) {
        return jdbc.createTrainingData(d);
    }

    @Override
    public Optional<TrainingData> getTrainingDataById(
        String id
    ) {
        return Optional.ofNullable(
            jdbc.getById(id)
        );
    }

    @Override
    public List<TrainingData> getTrainingDataByUserId(
        String userId
    ) {
        return jdbc.getByUserId(userId);
    }

    @Override
    public List<TrainingData> getTrainingDataByUserIdAndSession(
        String userId,
        LocalDateTime start,
        LocalDateTime end
    ) {
        return repo.findByUserIdAndSessionStartBetween(
            userId,
            start,
            end
        );
    }

    @Override
    public List<TrainingData> getTrainingDataByUserIdAndTimeRange(
        String userId,
        LocalDateTime from,
        LocalDateTime to
    ) {
        return repo.findByUserIdAndCreatedAtBetween(
            userId,
            from,
            to
        );
    }

    @Override
    public TrainingData updateTrainingData(
        TrainingData d
    ) {
        jdbc.updateTrainingData(
            d.getId(),
            d
        );
        return d;
    }

    @Override
    public void deleteTrainingData(
        String id
    ) {
        repo.deleteById(id);
    }
}