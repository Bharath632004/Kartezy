package com.kartezy.finance.entity;

import com.kartezy.finance.constants.JournalEntryType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "journal_entries", indexes = {
    @Index(name = "idx_je_date", columnList = "entryDate"),
    @Index(name = "idx_je_reference", columnList = "referenceNumber"),
    @Index(name = "idx_je_status", columnList = "status")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntry extends BaseEntity {

    @Column(name = "entry_number", nullable = false, unique = true, length = 50)
    private String entryNumber;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "posting_date")
    private LocalDate postingDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "entry_type", nullable = false, length = 20)
    private JournalEntryType entryType;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "reference_number", length = 100)
    private String referenceNumber;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "total_debit", precision = 20, scale = 4)
    private BigDecimal totalDebit;

    @Column(name = "total_credit", precision = 20, scale = 4)
    private BigDecimal totalCredit;

    @Column(name = "is_balanced")
    private boolean isBalanced;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "approved_at")
    private java.time.LocalDateTime approvedAt;

    @OneToMany(mappedBy = "journalEntry", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<JournalEntryLine> lines = new ArrayList<>();
}
