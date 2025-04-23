package com.smartfootball.controller;

import com.smartfootball.entity.Activity;
import com.smartfootball.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService svc;

    public ActivityController(ActivityService svc) {
        this.svc = svc;
    }

    @PostMapping
    public ResponseEntity<Activity> create(@RequestBody Activity activity) {
        Activity saved = svc.createActivity(activity);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getById(@PathVariable String id) {
        return svc.getActivityById(id)
                  .map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Activity>> getByUser(@PathVariable String userId) {
        List<Activity> list = svc.getActivitiesByUserId(userId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/user/{userId}/range")
    public ResponseEntity<List<Activity>> getByUserAndRange(
        @PathVariable String userId,
        @RequestParam("from") String from,
        @RequestParam("to")   String to) {
        List<Activity> list = svc.getActivitiesByUserIdAndTimeRange(
            userId,
            LocalDateTime.parse(from),
            LocalDateTime.parse(to)
        );
        return ResponseEntity.ok(list);
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<Activity>> getByUserAndType(
        @PathVariable String userId,
        @PathVariable String type) {
        return ResponseEntity.ok(svc.getActivitiesByUserIdAndType(userId, type));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> update(
        @PathVariable String id,
        @RequestBody Activity body) {
        body.setId(id);
        Activity updated = svc.updateActivity(body);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        svc.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }
}
