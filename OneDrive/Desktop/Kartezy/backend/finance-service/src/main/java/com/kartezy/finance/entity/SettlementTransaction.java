package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "settlement_transactions", indexes = {
    @Index(name = "idx_st_settlement", columnList = "settlementId"),
    @Index(name = "idx_st_order", columnList = "orderId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementTransaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "settlement_id", nullable = false)
    private MerchantSettlement settlement;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "order_number", length = 50)
    private String orderNumber;

    @Column(name = "order_amount", precision = 20, scale = 4)
    private BigDecimal orderAmount;

    @Column(name = "commission_amount", precision = 20, scale = 4)
    private BigDecimal commissionAmount;

    @Column(name = "delivery_fee", precision = 20, scale = 4)
    private BigDecimal deliveryFee;

    @Column(name = "platform_fee", precision = 20, scale = 4)
    private BigDecimal platformFee;

    @Column(name = "gst_amount", precision = 20, scale = 4)
    private BigDecimal gstAmount;

    @Column(name = "tds_amount", precision = 20, scale = 4)
    private BigDecimal tdsAmount;

    @Column(name = "adjustment_amount", precision = 20, scale = 4)
    private BigDecimal adjustmentAmount;

    @Column(name = "net_amount", precision = 20, scale = 4)
    private BigDecimal netAmount;

    @Column(name = "status", length = 30)
    private String status;
}
