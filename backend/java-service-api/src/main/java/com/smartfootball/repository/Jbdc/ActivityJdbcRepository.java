package com.smartfootball.repository.Jbdc;

import com.smartfootball.entity.Activity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.lang.NonNull;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * 纯 JDBC 实现的 Activity 数据访问层（DAO）。
 */
@Repository
@Transactional
public class ActivityJdbcRepository {

    private final JdbcTemplate jdbcTemplate;

    public ActivityJdbcRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * 插入一条新的 Activity 记录。
     */
    public Activity createActivity(Activity activity) {
        String id = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        String sql = "INSERT INTO activities " +
                     "(id, user_id, activity_type, start_time, end_time, " +
                     "duration, distance, calories_burned, " +
                     "average_heart_rate, max_heart_rate, " +
                     "activity_data, created_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
            id,
            activity.getUserId(),
            activity.getActivityType(),
            activity.getStartTime(),
            activity.getEndTime(),
            activity.getDuration(),
            activity.getDistance(),
            activity.getCaloriesBurned(),
            activity.getAverageHeartRate(),
            activity.getMaxHeartRate(),
            activity.getActivityData(),
            now
        );

        activity.setId(id);
        activity.setCreatedAt(now);
        return activity;
    }

    /**
     * 更新已有的 Activity 记录。
     */
    public Activity updateActivity(String id, Activity activity) {
        if (!existsById(id)) {
            throw new IllegalArgumentException("Activity not found: " + id);
        }
        String sql = "UPDATE activities SET " +
                     "activity_type = ?, " +
                     "start_time = ?, " +
                     "end_time = ?, " +
                     "duration = ?, " +
                     "distance = ?, " +
                     "calories_burned = ?, " +
                     "average_heart_rate = ?, " +
                     "max_heart_rate = ?, " +
                     "activity_data = ? " +
                     "WHERE id = ?";

        jdbcTemplate.update(sql,
            activity.getActivityType(),
            activity.getStartTime(),
            activity.getEndTime(),
            activity.getDuration(),
            activity.getDistance(),
            activity.getCaloriesBurned(),
            activity.getAverageHeartRate(),
            activity.getMaxHeartRate(),
            activity.getActivityData(),
            id
        );

        activity.setId(id);
        return activity;
    }

    /**
     * 根据 userId 查询所有 Activity。
     */
    public List<Activity> getActivitiesByUserId(String userId) {
        String sql = "SELECT * FROM activities WHERE user_id = ?";
        return jdbcTemplate.query(sql, new ActivityRowMapper(), userId);
    }

    /**
     * 根据 id 查询单条 Activity。
     */
    public Activity getActivityById(String id) {
        String sql = "SELECT * FROM activities WHERE id = ?";
        List<Activity> list = jdbcTemplate.query(sql, new ActivityRowMapper(), id);
        return list.isEmpty() ? null : list.get(0);
    }

    /**
     * 判断某条记录是否存在。
     */
    private boolean existsById(String id) {
        String sql = "SELECT COUNT(*) FROM activities WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * Activity 属性映射器。
     */
    private static class ActivityRowMapper implements RowMapper<Activity> {
        @Override
        public Activity mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            Activity a = new Activity();
            a.setId(rs.getString("id"));
            a.setUserId(rs.getString("user_id"));
            a.setActivityType(rs.getString("activity_type"));
            a.setStartTime(rs.getTimestamp("start_time").toLocalDateTime());
            a.setEndTime(rs.getTimestamp("end_time").toLocalDateTime());
            a.setDuration(rs.getInt("duration"));
            a.setDistance(
                rs.getObject("distance") != null ? rs.getFloat("distance") : null
            );
            a.setCaloriesBurned(
                rs.getObject("calories_burned") != null ? rs.getFloat("calories_burned") : null
            );
            a.setAverageHeartRate(
                rs.getObject("average_heart_rate") != null ? rs.getFloat("average_heart_rate") : null
            );
            a.setMaxHeartRate(
                rs.getObject("max_heart_rate") != null ? rs.getFloat("max_heart_rate") : null
            );
            a.setActivityData(rs.getString("activity_data"));
            a.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            return a;
        }
    }
}
