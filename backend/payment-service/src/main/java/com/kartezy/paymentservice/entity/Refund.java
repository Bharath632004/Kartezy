package com.kartezy.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "refunds", indexes = {
    @Index(name = "idx_refund_payment_id", columnList = "paymentId"),
    @Index(name = "idx_refund_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Refund {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID paymentId;

    @Column(nullable = false)
    private UUID orderId;

    @Column(nullable = false, length = 100, unique = true)
    private String refundReference;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private RefundReason reason;

    @Column(length = 500)
    private String reasonDetail;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private RefundStatus status;

    @Column(length = 255)
    private String gatewayRefundId;

    @Column(length = 500)
    private String gatewayResponse;

    @Column(length = 500)
    private String failureReason;

    @Column(length = 100)
    private String initiatedBy;

    @Column(length = 100)
    private String approvedBy;

    private LocalDateTime approvedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = RefundStatus.PENDING;
        if (refundReference == null)
            refundReference = "REF-" + UUID.randomUUID().toString().substring(0, 16).toUpperCase();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum RefundReason {
        CUSTOMER_REQUEST, ORDER_CANCELLED, ORDER_RETURNED, DUPLICATE_PAYMENT,
        FRAUD_DETECTED, TECHNICAL_ERROR, MERCHANT_CANCELLED, OTHERS
    }

    public enum RefundStatus {
        PENDING, APPROVED, PROCESSING, COMPLETED, FAILED, CANCELLED
    }
}
