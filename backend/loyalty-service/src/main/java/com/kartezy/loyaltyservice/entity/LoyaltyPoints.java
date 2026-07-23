package com.kartezy.loyaltyservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "loyalty_points", indexes = {
    @Index(name = "idx_loyalty_user", columnList = "userId", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoyaltyPoints {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID userId;

    @Column(nullable = false)
    @Builder.Default
    private int totalPoints = 0;

    @Column(nullable = false)
    @Builder.Default
    private int availablePoints = 0;

    @Column(nullable = false)
    @Builder.Default
    private int redeemedPoints = 0;

    @Column(nullable = false)
    @Builder.Default
    private int expiredPoints = 0;

    @Column(length = 20)
    @Builder.Default
    private String tier = "BRONZE";

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (tier == null) tier = "BRONZE";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
