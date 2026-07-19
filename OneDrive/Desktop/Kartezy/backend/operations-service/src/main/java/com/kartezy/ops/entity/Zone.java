package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "zones", indexes = {
    @Index(name = "idx_zone_city", columnList = "city_id"),
    @Index(name = "idx_zone_type", columnList = "zoneType"),
    @Index(name = "idx_zone_active", columnList = "isActive")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Zone extends BaseEntity {
    @NotBlank @Size(max = 100)
    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @NotBlank @Size(max = 50)
    @Column(nullable = false)
    private String zoneType;

    @Size(max = 500)
    private String boundaryGeoJson;

    @Builder.Default
    private Integer estimatedPopulation = 0;

    @Builder.Default
    private BigDecimal coverageRadiusKm = new BigDecimal("5.0");

    @Builder.Default
    private Integer assignedDeliveryPartners = 0;

    @Builder.Default
    private Boolean isActive = true;

    @Column(precision = 10, scale = 6)
    private BigDecimal centerLatitude;

    @Column(precision = 10, scale = 6)
    private BigDecimal centerLongitude;
}
