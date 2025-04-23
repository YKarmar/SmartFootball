package com.smartfootball.repository;

import com.smartfootball.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RecommendationRepository
    extends JpaRepository<Recommendation, String> {

    List<Recommendation> findByUserId(String userId);

    List<Recommendation> findByUserIdAndCreatedAtBetween(
        String userId,
        LocalDateTime from,
        LocalDateTime to
    );

    List<Recommendation> findByUserIdAndRecommendationType(
        String userId,
        String type
    );
}