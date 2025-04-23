package com.smartfootball.controller;

import com.smartfootball.entity.User;
import com.smartfootball.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService svc;

    public UserController(
        UserService svc
    ) {
        this.svc = svc;
    }

    @PostMapping
    public ResponseEntity<User> createUser(
        @RequestBody User user
    ) {
        User u = svc.createUser(user);
        return ResponseEntity.ok(u);
    }

    @GetMapping
    public ResponseEntity<List<User>> listUsers() {
        return ResponseEntity.ok(
          svc.getAllUsers()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getById(
        @PathVariable String id
    ) {
        Optional<User> o = svc.getUserById(id);
        return o.map(ResponseEntity::ok)
                .orElseGet(
                  () -> ResponseEntity
                         .notFound()
                         .build()
                );
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getByUsername(
        @PathVariable String username
    ) {
        Optional<User> o =
          svc.getUserByUsername(
            username
          );
        return o.map(ResponseEntity::ok)
                .orElseGet(
                  () -> ResponseEntity
                         .notFound()
                         .build()
                );
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getByEmail(
        @PathVariable String email
    ) {
        Optional<User> o =
          svc.getUserByEmail(email);
        return o.map(ResponseEntity::ok)
                .orElseGet(
                  () -> ResponseEntity
                         .notFound()
                         .build()
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
        @PathVariable String id,
        @RequestBody User user
    ) {
        User u = svc.updateUser(id, user);
        return ResponseEntity.ok(u);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
        @PathVariable String id
    ) {
        svc.deleteUser(id);
        return ResponseEntity.noContent()
                             .build();
    }
}