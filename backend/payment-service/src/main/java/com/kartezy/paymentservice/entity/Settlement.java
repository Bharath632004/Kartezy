package com.kartezy.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "settlements", indexes = {
    @Index(name = "idx_settlement_merchant_id", columnList = "merchantId"),
    @Index(name = "idx_settlement_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Settlement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID merchantId;

    @Column(nullable = false)
    private UUID orderId;

    @Column(nullable = false, length = 100, unique = true)
    private String settlementReference;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal orderAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal commissionAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal platformFee;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal taxAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal settlementAmount;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private SettlementStatus status;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private SettlementCycle cycle;

    @Column(nullable = false)
    private LocalDateTime cycleStartDate;

    @Column(nullable = false)
    private LocalDateTime cycleEndDate;

    @Column(length = 100)
    private String bankAccountNumber;

    @Column(length = 100)
    private String bankIfscCode;

    @Column(length = 200)
    private String bankName;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime processedAt;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = SettlementStatus.PENDING;
        if (settlementReference == null)
            settlementReference = "SET-" + UUID.randomUUID().toString().substring(0, 16).toUpperCase();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum SettlementStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
    }

    public enum SettlementCycle {
        DAILY, WEEKLY, BIWEEKLY, MONTHLY
    }
}
