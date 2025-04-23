package com.smartfootball.controller;

import com.smartfootball.entity.Recommendation;
import com.smartfootball.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final RecommendationService svc;

    public RecommendationController(
        RecommendationService svc
    ) {
        this.svc = svc;
    }

    @PostMapping
    public ResponseEntity<Recommendation>
    create(
        @RequestBody Recommendation r
    ) {
        return ResponseEntity.ok(
            svc.createRecommendation(r)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recommendation>
    getById(
        @PathVariable String id
    ) {
        return svc
            .getRecommendationById(id)
            .map(ResponseEntity::ok)
            .orElse(
                ResponseEntity.notFound().build()
            );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>>
    getByUser(
        @PathVariable String userId
    ) {
        return ResponseEntity.ok(
            svc.getRecommendationsByUserId(userId)
        );
    }

    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<Recommendation>>
    getByUserType(
        @PathVariable String userId,
        @PathVariable String type
    ) {
        return ResponseEntity.ok(
            svc.getRecommendationsByUserIdAndType(
                userId,
                type
            )
        );
    }

    @GetMapping("/user/{userId}/range")
    public ResponseEntity<List<Recommendation>>
    getByUserRange(
        @PathVariable String userId,
        @RequestParam String from,
        @RequestParam String to
    ) {
        return ResponseEntity.ok(
            svc.getRecommendationsByUserIdAndTimeRange(
                userId,
                LocalDateTime.parse(from),
                LocalDateTime.parse(to)
            )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Recommendation>
    update(
        @PathVariable String id,
        @RequestBody Recommendation r
    ) {
        r.setId(id);
        return ResponseEntity.ok(
            svc.updateRecommendation(r)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    delete(
        @PathVariable String id
    ) {
        svc.deleteRecommendation(id);
        return ResponseEntity.noContent().build();
    }
}