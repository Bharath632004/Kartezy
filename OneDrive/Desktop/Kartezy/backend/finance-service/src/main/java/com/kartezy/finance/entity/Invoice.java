package com.kartezy.finance.entity;

import com.kartezy.finance.constants.InvoiceStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "invoices", indexes = {
    @Index(name = "idx_inv_number", columnList = "invoiceNumber", unique = true),
    @Index(name = "idx_inv_merchant", columnList = "merchantId"),
    @Index(name = "idx_inv_status", columnList = "status"),
    @Index(name = "idx_inv_due_date", columnList = "dueDate")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice extends BaseEntity {

    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Column(name = "merchant_name", length = 200)
    private String merchantName;

    @Column(name = "vendor_id")
    private Long vendorId;

    @Column(name = "vendor_name", length = 200)
    private String vendorName;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_number", length = 50)
    private String orderNumber;

    @Column(name = "purchase_order_id")
    private Long purchaseOrderId;

    @Column(name = "invoice_date", nullable = false)
    private LocalDate invoiceDate;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private InvoiceStatus status;

    @Column(name = "invoice_type", length = 30)
    private String invoiceType;

    @Column(name = "subtotal", precision = 20, scale = 4)
    private BigDecimal subtotal;

    @Column(name = "discount_amount", precision = 20, scale = 4)
    private BigDecimal discountAmount;

    @Column(name = "taxable_amount", precision = 20, scale = 4)
    private BigDecimal taxableAmount;

    @Column(name = "cgst_amount", precision = 20, scale = 4)
    private BigDecimal cgstAmount;

    @Column(name = "sgst_amount", precision = 20, scale = 4)
    private BigDecimal sgstAmount;

    @Column(name = "igst_amount", precision = 20, scale = 4)
    private BigDecimal igstAmount;

    @Column(name = "cess_amount", precision = 20, scale = 4)
    private BigDecimal cessAmount;

    @Column(name = "total_tax_amount", precision = 20, scale = 4)
    private BigDecimal totalTaxAmount;

    @Column(name = "total_amount", precision = 20, scale = 4)
    private BigDecimal totalAmount;

    @Column(name = "paid_amount", precision = 20, scale = 4)
    private BigDecimal paidAmount;

    @Column(name = "balance_amount", precision = 20, scale = 4)
    private BigDecimal balanceAmount;

    @Column(name = "gstin", length = 20)
    private String gstin;

    @Column(name = "place_of_supply", length = 100)
    private String placeOfSupply;

    @Column(name = "is_interstate")
    private boolean isInterstate;

    @Column(name = "notes", length = 2000)
    private String notes;

    @Column(name = "payment_terms", length = 100)
    private String paymentTerms;

    @Column(name = "payment_reference", length = 200)
    private String paymentReference;

    @Column(name = "paid_at")
    private java.time.LocalDateTime paidAt;
}
