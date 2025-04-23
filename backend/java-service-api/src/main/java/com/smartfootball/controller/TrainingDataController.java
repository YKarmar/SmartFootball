package com.smartfootball.controller;

import com.smartfootball.entity.TrainingData;
import com.smartfootball.service.TrainingDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/training-data")
public class TrainingDataController {
    private final TrainingDataService svc;

    public TrainingDataController(
        TrainingDataService svc
    ) {
        this.svc = svc;
    }

    @PostMapping
    public ResponseEntity<TrainingData>
    create(
        @RequestBody TrainingData d
    ) {
        return ResponseEntity.ok(
            svc.createTrainingData(d)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingData>
    getById(
        @PathVariable String id
    ) {
        return svc
            .getTrainingDataById(id)
            .map(ResponseEntity::ok)
            .orElse(
                ResponseEntity.notFound().build()
            );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TrainingData>>
    getByUser(
        @PathVariable String userId
    ) {
        return ResponseEntity.ok(
            svc.getTrainingDataByUserId(userId)
        );
    }

    @GetMapping("/user/{userId}/session")
    public ResponseEntity<List<TrainingData>>
    getByUserSession(
        @PathVariable String userId,
        @RequestParam String start,
        @RequestParam String end
    ) {
        return ResponseEntity.ok(
            svc.getTrainingDataByUserIdAndSession(
                userId,
                LocalDateTime.parse(start),
                LocalDateTime.parse(end)
            )
        );
    }

    @GetMapping("/user/{userId}/range")
    public ResponseEntity<List<TrainingData>>
    getByUserRange(
        @PathVariable String userId,
        @RequestParam String from,
        @RequestParam String to
    ) {
        return ResponseEntity.ok(
            svc.getTrainingDataByUserIdAndTimeRange(
                userId,
                LocalDateTime.parse(from),
                LocalDateTime.parse(to)
            )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingData>
    update(
        @PathVariable String id,
        @RequestBody TrainingData d
    ) {
        d.setId(id);
        return ResponseEntity.ok(
            svc.updateTrainingData(d)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    delete(
        @PathVariable String id
    ) {
        svc.deleteTrainingData(id);
        return ResponseEntity.noContent().build();
    }
}
