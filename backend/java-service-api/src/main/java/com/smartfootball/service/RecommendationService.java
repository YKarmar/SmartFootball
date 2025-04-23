package com.smartfootball.service;

import com.smartfootball.entity.Recommendation;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RecommendationService {
    Recommendation createRecommendation(
        Recommendation r
    );

    Optional<Recommendation> getRecommendationById(
        String id
    );

    List<Recommendation> getRecommendationsByUserId(
        String userId
    );

    List<Recommendation> getRecommendationsByUserIdAndType(
        String userId,
        String type
    );

    List<Recommendation> getRecommendationsByUserIdAndTimeRange(
        String userId,
        LocalDateTime from,
        LocalDateTime to
    );

    Recommendation updateRecommendation(
        Recommendation r
    );

    void deleteRecommendation(
        String id
    );
}