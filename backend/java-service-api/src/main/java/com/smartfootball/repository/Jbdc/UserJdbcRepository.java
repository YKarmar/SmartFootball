package com.smartfootball.repository.Jbdc;

import com.smartfootball.entity.User;

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

@Repository
@Transactional
public class UserJdbcRepository {
    private final JdbcTemplate jdbc;

    public UserJdbcRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public User createUser(User user) {
        String id  = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        String sql =
          "INSERT INTO users " +
          "(id, username, password, email, full_name, age, " +
          " height, weight, position, " +
          " skill_level, created_at, updated_at) " +
          "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbc.update(sql,
          id,
          user.getUsername(),
          user.getPassword(),
          user.getEmail(),
          user.getFullName(),
          user.getAge(),
          user.getHeight(),
          user.getWeight(),
          user.getPosition(),
          user.getSkillLevel(),
          now,
          now
        );

        user.setId(id);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        return user;
    }

    public User updateUser(String id, User upd) {
        LocalDateTime now = LocalDateTime.now();
        String sql =
          "UPDATE users SET " +
          "username = ?, email = ?, full_name = ?, age = ?, " +
          "height = ?, weight = ?, position = ?, " +
          "skill_level = ?, updated_at = ? " +
          "WHERE id = ?";

        jdbc.update(sql,
          upd.getUsername(),
          upd.getEmail(),
          upd.getFullName(),
          upd.getAge(),
          upd.getHeight(),
          upd.getWeight(),
          upd.getPosition(),
          upd.getSkillLevel(),
          now,
          id
        );

        upd.setId(id);
        upd.setUpdatedAt(now);
        return upd;
    }

    public void deleteUser(String id) {
        String sql = "DELETE FROM users WHERE id = ?";
        jdbc.update(sql, id);
    }

    public List<User> findAll() {
        String sql = "SELECT * FROM users";
        return jdbc.query(sql, new UserRowMapper());
    }

    public User findById(String id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        List<User> list = jdbc.query(sql, new UserRowMapper(), id);
        return list.isEmpty() ? null : list.get(0);
    }

    private static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(@NonNull ResultSet rs,
                           int rowNum) throws SQLException {
            User u = new User();
            u.setId(rs.getString("id"));
            u.setUsername(rs.getString("username"));
            u.setPassword(rs.getString("password"));
            u.setEmail(rs.getString("email"));
            u.setFullName(rs.getString("full_name"));
            u.setAge(
              rs.getObject("age") != null
                ? rs.getInt("age")
                : null
            );
            u.setHeight(
              rs.getObject("height") != null
                ? rs.getFloat("height")
                : null
            );
            u.setWeight(
              rs.getObject("weight") != null
                ? rs.getFloat("weight")
                : null
            );
            u.setPosition(rs.getString("position"));
            u.setSkillLevel(rs.getString("skill_level"));
            u.setCreatedAt(
              rs.getTimestamp("created_at")
                .toLocalDateTime()
            );
            u.setUpdatedAt(
              rs.getTimestamp("updated_at")
                .toLocalDateTime()
            );
            return u;
        }
    }
}