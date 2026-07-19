package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "warehouses", indexes = {
    @Index(name = "idx_wh_city", columnList = "city_id"),
    @Index(name = "idx_wh_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Warehouse extends BaseEntity {
    @NotBlank @Size(max = 100)
    @Column(nullable = false, unique = true)
    private String warehouseCode;

    @NotBlank @Size(max = 200)
    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    @NotBlank @Size(max = 500)
    @Column(nullable = false)
    private String address;

    @Column(precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 6)
    private BigDecimal longitude;

    @Builder.Default
    private Integer capacitySqFt = 0;

    @Builder.Default
    private Integer usedSqFt = 0;

    @Builder.Default
    private String status = "ACTIVE";

    @Builder.Default
    private Integer totalBays = 0;

    @Builder.Default
    private Integer occupiedBays = 0;

    @Builder.Default
    private Integer staffCount = 0;

    @Column(length = 500)
    private String operatingHours;

    @Builder.Default
    private Boolean isActive = true;

    public BigDecimal getUtilizationPercent() {
        if (capacitySqFt == null || capacitySqFt == 0) return BigDecimal.ZERO;
        return BigDecimal.valueOf(usedSqFt).multiply(BigDecimal.valueOf(100))
            .divide(BigDecimal.valueOf(capacitySqFt), 2, java.math.RoundingMode.HALF_UP);
    }
}
