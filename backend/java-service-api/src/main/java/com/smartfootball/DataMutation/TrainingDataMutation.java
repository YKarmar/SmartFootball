package com.smartfootball.DataMutation;

import com.smartfootball.entity.TrainingData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TrainingDataMutation {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public TrainingDataMutation(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public TrainingData createTrainingData(TrainingData trainingData) {
        String id = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        String sql = "INSERT INTO training_data (id, user_id, session_start, session_end, " +
                    "accelerometer_data, gyroscope_data, heart_rate_data, gps_data, created_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
            id,
            trainingData.getUserId(),
            trainingData.getSessionStart(),
            trainingData.getSessionEnd(),
            trainingData.getAccelerometerData(),
            trainingData.getGyroscopeData(),
            trainingData.getHeartRateData(),
            trainingData.getGpsData(),
            now
        );

        trainingData.setId(id);
        trainingData.setCreatedAt(now);
        return trainingData;
    }

    public TrainingData updateTrainingData(String id, TrainingData updatedData) {
        if (!existsById(id)) {
            throw new RuntimeException("Training data not found.");
        }

        String sql = "UPDATE training_data SET " +
                    "session_start = ?, " +
                    "session_end = ?, " +
                    "accelerometer_data = ?, " +
                    "gyroscope_data = ?, " +
                    "heart_rate_data = ?, " +
                    "gps_data = ? " +
                    "WHERE id = ?";

        jdbcTemplate.update(sql,
            updatedData.getSessionStart(),
            updatedData.getSessionEnd(),
            updatedData.getAccelerometerData(),
            updatedData.getGyroscopeData(),
            updatedData.getHeartRateData(),
            updatedData.getGpsData(),
            id
        );

        updatedData.setId(id);
        return updatedData;
    }

    public List<TrainingData> getTrainingDataByUserId(String userId) {
        String sql = "SELECT * FROM training_data WHERE user_id = ?";
        return jdbcTemplate.query(sql, new TrainingDataRowMapper(), userId);
    }

    public TrainingData getTrainingDataById(String id) {
        String sql = "SELECT * FROM training_data WHERE id = ?";
        List<TrainingData> data = jdbcTemplate.query(sql, new TrainingDataRowMapper(), id);
        return data.isEmpty() ? null : data.get(0);
    }

    private boolean existsById(String id) {
        String sql = "SELECT COUNT(*) FROM training_data WHERE id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    private static class TrainingDataRowMapper implements RowMapper<TrainingData> {
        @Override
        public TrainingData mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
            TrainingData data = new TrainingData();
            data.setId(rs.getString("id"));
            data.setUserId(rs.getString("user_id"));
            data.setSessionStart(rs.getTimestamp("session_start").toLocalDateTime());
            data.setSessionEnd(rs.getTimestamp("session_end").toLocalDateTime());
            data.setAccelerometerData(rs.getString("accelerometer_data"));
            data.setGyroscopeData(rs.getString("gyroscope_data"));
            data.setHeartRateData(rs.getString("heart_rate_data"));
            data.setGpsData(rs.getString("gps_data"));
            data.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            return data;
        }
    }
} 