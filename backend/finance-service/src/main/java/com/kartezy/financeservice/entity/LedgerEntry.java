package com.kartezy.financeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ledger_entries", indexes = {
    @Index(name = "idx_ledger_account", columnList = "accountId"),
    @Index(name = "idx_ledger_date", columnList = "entryDate"),
    @Index(name = "idx_ledger_type", columnList = "entryType")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LedgerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    private String accountId;

    @Column(nullable = false, length = 100)
    private String accountName;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private EntryType entryType; // DEBIT or CREDIT

    @Column(nullable = false, length = 20)
    private String transactionType; // e.g., PAYMENT, REFUND, SETTLEMENT, INVOICE, WALLET_TOPUP, etc.

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal balanceAfter;

    @Column(nullable = false)
    private LocalDateTime entryDate;

    @Column(length = 500)
    private String description;

    @Column(length = 100)
    private String referenceId; // e.g., paymentId, invoiceId, walletTransactionId, etc.

    @Column(length = 50)
    private String referenceType; // e.g., PAYMENT, INVOICE, WALLET_TRANSACTION, etc.

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        entryDate = LocalDateTime.now();
    }

    public enum EntryType {
        DEBIT, CREDIT
    }
}