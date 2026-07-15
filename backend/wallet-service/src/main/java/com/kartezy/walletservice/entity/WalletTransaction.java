package com.kartezy.walletservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wallet_transactions", indexes = {
    @Index(name = "idx_wt_wallet_id", columnList = "walletId"),
    @Index(name = "idx_wt_user_id", columnList = "userId"),
    @Index(name = "idx_wt_type", columnList = "transactionType"),
    @Index(name = "idx_wt_status", columnList = "status"),
    @Index(name = "idx_wt_reference", columnList = "referenceId")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID walletId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, unique = true, length = 100)
    private String transactionReference;

    @Column(nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private TransactionCategory category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal balanceBefore;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal balanceAfter;

    @Column(length = 500)
    private String description;

    @Column(length = 100)
    private String referenceId;

    @Column(length = 50)
    private String referenceType;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    @Column(length = 255)
    private String failureReason;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = TransactionStatus.PENDING;
        if (transactionReference == null)
            transactionReference = "TXN-" + UUID.randomUUID().toString().substring(0, 16).toUpperCase();
    }

    public enum TransactionType { CREDIT, DEBIT }
    public enum TransactionCategory {
        TOP_UP, WITHDRAWAL, PAYMENT, REFUND, CASHBACK, REFERRAL_REWARD,
        COMMISSION_PAYOUT, INCENTIVE, FEE, ADJUSTMENT
    }
    public enum TransactionStatus { PENDING, COMPLETED, FAILED, CANCELLED }
}
