package com.kartezy.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_items", indexes = {
    @Index(name = "idx_poi_po", columnList = "purchaseOrderId")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Column(name = "line_number")
    private Integer lineNumber;

    @Column(name = "product_name", length = 200)
    private String productName;

    @Column(name = "product_code", length = 50)
    private String productCode;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "received_quantity")
    private Integer receivedQuantity;

    @Column(name = "unit_price", precision = 20, scale = 4)
    private BigDecimal unitPrice;

    @Column(name = "discount_percentage", precision = 10, scale = 4)
    private BigDecimal discountPercentage;

    @Column(name = "discount_amount", precision = 20, scale = 4)
    private BigDecimal discountAmount;

    @Column(name = "tax_percentage", precision = 10, scale = 4)
    private BigDecimal taxPercentage;

    @Column(name = "tax_amount", precision = 20, scale = 4)
    private BigDecimal taxAmount;

    @Column(name = "total_amount", precision = 20, scale = 4)
    private BigDecimal totalAmount;

    @Column(name = "unit", length = 20)
    private String unit;
}
