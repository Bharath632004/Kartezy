package com.kartezy.finance.entity;

import com.kartezy.finance.constants.ReconciliationStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "reconciliation_records", indexes = {
    @Index(name = "idx_rr_bank", columnList = "bankTransactionId"),
    @Index(name = "idx_rr_system", columnList = "systemTransactionId"),
    @Index(name = "idx_rr_status", columnList = "status")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ReconciliationRecord extends BaseEntity {

    @Column(name = "bank_transaction_id")
    private Long bankTransactionId;

    @Column(name = "system_transaction_id")
    private Long systemTransactionId;

    @Column(name = "system_transaction_type", length = 50)
    private String systemTransactionType;

    @Column(name = "bank_amount", precision = 20, scale = 4)
    private BigDecimal bankAmount;

    @Column(name = "system_amount", precision = 20, scale = 4)
    private BigDecimal systemAmount;

    @Column(name = "difference_amount", precision = 20, scale = 4)
    private BigDecimal differenceAmount;

    @Column(name = "match_type", length = 30)
    private String matchType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private ReconciliationStatus status;

    @Column(name = "matched_by", length = 100)
    private String matchedBy;

    @Column(name = "matched_at")
    private java.time.LocalDateTime matchedAt;

    @Column(name = "discrepancy_reason", length = 1000)
    private String discrepancyReason;

    @Column(name = "resolution_notes", length = 2000)
    private String resolutionNotes;

    @Column(name = "is_auto_matched")
    private boolean isAutoMatched;
}
