package com.kartezy.deliveryservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "delivery_earnings", indexes = {
    @Index(name = "idx_de_partner_id", columnList = "partnerId"),
    @Index(name = "idx_de_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryEarning {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID partnerId;

    @Column(nullable = false)
    private UUID assignmentId;

    @Column(nullable = false)
    private Double deliveryFee;

    @Column(nullable = false)
    private Double tip;

    @Column(nullable = false)
    private Double incentive;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private Double platformCommission;

    @Column(nullable = false)
    private Double netAmount;

    @Column(length = 30)
    @Enumerated(EnumType.STRING)
    private EarningStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime settledAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = EarningStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum EarningStatus { PENDING, SETTLED, CANCELLED }
}
