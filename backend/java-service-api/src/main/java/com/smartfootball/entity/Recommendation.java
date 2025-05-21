package com.smartfootball.entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // 如果希望自动生成 id
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "recommendation_type", nullable = false)
    private String recommendationType;

    // This will store the concise summary from the LLM
    @Column(name = "title", nullable = false, length = 500) // Increased length for summary
    private String title;

    // This will store the detailed analysis from the first LLM
    @Lob // Use @Lob for potentially long text, maps to TEXT or similar
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "priority", nullable = false)
    private int priority = 1;  // Default to Medium (0=Low, 1=Medium, 2=High)

    @Column(name = "status", nullable = false)
    private String status = "new";  // Default status is 'new' to match frontend

    @Lob // For potentially long user queries
    @Column(name = "original_query") // New column
    private String originalQuery;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; 

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getRecommendationType() { return recommendationType; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public int getPriority() { return priority; }
    public String getStatus() { return status; }
    public String getOriginalQuery() { return originalQuery; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(String id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setRecommendationType(String recommendationType) { this.recommendationType = recommendationType; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setPriority(int priority) { this.priority = priority; }
    public void setStatus(String status) { this.status = status; }
    public void setOriginalQuery(String originalQuery) { this.originalQuery = originalQuery; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
