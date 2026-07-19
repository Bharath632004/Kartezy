package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "journal_entry_lines", indexes = {
    @Index(name = "idx_jel_account", columnList = "accountId"),
    @Index(name = "idx_jel_entry", columnList = "journalEntryId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntryLine extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "journal_entry_id", nullable = false)
    private JournalEntry journalEntry;

    @Column(name = "line_number")
    private Integer lineNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "debit_amount", precision = 20, scale = 4)
    private BigDecimal debitAmount;

    @Column(name = "credit_amount", precision = 20, scale = 4)
    private BigDecimal creditAmount;

    @Column(name = "is_debit")
    private boolean isDebit;

    @Column(name = "reference_id", length = 100)
    private String referenceId;

    @Column(name = "reference_type", length = 50)
    private String referenceType;
}
