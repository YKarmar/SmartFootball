package com.smartfootball.repository;

import com.smartfootball.entity.AppleHealthData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppleHealthDataRepository extends JpaRepository<AppleHealthData, String> {
    
    List<AppleHealthData> findByUserId(String userId);
    
    List<AppleHealthData> findByUserIdOrderByStartDateDesc(String userId);
    
    List<AppleHealthData> findByUserIdAndWorkoutType(String userId, String workoutType);
    
    List<AppleHealthData> findByUserIdAndStartDateBetween(String userId, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT ahd FROM AppleHealthData ahd WHERE ahd.userId = :userId AND ahd.startDate >= :fromDate ORDER BY ahd.startDate DESC")
    List<AppleHealthData> findRecentDataByUserId(@Param("userId") String userId, @Param("fromDate") LocalDateTime fromDate);
    
    @Query("SELECT COUNT(ahd) FROM AppleHealthData ahd WHERE ahd.userId = :userId")
    Long countByUserId(@Param("userId") String userId);
    
    @Query("SELECT ahd FROM AppleHealthData ahd WHERE ahd.userId = :userId AND ahd.workoutType IN :workoutTypes ORDER BY ahd.startDate DESC")
    List<AppleHealthData> findByUserIdAndWorkoutTypes(@Param("userId") String userId, @Param("workoutTypes") List<String> workoutTypes);
    
    @Query("SELECT MIN(ahd.startDate) FROM AppleHealthData ahd WHERE ahd.userId = :userId")
    Optional<LocalDateTime> findEarliestDataByUserId(@Param("userId") String userId);
    
    @Query("SELECT MAX(ahd.endDate) FROM AppleHealthData ahd WHERE ahd.userId = :userId")
    Optional<LocalDateTime> findLatestDataByUserId(@Param("userId") String userId);
    
    @Query("SELECT ahd FROM AppleHealthData ahd WHERE ahd.userId = :userId AND ahd.importedAt >= :importedAfter ORDER BY ahd.importedAt DESC")
    List<AppleHealthData> findRecentImportsByUserId(@Param("userId") String userId, @Param("importedAfter") LocalDateTime importedAfter);
} 