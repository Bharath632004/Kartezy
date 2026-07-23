package com.kartezy.financeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "finance_invoices", indexes = {
    @Index(name = "idx_fin_inv_number", columnList = "invoiceNumber", unique = true),
    @Index(name = "idx_fin_inv_order", columnList = "orderId"),
    @Index(name = "idx_fin_inv_merchant", columnList = "merchantId"),
    @Index(name = "idx_fin_inv_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @Column(nullable = false)
    private UUID orderId;

    private UUID merchantId;
    private UUID userId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(precision = 10, scale = 2)
    private BigDecimal tax;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(length = 10)
    @Builder.Default
    private String currency = "INR";

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    private LocalDateTime paidAt;
    private LocalDateTime dueDate;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (invoiceNumber == null) {
            invoiceNumber = "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (status == null) status = "DRAFT";
        if (totalAmount == null) totalAmount = amount;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
