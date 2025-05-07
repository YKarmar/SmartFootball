package com.smartfootball.DataMutation;

import com.smartfootball.entity.Activity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.lang.NonNull;

@Service
@Transactional
public class ActivityDataMutation {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ActivityDataMutation(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * 创建一条新的 Activity 记录
     */
    public Activity createActivity(Activity activity) {
        String id = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        String sql = "INSERT INTO activities (id, user_id, activity_type, start_time, end_time, " +
                     "duration, distance, calories_burned, average_heart_rate, max_heart_rate, " +
                     "activity_data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
            id,
            activity.getUserId(),            // <-- 直接使用 userId 字符串
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
     * 更新一条已存在的 Activity 记录
     */
    public Activity updateActivity(String id, Activity activity) {
        if (!existsById(id)) {
            throw new RuntimeException("Activity not found: " + id);
        }

        String sql = "UPDATE activities SET " +
                     "activity_type       = ?, " +
                     "start_time          = ?, " +
                     "end_time            = ?, " +
                     "duration            = ?, " +
                     "distance            = ?, " +
                     "calories_burned     = ?, " +
                     "average_heart_rate  = ?, " +
                     "max_heart_rate      = ?, " +
                     "activity_data       = ? " +
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
     * 根据 userId 查询所有 Activity
     */
    public List<Activity> getActivitiesByUserId(String userId) {
        String sql = "SELECT * FROM activities WHERE user_id = ?";
        return jdbcTemplate.query(sql, new ActivityRowMapper(), userId);
    }

    /**
     * 根据 id 查询单条 Activity
     */
    public Activity getActivityById(String id) {
        String sql = "SELECT * FROM activities WHERE id = ?";
        List<Activity> list = jdbcTemplate.query(sql, new ActivityRowMapper(), id);
        return list.isEmpty() ? null : list.get(0);
    }

    /**
     * 判断一条 Activity 是否存在
     */
    private boolean existsById(String id) {
        String sql = "SELECT COUNT(*) FROM activities WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    /**
     * 自定义 RowMapper，手动映射所有字段，包括 userId
     */
    private static class ActivityRowMapper implements RowMapper<Activity> {
        @Override
        public Activity mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            Activity activity = new Activity();
            activity.setId(rs.getString("id"));
            activity.setUserId(rs.getString("user_id"));                            // <-- 映射 user_id
            activity.setActivityType(rs.getString("activity_type"));
            activity.setStartTime(rs.getTimestamp("start_time").toLocalDateTime());
            activity.setEndTime(rs.getTimestamp("end_time").toLocalDateTime());
            activity.setDuration(rs.getInt("duration"));
            // 对可能为 NULL 的浮点字段做检查
            activity.setDistance(rs.getObject("distance") != null ? rs.getFloat("distance") : null);
            activity.setCaloriesBurned(
                rs.getObject("calories_burned") != null ? rs.getFloat("calories_burned") : null);
            activity.setAverageHeartRate(
                rs.getObject("average_heart_rate") != null ? rs.getFloat("average_heart_rate") : null);
            activity.setMaxHeartRate(
                rs.getObject("max_heart_rate") != null ? rs.getFloat("max_heart_rate") : null);
            activity.setActivityData(rs.getString("activity_data"));
            activity.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            return activity;
        }
    }
}
