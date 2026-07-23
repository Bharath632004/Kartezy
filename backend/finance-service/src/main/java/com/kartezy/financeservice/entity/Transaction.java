package com.kartezy.financeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "finance_transactions", indexes = {
    @Index(name = "idx_fin_txn_user", columnList = "userId"),
    @Index(name = "idx_fin_txn_type", columnList = "transactionType"),
    @Index(name = "idx_fin_txn_status", columnList = "status"),
    @Index(name = "idx_fin_txn_reference", columnList = "referenceId")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String transactionNumber;

    @Column(nullable = false, length = 50)
    private String transactionType;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "INR";

    @Column(nullable = false, length = 30)
    private String status;

    private UUID userId;
    private UUID merchantId;
    private UUID orderId;
    private UUID referenceId;

    @Column(length = 100)
    private String referenceType;

    @Column(length = 500)
    private String description;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (transactionNumber == null) {
            transactionNumber = "TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        }
        if (status == null) status = "PENDING";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
