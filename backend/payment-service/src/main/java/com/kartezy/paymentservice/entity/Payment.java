package com.kartezy.paymentservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments", indexes = {
    @Index(name = "idx_payment_order_id", columnList = "orderId"),
    @Index(name = "idx_payment_status", columnList = "status"),
    @Index(name = "idx_payment_merchant_id", columnList = "merchantId"),
    @Index(name = "idx_payment_transaction_id", columnList = "transactionId", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID orderId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private UUID merchantId;

    @Column(nullable = false, unique = true, length = 100)
    private String transactionId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(precision = 10, scale = 2)
    private BigDecimal platformFee;

    @Column(precision = 10, scale = 2)
    private BigDecimal gatewayFee;

    @Column(precision = 10, scale = 2)
    private BigDecimal tax;

    @Column(precision = 10, scale = 2)
    private BigDecimal netAmount;

    @Column(nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(nullable = false, length = 30)
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(length = 10)
    private String currency;

    @Column(length = 255)
    private String gatewayReference;

    @Column(length = 500)
    private String gatewayResponse;

    @Column(length = 500)
    private String failureReason;

    @Column(length = 100)
    private String bankReference;

    @Column(length = 50)
    private String upiTransactionId;

    @Column(length = 20)
    private String cardLastFour;

    @Column(length = 50)
    private String cardBrand;

    @Column(length = 50)
    private String cardType;

    @Column(length = 100)
    private String billingAddress;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Column(length = 50)
    private String ipAddress;

    @Column(length = 500)
    private String userAgent;

    @Column(length = 100)
    private String idempotencyKey;

    @Column(nullable = false)
    private boolean refunded;

    @Column(precision = 10, scale = 2)
    private BigDecimal refundedAmount;

    private LocalDateTime refundedAt;

    @Column(length = 50)
    private String paymentGroup;

    @Column(name = "is_split_payment")
    private boolean splitPayment;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currency == null) currency = "INR";
        if (status == null) status = PaymentStatus.PENDING;
        if (transactionId == null) transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 16).toUpperCase();
        if (netAmount == null) netAmount = amount;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum PaymentMethod {
        UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING, WALLET, COD, SPLIT_PAYMENT
    }

    public enum PaymentStatus {
        PENDING, PROCESSING, SUCCESS, FAILED, REFUNDED, PARTIALLY_REFUNDED, CANCELLED, DISPUTED
    }
}
