package com.smartfootball.service.impl;

import com.smartfootball.entity.Recommendation;
import com.smartfootball.repository.RecommendationRepository;
import com.smartfootball.repository.Jbdc.RecommendationJdbcRepository;
import com.smartfootball.service.RecommendationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RecommendationServiceImpl
    implements RecommendationService {

    private final RecommendationRepository repo;
    private final RecommendationJdbcRepository jdbc;

    public RecommendationServiceImpl(
        RecommendationRepository repo,
        RecommendationJdbcRepository jdbc
    ) {
        this.repo = repo;
        this.jdbc = jdbc;
    }

    @Override
    public Recommendation createRecommendation(
        Recommendation r
    ) {
        return jdbc.createRecommendation(r);
    }

    @Override
    public Optional<Recommendation> getRecommendationById(
        String id
    ) {
        return Optional.ofNullable(jdbc.getById(id));
    }

    @Override
    public List<Recommendation> getRecommendationsByUserId(
        String userId
    ) {
        return jdbc.getByUserId(userId);
    }

    @Override
    public List<Recommendation> getRecommendationsByUserIdAndType(
        String userId,
        String type
    ) {
        return repo.findByUserIdAndRecommendationType(
            userId,
            type
        );
    }

    @Override
    public List<Recommendation> getRecommendationsByUserIdAndTimeRange(
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
    public Recommendation updateRecommendation(
        Recommendation r
    ) {
        jdbc.updateRecommendation(r.getId(), r);
        return r;
    }

    @Override
    public void deleteRecommendation(
        String id
    ) {
        repo.deleteById(id);
    }
}