package com.smartfootball.repository.Jbdc;

import com.smartfootball.entity.TrainingData;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@Transactional
public class TrainingDataJdbcRepository {
    private final JdbcTemplate jdbc;

    public TrainingDataJdbcRepository(
        JdbcTemplate jdbc
    ) {
        this.jdbc = jdbc;
    }

    public TrainingData createTrainingData(
        TrainingData d
    ) {
        String id = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        String sql =
            "INSERT INTO training_data " +
            "(id, user_id, session_start, session_end, " +
            "accelerometer_data, gyroscope_data, " +
            "heart_rate_data, gps_data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbc.update(
            sql,
            id,
            d.getUserId(),
            d.getSessionStart(),
            d.getSessionEnd(),
            d.getAccelerometerData(),
            d.getGyroscopeData(),
            d.getHeartRateData(),
            d.getGpsData(),
            now
        );

        d.setId(id);
        d.setCreatedAt(now);
        return d;
    }

    public TrainingData updateTrainingData(
        String id,
        TrainingData d
    ) {
        if (!exists(id)) {
            throw new IllegalArgumentException(
                "Training data not found: " + id
            );
        }

        String sql =
            "UPDATE training_data SET session_start = ?, session_end = ?, " +
            "accelerometer_data = ?, gyroscope_data = ?, " +
            "heart_rate_data = ?, gps_data = ? WHERE id = ?";

        jdbc.update(
            sql,
            d.getSessionStart(),
            d.getSessionEnd(),
            d.getAccelerometerData(),
            d.getGyroscopeData(),
            d.getHeartRateData(),
            d.getGpsData(),
            id
        );

        d.setId(id);
        return d;
    }

    public List<TrainingData> getByUserId(
        String userId
    ) {
        String sql =
            "SELECT * FROM training_data WHERE user_id = ?";

        return jdbc.query(
            sql,
            new RowMapper<TrainingData>() {
                @Override
                public TrainingData mapRow(
                    ResultSet rs,
                    int rowNum
                ) throws SQLException {
                    TrainingData d = new TrainingData();
                    d.setId(rs.getString("id"));
                    d.setUserId(rs.getString("user_id"));
                    d.setSessionStart(
                        rs.getTimestamp("session_start")
                          .toLocalDateTime()
                    );
                    d.setSessionEnd(
                        rs.getTimestamp("session_end")
                          .toLocalDateTime()
                    );
                    d.setAccelerometerData(
                        rs.getString("accelerometer_data")
                    );
                    d.setGyroscopeData(
                        rs.getString("gyroscope_data")
                    );
                    d.setHeartRateData(
                        rs.getString("heart_rate_data")
                    );
                    d.setGpsData(
                        rs.getString("gps_data")
                    );
                    d.setCreatedAt(
                        rs.getTimestamp("created_at")
                          .toLocalDateTime()
                    );
                    return d;
                }
            },
            userId
        );
    }

    public TrainingData getById(
        String id
    ) {
        String sql =
            "SELECT * FROM training_data WHERE id = ?";
        List<TrainingData> list =
            jdbc.query(
                sql,
                new RowMapper<TrainingData>() {
                    @Override
                    public TrainingData mapRow(
                        ResultSet rs,
                        int rowNum
                    ) throws SQLException {
                        TrainingData d = new TrainingData();
                        d.setId(rs.getString("id"));
                        d.setUserId(rs.getString("user_id"));
                        d.setSessionStart(
                            rs.getTimestamp("session_start")
                              .toLocalDateTime()
                        );
                        d.setSessionEnd(
                            rs.getTimestamp("session_end")
                              .toLocalDateTime()
                        );
                        d.setAccelerometerData(
                            rs.getString("accelerometer_data")
                        );
                        d.setGyroscopeData(
                            rs.getString("gyroscope_data")
                        );
                        d.setHeartRateData(
                            rs.getString("heart_rate_data")
                        );
                        d.setGpsData(
                            rs.getString("gps_data")
                        );
                        d.setCreatedAt(
                            rs.getTimestamp("created_at")
                              .toLocalDateTime()
                        );
                        return d;
                    }
                },
                id
            );

        return list.isEmpty() ? null : list.get(0);
    }

    private boolean exists(
        String id
    ) {
        String sql =
            "SELECT COUNT(*) FROM training_data WHERE id = ?";
        Integer cnt = jdbc.queryForObject(
            sql,
            Integer.class,
            id
        );
        return cnt != null && cnt > 0;
    }
}