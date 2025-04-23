package com.smartfootball.service;

import com.smartfootball.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    List<User> getAllUsers();
    Optional<User> getUserById(String id);
    Optional<User> getUserByUsername(String username);
    Optional<User> getUserByEmail(String email);
    User updateUser(String id, User user);
    void deleteUser(String id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}