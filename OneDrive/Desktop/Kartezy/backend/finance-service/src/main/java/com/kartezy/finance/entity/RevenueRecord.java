package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "revenue_records", indexes = {
    @Index(name = "idx_rr_date", columnList = "revenueDate"),
    @Index(name = "idx_rr_type", columnList = "revenueType"),
    @Index(name = "idx_rr_merchant", columnList = "merchantId"),
    @Index(name = "idx_rr_order", columnList = "orderId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueRecord extends BaseEntity {

    @Column(name = "revenue_date", nullable = false)
    private LocalDate revenueDate;

    @Column(name = "revenue_type", nullable = false, length = 50)
    private String revenueType;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_number", length = 50)
    private String orderNumber;

    @Column(name = "merchant_id")
    private Long merchantId;

    @Column(name = "merchant_name", length = 200)
    private String merchantName;

    @Column(name = "category", length = 100)
    private String category;

    @Column(name = "gross_amount", precision = 20, scale = 4)
    private BigDecimal grossAmount;

    @Column(name = "discount_amount", precision = 20, scale = 4)
    private BigDecimal discountAmount;

    @Column(name = "net_amount", precision = 20, scale = 4)
    private BigDecimal netAmount;

    @Column(name = "commission_amount", precision = 20, scale = 4)
    private BigDecimal commissionAmount;

    @Column(name = "platform_fee", precision = 20, scale = 4)
    private BigDecimal platformFee;

    @Column(name = "delivery_fee", precision = 20, scale = 4)
    private BigDecimal deliveryFee;

    @Column(name = "gst_amount", precision = 20, scale = 4)
    private BigDecimal gstAmount;

    @Column(name = "net_revenue", precision = 20, scale = 4)
    private BigDecimal netRevenue;

    @Column(name = "is_recognized")
    private boolean isRecognized;

    @Column(name = "recognition_date")
    private LocalDate recognitionDate;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "notes", length = 1000)
    private String notes;
}
