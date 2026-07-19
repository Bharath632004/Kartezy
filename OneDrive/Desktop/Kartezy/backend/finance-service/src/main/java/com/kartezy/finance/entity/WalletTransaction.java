package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "wallet_transactions", indexes = {
    @Index(name = "idx_wt_wallet", columnList = "walletId"),
    @Index(name = "idx_wt_merchant", columnList = "merchantId"),
    @Index(name = "idx_wt_reference", columnList = "referenceNumber"),
    @Index(name = "idx_wt_status", columnList = "status")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransaction extends BaseEntity {

    @Column(name = "wallet_id", nullable = false)
    private Long walletId;

    @Column(name = "wallet_type", length = 30)
    private String walletType;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "transaction_type", nullable = false, length = 30)
    private String transactionType;

    @Column(name = "amount", precision = 20, scale = 4)
    private BigDecimal amount;

    @Column(name = "balance_before", precision = 20, scale = 4)
    private BigDecimal balanceBefore;

    @Column(name = "balance_after", precision = 20, scale = 4)
    private BigDecimal balanceAfter;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "settlement_id")
    private Long settlementId;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "is_reconciled")
    private boolean isReconciled;

    @Column(name = "journal_entry_id")
    private Long journalEntryId;
}
