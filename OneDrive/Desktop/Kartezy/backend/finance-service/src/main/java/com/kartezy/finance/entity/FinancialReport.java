package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_reports", indexes = {
    @Index(name = "idx_fr_type", columnList = "reportType"),
    @Index(name = "idx_fr_period", columnList = "periodStart,periodEnd"),
    @Index(name = "idx_fr_entity", columnList = "entityType,entityId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialReport extends BaseEntity {

    @Column(name = "report_name", nullable = false, length = 200)
    private String reportName;

    @Column(name = "report_type", nullable = false, length = 30)
    private String reportType;

    @Column(name = "report_sub_type", length = 30)
    private String reportSubType;

    @Column(name = "entity_type", length = 30)
    private String entityType;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "period_start")
    private LocalDate periodStart;

    @Column(name = "period_end")
    private LocalDate periodEnd;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @Column(name = "generated_by", length = 100)
    private String generatedBy;

    @Column(name = "total_revenue", precision = 20, scale = 4)
    private BigDecimal totalRevenue;

    @Column(name = "total_expenses", precision = 20, scale = 4)
    private BigDecimal totalExpenses;

    @Column(name = "gross_profit", precision = 20, scale = 4)
    private BigDecimal grossProfit;

    @Column(name = "net_profit", precision = 20, scale = 4)
    private BigDecimal netProfit;

    @Column(name = "total_assets", precision = 20, scale = 4)
    private BigDecimal totalAssets;

    @Column(name = "total_liabilities", precision = 20, scale = 4)
    private BigDecimal totalLiabilities;

    @Column(name = "total_equity", precision = 20, scale = 4)
    private BigDecimal totalEquity;

    @Column(name = "operating_cash_flow", precision = 20, scale = 4)
    private BigDecimal operatingCashFlow;

    @Column(name = "investing_cash_flow", precision = 20, scale = 4)
    private BigDecimal investingCashFlow;

    @Column(name = "financing_cash_flow", precision = 20, scale = 4)
    private BigDecimal financingCashFlow;

    @Column(name = "report_data", columnDefinition = "JSONB")
    private String reportData;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "is_approved")
    private boolean isApproved;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "notes", length = 2000)
    private String notes;
}
