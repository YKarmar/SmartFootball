package com.smartfootball.DataMutation;

import com.smartfootball.entity.User;
import com.smartfootball.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;  
import java.time.LocalDateTime;
import org.springframework.jdbc.core.JdbcTemplate;


@Service
public class UserDataMutation {

    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;
    @Autowired
    public UserDataMutation(UserRepository userRepository, JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    // 新建用户（带用户名/邮箱唯一性校验）
    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("The username already exists.");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("The email already exists.");
        }
        // 生成UUID作为ID
        user.setId(UUID.randomUUID().toString());
        String id = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();

        String sql = "INSERT INTO users (id, username, password, email, full_name, age, height, weight, position, skill_level, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
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

        // 设置生成的ID和时间戳
        user.setId(id);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        return user;
    }

    // 获取所有用户
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 通过ID查找用户
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // 通过用户名查找用户
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // 通过邮箱查找用户
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // 更新用户
    public User updateUser(String id, User updatedUser) {
        // 先检查用户是否存在
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found.");
        }
    
        LocalDateTime now = LocalDateTime.now();
        String sql = "UPDATE users SET " +
                    "username = ?, " +
                    "email = ?, " +
                    "full_name = ?, " +
                    "age = ?, " +
                    "height = ?, " +
                    "weight = ?, " +
                    "position = ?, " +
                    "skill_level = ?, " +
                    "updated_at = ? " +
                    "WHERE id = ?";
    
        jdbcTemplate.update(sql,
            updatedUser.getUsername(),
            updatedUser.getEmail(),
            updatedUser.getFullName(),
            updatedUser.getAge(),
            updatedUser.getHeight(),
            updatedUser.getWeight(),
            updatedUser.getPosition(),
            updatedUser.getSkillLevel(),
            now,
            id
        );
    
        // 更新返回对象的时间戳
        updatedUser.setId(id);
        updatedUser.setUpdatedAt(now);
        
        return updatedUser;
    }

    // 删除用户
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found, can not delete.");
        }
        userRepository.deleteById(id);
    }

    // 判断用户名或邮箱是否已存在
    public boolean isUsernameTaken(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean isEmailTaken(String email) {
        return userRepository.existsByEmail(email);
    }
}
