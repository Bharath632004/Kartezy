package com.kartezy.walletservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wallets", indexes = {
    @Index(name = "idx_wallet_user_id", columnList = "userId", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID userId;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private WalletType walletType;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal balance;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalDeposited;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalWithdrawn;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalSpent;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal cashbackEarned;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(nullable = false)
    private Boolean isBlocked;

    @Column(nullable = false)
    private Long transactionCount;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (balance == null) balance = BigDecimal.ZERO;
        if (totalDeposited == null) totalDeposited = BigDecimal.ZERO;
        if (totalWithdrawn == null) totalWithdrawn = BigDecimal.ZERO;
        if (totalSpent == null) totalSpent = BigDecimal.ZERO;
        if (cashbackEarned == null) cashbackEarned = BigDecimal.ZERO;
        if (isActive == null) isActive = true;
        if (isBlocked == null) isBlocked = false;
        if (transactionCount == null) transactionCount = 0L;
        if (walletType == null) walletType = WalletType.CUSTOMER;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum WalletType { CUSTOMER, MERCHANT, DELIVERY_PARTNER, PLATFORM }
}
