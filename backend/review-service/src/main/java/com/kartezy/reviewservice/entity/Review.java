package com.kartezy.reviewservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reviews", indexes = {
    @Index(name = "idx_review_product", columnList = "productId"),
    @Index(name = "idx_review_user", columnList = "userId"),
    @Index(name = "idx_review_status", columnList = "status"),
    @Index(name = "idx_review_product_status", columnList = "productId, status")
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
    private UUID productId;

    @Column(nullable = false)
    private UUID userId;

    private UUID orderId;

    @Column(nullable = false)
    @Builder.Default
    private int rating = 5;

    @Column(length = 2000)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(length = 1000)
    private String imageUrls;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    @Column(nullable = false)
    @Builder.Default
    private boolean verified = false;

    @Column(nullable = false)
    @Builder.Default
    private int helpfulCount = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime moderatedAt;
    private String moderatedBy;

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
