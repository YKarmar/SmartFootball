package com.smartfootball.DataMutation;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import com.smartfootball.entity.Recommendation;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Service
@Transactional
public class RecommendationDataMutation {

    private final JdbcTemplate jdbc;

    @Autowired
    public RecommendationDataMutation(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * 创建一条新的 Recommendation 记录
     */
    public Recommendation createRecommendation(Recommendation rec) {
        String id = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        String sql = "INSERT INTO recommendations "
                   + "(id, user_id, recommendation_type, title, description, priority, status, created_at, updated_at) "
                   + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbc.update(sql,
                   id,
                   rec.getUserId(),
                   rec.getRecommendationType(),
                   rec.getTitle(),
                   rec.getDescription(),
                   rec.getPriority(),
                   rec.getStatus(),
                   now,
                   now);

        rec.setId(id);
        rec.setCreatedAt(now);
        rec.setUpdatedAt(now);
        return rec;
    }

    /**
     * 更新一条已存在的 Recommendation 记录
     */
    public Recommendation updateRecommendation(String id, Recommendation rec) {
        if (!existsById(id)) {
            throw new RuntimeException("Recommendation not found: " + id);
        }

        LocalDateTime now = LocalDateTime.now();
        String sql = "UPDATE recommendations SET "
                   + "recommendation_type = ?, "
                   + "title               = ?, "
                   + "description         = ?, "
                   + "priority            = ?, "
                   + "status              = ?, "
                   + "updated_at          = ? "
                   + "WHERE id = ?";

        jdbc.update(sql,
                   rec.getRecommendationType(),
                   rec.getTitle(),
                   rec.getDescription(),
                   rec.getPriority(),
                   rec.getStatus(),
                   now,
                   id);

        rec.setId(id);
        rec.setUpdatedAt(now);
        return rec;
    }

    /**
     * 根据 userId 查询所有 Recommendation
     */
    public List<Recommendation> getRecommendationsByUserId(String userId) {
        String sql = "SELECT * FROM recommendations WHERE user_id = ?";
        return jdbc.query(sql,
                          new BeanPropertyRowMapper<>(Recommendation.class),
                          userId);
    }

    /**
     * 根据 id 查询单条 Recommendation
     */
    public Recommendation getRecommendationById(String id) {
        String sql = "SELECT * FROM recommendations WHERE id = ?";
        List<Recommendation> list = jdbc.query(sql,
                                               new BeanPropertyRowMapper<>(Recommendation.class),
                                               id);
        return list.isEmpty() ? null : list.get(0);
    }

    /**
     * 判断一条 Recommendation 是否存在
     */
    private boolean existsById(String id) {
        String sql = "SELECT COUNT(*) FROM recommendations WHERE id = ?";
        Integer cnt = jdbc.queryForObject(sql, Integer.class, id);
        return cnt != null && cnt > 0;
    }
}
