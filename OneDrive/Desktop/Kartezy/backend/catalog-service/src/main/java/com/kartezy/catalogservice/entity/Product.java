package com.kartezy.catalogservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_sku", columnList = "sku", unique = true),
    @Index(name = "idx_product_category", columnList = "categoryId"),
    @Index(name = "idx_product_brand", columnList = "brandId"),
    @Index(name = "idx_product_merchant", columnList = "merchantId"),
    @Index(name = "idx_product_status", columnList = "status"),
    @Index(name = "idx_product_name", columnList = "name")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 5000)
    private String description;

    @Column(length = 200)
    private String shortDescription;

    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    @Column(length = 100)
    private String barcode;

    @Column(nullable = false)
    private Long categoryId;

    @Column(nullable = false)
    private Long merchantId;

    @Column
    private Long brandId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal compareAtPrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal costPrice;

    @Column(nullable = false)
    private Double taxRate;

    @Column(precision = 10, scale = 3)
    private BigDecimal weight;

    @Column(length = 20)
    private String weightUnit;

    @Column(precision = 10, scale = 2)
    private BigDecimal length;

    @Column(precision = 10, scale = 2)
    private BigDecimal width;

    @Column(precision = 10, scale = 2)
    private BigDecimal height;

    @Column(length = 10)
    private String dimensionUnit;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private Integer minStockLevel;

    @Column(nullable = false)
    private Integer maxStockLevel;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @Column(length = 2000)
    private String images;

    @Column(length = 500)
    private String videoUrl;

    @Column(length = 500)
    private String seoTitle;

    @Column(length = 1000)
    private String seoDescription;

    @Column(length = 500)
    private String metaKeywords;

    @Column(nullable = false)
    private boolean hasVariants;

    @Column(nullable = false)
    private boolean isActive;

    @Column(length = 50)
    private String unit;

    @Column(nullable = false)
    private boolean isReturnable;

    @Column(nullable = false)
    private boolean isCancellable;

    @Column(length = 200)
    private String tags;

    @Column(nullable = false)
    private Integer sortOrder;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = ProductStatus.ACTIVE;
        if (isActive == false) isActive = true;
        if (stock == null) stock = 0;
        if (minStockLevel == null) minStockLevel = 10;
        if (maxStockLevel == null) maxStockLevel = 1000;
        if (taxRate == null) taxRate = 0.0;
        if (sortOrder == null) sortOrder = 0;
        isReturnable = true; isCancellable = true;
        hasVariants = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ProductStatus {
        ACTIVE, INACTIVE, DISCONTINUED, OUT_OF_STOCK, DRAFT
    }
}
