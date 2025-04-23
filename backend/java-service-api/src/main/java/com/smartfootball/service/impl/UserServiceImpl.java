package com.smartfootball.service.impl;

import com.smartfootball.entity.User;
import com.smartfootball.repository.UserRepository;
import com.smartfootball.repository.Jbdc.UserJdbcRepository;
import com.smartfootball.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl
    implements UserService {

    private final UserRepository repo;
    private final UserJdbcRepository jdbcRepo;

    public UserServiceImpl(
        UserRepository repo,
        UserJdbcRepository jdbcRepo
    ) {
        this.repo    = repo;
        this.jdbcRepo = jdbcRepo;
    }

    @Override
    public User createUser(User user) {
        if (repo.existsByUsername(
              user.getUsername()
            )) {
            throw new IllegalArgumentException(
              "Username already exists"
            );
        }
        if (repo.existsByEmail(
              user.getEmail()
            )) {
            throw new IllegalArgumentException(
              "Email already exists"
            );
        }
        return jdbcRepo.createUser(user);
    }

    @Override
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    @Override
    public Optional<User> getUserById(
        String id
    ) {
        return repo.findById(id);
    }

    @Override
    public Optional<User> getUserByUsername(
        String username
    ) {
        return repo.findByUsername(username);
    }

    @Override
    public Optional<User> getUserByEmail(
        String email
    ) {
        return repo.findByEmail(email);
    }

    @Override
    public User updateUser(
        String id,
        User user
    ) {
        if (!repo.existsById(id)) {
            throw new RuntimeException(
              "The user does not exist"
            );
        }
        return jdbcRepo.updateUser(id, user);
    }

    @Override
    public void deleteUser(
        String id
    ) {
        if (!repo.existsById(id)) {
            throw new RuntimeException(
              "User does not exist and cannot be deleted"
            );
        }
        repo.deleteById(id);
    }

    @Override
    public boolean existsByUsername(
        String username
    ) {
        return repo.existsByUsername(
          username
        );
    }

    @Override
    public boolean existsByEmail(
        String email
    ) {
        return repo.existsByEmail(email);
    }
}