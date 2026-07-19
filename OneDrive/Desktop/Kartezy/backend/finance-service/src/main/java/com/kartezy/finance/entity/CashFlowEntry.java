package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cash_flow_entries", indexes = {
    @Index(name = "idx_cfe_category", columnList = "category"),
    @Index(name = "idx_cfe_date", columnList = "entryDate"),
    @Index(name = "idx_cfe_report", columnList = "reportId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CashFlowEntry extends BaseEntity {

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "sub_category", length = 50)
    private String subCategory;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "inflow_amount", precision = 20, scale = 4)
    private BigDecimal inflowAmount;

    @Column(name = "outflow_amount", precision = 20, scale = 4)
    private BigDecimal outflowAmount;

    @Column(name = "net_amount", precision = 20, scale = 4)
    private BigDecimal netAmount;

    @Column(name = "reference_type", length = 50)
    private String referenceType;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "is_recurring")
    private boolean isRecurring;

    @Column(name = "report_id")
    private Long reportId;

    @Column(name = "notes", length = 1000)
    private String notes;
}
