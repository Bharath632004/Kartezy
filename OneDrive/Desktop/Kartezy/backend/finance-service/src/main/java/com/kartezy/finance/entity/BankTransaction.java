package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bank_transactions", indexes = {
    @Index(name = "idx_bt_account", columnList = "bankAccountId"),
    @Index(name = "idx_bt_date", columnList = "transactionDate"),
    @Index(name = "idx_bt_ref", columnList = "bankReference")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class BankTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_account_id", nullable = false)
    private BankAccount bankAccount;

    @Column(name = "transaction_date", nullable = false)
    private LocalDate transactionDate;

    @Column(name = "value_date")
    private LocalDate valueDate;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "bank_reference", length = 200)
    private String bankReference;

    @Column(name = "cheque_number", length = 50)
    private String chequeNumber;

    @Column(name = "debit_amount", precision = 20, scale = 4)
    private BigDecimal debitAmount;

    @Column(name = "credit_amount", precision = 20, scale = 4)
    private BigDecimal creditAmount;

    @Column(name = "running_balance", precision = 20, scale = 4)
    private BigDecimal runningBalance;

    @Column(name = "transaction_type", length = 50)
    private String transactionType;

    @Column(name = "transaction_category", length = 50)
    private String transactionCategory;

    @Column(name = "is_reconciled")
    private boolean isReconciled;

    @Column(name = "reconciliation_id")
    private Long reconciliationId;

    @Column(name = "reconciled_at")
    private LocalDateTime reconciledAt;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "notes", length = 1000)
    private String notes;
}
