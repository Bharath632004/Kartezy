package com.kartezy.finance.entity;

import com.kartezy.finance.constants.SettlementStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "merchant_settlements", indexes = {
    @Index(name = "idx_ms_merchant", columnList = "merchantId"),
    @Index(name = "idx_ms_status", columnList = "status"),
    @Index(name = "idx_ms_cycle", columnList = "settlementCycleId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class MerchantSettlement extends BaseEntity {

    @Column(name = "settlement_number", nullable = false, unique = true, length = 50)
    private String settlementNumber;

    @Column(name = "merchant_id", nullable = false)
    private Long merchantId;

    @Column(name = "merchant_name", length = 200)
    private String merchantName;

    @Column(name = "settlement_cycle_id", length = 50)
    private String settlementCycleId;

    @Column(name = "cycle_start_date")
    private LocalDate cycleStartDate;

    @Column(name = "cycle_end_date")
    private LocalDate cycleEndDate;

    @Column(name = "settlement_date")
    private LocalDate settlementDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private SettlementStatus status;

    @Column(name = "total_order_amount", precision = 20, scale = 4)
    private BigDecimal totalOrderAmount;

    @Column(name = "total_commission", precision = 20, scale = 4)
    private BigDecimal totalCommission;

    @Column(name = "total_delivery_fees", precision = 20, scale = 4)
    private BigDecimal totalDeliveryFees;

    @Column(name = "total_platform_fees", precision = 20, scale = 4)
    private BigDecimal totalPlatformFees;

    @Column(name = "total_gst", precision = 20, scale = 4)
    private BigDecimal totalGst;

    @Column(name = "total_tds", precision = 20, scale = 4)
    private BigDecimal totalTds;

    @Column(name = "total_adjustments", precision = 20, scale = 4)
    private BigDecimal totalAdjustments;

    @Column(name = "net_settlement_amount", precision = 20, scale = 4)
    private BigDecimal netSettlementAmount;

    @Column(name = "order_count")
    private Integer orderCount;

    @Column(name = "settlement_batch_id", length = 100)
    private String settlementBatchId;

    @Column(name = "bank_account_id")
    private Long bankAccountId;

    @Column(name = "payment_reference", length = 200)
    private String paymentReference;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "failure_reason", length = 1000)
    private String failureReason;

    @Column(name = "notes", length = 1000)
    private String notes;

    @OneToMany(mappedBy = "settlement", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SettlementTransaction> transactions = new ArrayList<>();
}
