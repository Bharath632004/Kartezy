package com.kartezy.finance.entity;

import com.kartezy.finance.constants.TransactionType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "ledger_entries", indexes = {
    @Index(name = "idx_le_account_date", columnList = "accountId, entryDate"),
    @Index(name = "idx_le_transaction", columnList = "transactionType"),
    @Index(name = "idx_le_reference", columnList = "referenceNumber")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class LedgerEntry extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 30)
    private TransactionType transactionType;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "debit_amount", precision = 20, scale = 4)
    private BigDecimal debitAmount;

    @Column(name = "credit_amount", precision = 20, scale = 4)
    private BigDecimal creditAmount;

    @Column(name = "running_balance", precision = 20, scale = 4)
    private BigDecimal runningBalance;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "journal_entry_id")
    private Long journalEntryId;

    @Column(name = "reconciled")
    private boolean reconciled;

    @Column(name = "reconciliation_date")
    private LocalDate reconciliationDate;

    @Column(name = "notes", length = 1000)
    private String notes;
}
