package com.kartezy.financeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "finance_settlements", indexes = {
    @Index(name = "idx_fin_settle_merchant", columnList = "merchantId"),
    @Index(name = "idx_fin_settle_status", columnList = "status"),
    @Index(name = "idx_fin_settle_period", columnList = "settlementPeriod")
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

    @Column(nullable = false, unique = true, length = 50)
    private String settlementNumber;

    @Column(nullable = false)
    private UUID merchantId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(precision = 15, scale = 2)
    private BigDecimal commissionAmount;

    @Column(precision = 15, scale = 2)
    private BigDecimal netAmount;

    @Column(precision = 15, scale = 2)
    private BigDecimal adjustmentAmount;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(length = 50)
    private String settlementPeriod;

    @Column(length = 100)
    private String bankAccountNumber;

    @Column(length = 100)
    private String bankIfscCode;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime settledAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (settlementNumber == null) {
            settlementNumber = "STL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (status == null) status = "PENDING";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
