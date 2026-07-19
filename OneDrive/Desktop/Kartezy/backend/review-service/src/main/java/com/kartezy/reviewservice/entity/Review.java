package com.kartezy.reviewservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviews", indexes = {
    @Index(name = "idx_review_target", columnList = "targetType,targetId"),
    @Index(name = "idx_review_user", columnList = "userId"),
    @Index(name = "idx_review_status", columnList = "status"),
    @Index(name = "idx_review_rating", columnList = "rating")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private TargetType targetType;

    @Column(nullable = false)
    private UUID targetId;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 2000)
    private String title;

    @Column(length = 5000)
    private String comment;

    @Column(length = 2000)
    private String merchantResponse;

    private LocalDateTime merchantRespondedAt;

    @Column(length = 2000)
    private String adminNote;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ReviewStatus status;

    @Column(name = "is_verified_purchase")
    private boolean verifiedPurchase;

    @Column(nullable = false)
    private boolean isHelpful;

    @Column(nullable = false)
    private Long helpfulCount;

    @Column(nullable = false)
    private Long unhelpfulCount;

    @ElementCollection
    @CollectionTable(name = "review_images", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "image_url", length = 500)
    private java.util.Set<String> imageUrls;

    @Column(length = 500)
    private String videoUrl;

    @Column(length = 50)
    private String orderId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime moderatedAt;

    @Column(length = 100)
    private String moderatedBy;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = ReviewStatus.PENDING;
        if (helpfulCount == null) helpfulCount = 0L;
        if (unhelpfulCount == null) unhelpfulCount = 0L;
        if (imageUrls == null) imageUrls = new java.util.HashSet<>();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TargetType { PRODUCT, MERCHANT, DELIVERY_PARTNER }
    public enum ReviewStatus { PENDING, APPROVED, REJECTED, FLAGGED }
}
