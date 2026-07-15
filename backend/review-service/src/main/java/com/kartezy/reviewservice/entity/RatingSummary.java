package com.kartezy.reviewservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "rating_summaries", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"targetType", "targetId"})
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingSummary {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private Review.TargetType targetType;

    @Column(nullable = false)
    private UUID targetId;

    @Column(nullable = false)
    private Double averageRating;

    @Column(nullable = false)
    private Long totalReviews;

    @Column(nullable = false)
    private Long fiveStarCount;

    @Column(nullable = false)
    private Long fourStarCount;

    @Column(nullable = false)
    private Long threeStarCount;

    @Column(nullable = false)
    private Long twoStarCount;

    @Column(nullable = false)
    private Long oneStarCount;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        lastUpdated = LocalDateTime.now();
        if (averageRating == null) averageRating = 0.0;
        if (totalReviews == null) totalReviews = 0L;
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}
