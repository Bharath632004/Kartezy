package com.kartezy.fraudservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "fraud_alerts", indexes = {
    @Index(name = "idx_fraud_status", columnList = "status"),
    @Index(name = "idx_fraud_order", columnList = "orderId"),
    @Index(name = "idx_fraud_user", columnList = "userId")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID orderId;

    private UUID userId;

    @Column(nullable = false)
    private double riskScore;

    @Column(columnDefinition = "TEXT")
    private String reasons;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "OPEN";

    @Column(length = 500)
    private String resolution;

    @Column(length = 100)
    private String resolvedBy;

    private LocalDateTime resolvedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

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
