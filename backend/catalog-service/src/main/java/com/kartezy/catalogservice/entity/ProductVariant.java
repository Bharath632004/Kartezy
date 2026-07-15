package com.kartezy.catalogservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "product_variants", indexes = {
    @Index(name = "idx_pv_product_id", columnList = "productId"),
    @Index(name = "idx_pv_sku", columnList = "sku", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    @Column(length = 200)
    private String name;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal compareAtPrice;

    @Column(length = 100)
    private String option1Name;

    @Column(length = 100)
    private String option1Value;

    @Column(length = 100)
    private String option2Name;

    @Column(length = 100)
    private String option2Value;

    @Column(length = 100)
    private String option3Name;

    @Column(length = 100)
    private String option3Value;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false)
    private boolean isActive;

    @Column(length = 500)
    private String imageUrl;

    @Column(length = 500)
    private String barcode;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        isActive = true;
        if (compareAtPrice == null) compareAtPrice = BigDecimal.ZERO;
        if (stock == null) stock = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
