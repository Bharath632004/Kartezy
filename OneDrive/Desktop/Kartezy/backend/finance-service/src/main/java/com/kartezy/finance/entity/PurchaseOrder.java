package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "purchase_orders", indexes = {
    @Index(name = "idx_po_number", columnList = "poNumber", unique = true),
    @Index(name = "idx_po_vendor", columnList = "vendorId"),
    @Index(name = "idx_po_status", columnList = "status")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder extends BaseEntity {

    @Column(name = "po_number", nullable = false, unique = true, length = 50)
    private String poNumber;

    @Column(name = "vendor_id")
    private Long vendorId;

    @Column(name = "vendor_name", length = 200)
    private String vendorName;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "expected_delivery_date")
    private LocalDate expectedDeliveryDate;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "subtotal", precision = 20, scale = 4)
    private BigDecimal subtotal;

    @Column(name = "discount_amount", precision = 20, scale = 4)
    private BigDecimal discountAmount;

    @Column(name = "tax_amount", precision = 20, scale = 4)
    private BigDecimal taxAmount;

    @Column(name = "shipping_charges", precision = 20, scale = 4)
    private BigDecimal shippingCharges;

    @Column(name = "total_amount", precision = 20, scale = 4)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", precision = 20, scale = 4)
    private BigDecimal paidAmount;

    @Column(name = "balance_amount", precision = 20, scale = 4)
    private BigDecimal balanceAmount;

    @Column(name = "notes", length = 2000)
    private String notes;

    @Column(name = "terms_conditions", length = 5000)
    private String termsConditions;

    @Column(name = "approved_by", length = 100)
    private String approvedBy;

    @Column(name = "approved_at")
    private java.time.LocalDateTime approvedAt;

    @Column(name = "shipping_address", length = 1000)
    private String shippingAddress;

    @Column(name = "billing_address", length = 1000)
    private String billingAddress;
}
