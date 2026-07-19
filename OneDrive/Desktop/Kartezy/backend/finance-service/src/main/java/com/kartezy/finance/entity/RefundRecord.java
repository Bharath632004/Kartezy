package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "refund_records", indexes = {
    @Index(name = "idx_ref_order", columnList = "orderId"),
    @Index(name = "idx_ref_payment", columnList = "paymentId"),
    @Index(name = "idx_ref_status", columnList = "status")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class RefundRecord extends BaseEntity {

    @Column(name = "refund_number", nullable = false, unique = true, length = 50)
    private String refundNumber;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "order_number", length = 50)
    private String orderNumber;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "payment_reference", length = 200)
    private String paymentReference;

    @Column(name = "refund_reason", length = 1000)
    private String refundReason;

    @Column(name = "refund_type", length = 30)
    private String refundType;

    @Column(name = "original_order_amount", precision = 20, scale = 4)
    private BigDecimal originalOrderAmount;

    @Column(name = "refund_amount", precision = 20, scale = 4)
    private BigDecimal refundAmount;

    @Column(name = "commission_reversal", precision = 20, scale = 4)
    private BigDecimal commissionReversal;

    @Column(name = "delivery_fee_reversal", precision = 20, scale = 4)
    private BigDecimal deliveryFeeReversal;

    @Column(name = "platform_fee_reversal", precision = 20, scale = 4)
    private BigDecimal platformFeeReversal;

    @Column(name = "gst_reversal", precision = 20, scale = 4)
    private BigDecimal gstReversal;

    @Column(name = "net_refund_amount", precision = 20, scale = 4)
    private BigDecimal netRefundAmount;

    @Column(name = "refund_method", length = 30)
    private String refundMethod;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "initiated_by", length = 100)
    private String initiatedBy;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "failure_reason", length = 1000)
    private String failureReason;

    @Column(name = "journal_entry_id")
    private Long journalEntryId;

    @Column(name = "notes", length = 2000)
    private String notes;
}
