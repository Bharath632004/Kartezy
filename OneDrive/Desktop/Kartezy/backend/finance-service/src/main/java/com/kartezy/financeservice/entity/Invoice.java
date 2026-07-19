package com.kartezy.financeservice.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Table(name = "invoices", indexes = {
    @Index(name = "idx_inv_order", columnList = "orderId"),
    @Index(name = "idx_inv_merchant", columnList = "merchantId"),
    @Index(name = "idx_inv_status", columnList = "status")
})
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class Invoice {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false, unique = true, length = 50)
    private String invoiceNumber;
    @Column(nullable = false)
    private UUID orderId;
    @Column(nullable = false)
    private UUID merchantId;
    @Column(nullable = false)
    private UUID userId;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal taxAmount;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal discountAmount;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal deliveryFee;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;
    @Column(precision = 12, scale = 2)
    private BigDecimal platformFee;
    @Column(precision = 12, scale = 2)
    private BigDecimal commissionAmount;
    @Column(length = 10)
    private String currency;
    @Column(nullable = false, length = 20)
    private String status;
    @Column(nullable = false)
    private LocalDateTime invoiceDate;
    private LocalDateTime dueDate;
    private LocalDateTime paidAt;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @Column(length = 500)
    private String notes;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now(); invoiceDate = LocalDateTime.now();
        status = "PENDING"; currency = "INR";
        invoiceNumber = "INV-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }
}
