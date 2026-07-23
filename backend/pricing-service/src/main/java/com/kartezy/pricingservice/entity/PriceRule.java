package com.kartezy.pricingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "price_rules", indexes = {
    @Index(name = "idx_price_rule_type", columnList = "ruleType"),
    @Index(name = "idx_price_rule_active", columnList = "active"),
    @Index(name = "idx_price_rule_product_merchant", columnList = "productId, merchantId")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceRule {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(length = 100)
    private UUID productId;

    @Column(length = 100)
    private UUID merchantId;

    @Column(length = 100)
    private UUID categoryId;

    @Column(nullable = false, length = 50)
    private String ruleType;

    @Column(nullable = false, length = 50)
    private String ruleName;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, length = 20)
    private String priceType;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal priceValue;

    @Column(precision = 10, scale = 2)
    private BigDecimal minPrice;

    @Column(precision = 10, scale = 2)
    private BigDecimal maxPrice;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    private Integer priority;

    private LocalDateTime effectiveFrom;

    private LocalDateTime effectiveTo;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
