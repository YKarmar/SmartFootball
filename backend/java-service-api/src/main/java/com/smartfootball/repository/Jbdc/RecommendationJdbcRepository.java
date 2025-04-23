package com.smartfootball.repository.Jbdc;

import com.smartfootball.entity.Recommendation;
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
public class RecommendationJdbcRepository {
    private final JdbcTemplate jdbc;

    public RecommendationJdbcRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Recommendation createRecommendation(
        Recommendation r
    ) {
        String id = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        String sql =
            "INSERT INTO recommendations " +
            "(id, user_id, recommendation_type, title, " +
            "description, priority, status, created_at, " +
            "updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbc.update(
            sql,
            id,
            r.getUserId(),
            r.getRecommendationType(),
            r.getTitle(),
            r.getDescription(),
            r.getPriority(),
            r.getStatus(),
            now,
            now
        );

        r.setId(id);
        r.setCreatedAt(now);
        r.setUpdatedAt(now);
        return r;
    }

    public Recommendation updateRecommendation(
        String id,
        Recommendation r
    ) {
        if (!exists(id)) {
            throw new IllegalArgumentException(
                "Recommendation not found: " + id
            );
        }
        LocalDateTime now = LocalDateTime.now();

        String sql =
            "UPDATE recommendations SET " +
            "recommendation_type = ?, title = ?, description = ?, " +
            "priority = ?, status = ?, updated_at = ? " +
            "WHERE id = ?";

        jdbc.update(
            sql,
            r.getRecommendationType(),
            r.getTitle(),
            r.getDescription(),
            r.getPriority(),
            r.getStatus(),
            now,
            id
        );

        r.setId(id);
        r.setUpdatedAt(now);
        return r;
    }

    public List<Recommendation> getByUserId(
        String userId
    ) {
        String sql =
            "SELECT * FROM recommendations WHERE user_id = ?";

        return jdbc.query(
            sql,
            new RowMapper<Recommendation>() {
                @Override
                public Recommendation mapRow(
                    ResultSet rs,
                    int rowNum
                ) throws SQLException {
                    Recommendation r = new Recommendation();
                    r.setId(rs.getString("id"));
                    r.setUserId(rs.getString("user_id"));
                    r.setRecommendationType(
                        rs.getString("recommendation_type")
                    );
                    r.setTitle(rs.getString("title"));
                    r.setDescription(
                        rs.getString("description")
                    );
                    r.setPriority(rs.getInt("priority"));
                    r.setStatus(rs.getString("status"));
                    r.setCreatedAt(
                        rs.getTimestamp("created_at").toLocalDateTime()
                    );
                    r.setUpdatedAt(
                        rs.getTimestamp("updated_at").toLocalDateTime()
                    );
                    return r;
                }
            },
            userId
        );
    }

    public Recommendation getById(String id) {
        String sql =
            "SELECT * FROM recommendations WHERE id = ?";
        List<Recommendation> list = jdbc.query(
            sql,
            new RowMapper<Recommendation>() {
                @Override
                public Recommendation mapRow(
                    ResultSet rs,
                    int rowNum
                ) throws SQLException {
                    Recommendation r = new Recommendation();
                    r.setId(rs.getString("id"));
                    r.setUserId(rs.getString("user_id"));
                    r.setRecommendationType(
                        rs.getString("recommendation_type")
                    );
                    r.setTitle(rs.getString("title"));
                    r.setDescription(
                        rs.getString("description")
                    );
                    r.setPriority(rs.getInt("priority"));
                    r.setStatus(rs.getString("status"));
                    r.setCreatedAt(
                        rs.getTimestamp("created_at").toLocalDateTime()
                    );
                    r.setUpdatedAt(
                        rs.getTimestamp("updated_at").toLocalDateTime()
                    );
                    return r;
                }
            },
            id
        );

        return list.isEmpty() ? null : list.get(0);
    }

    private boolean exists(String id) {
        String sql =
            "SELECT COUNT(*) FROM recommendations WHERE id = ?";
        Integer cnt = jdbc.queryForObject(sql, Integer.class, id);
        return cnt != null && cnt > 0;
    }
}