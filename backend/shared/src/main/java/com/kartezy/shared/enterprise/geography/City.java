package com.kartezy.shared.enterprise.geography;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Represents a city entity for hyperlocal multi-city operations.
 * Each city can have its own delivery zones, merchant networks, and pricing.
 */
@Entity
@Table(name = "cities", schema = "kartezy_enterprise")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class City extends GeoEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
    @ToString.Exclude
    private State state;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private String timezone;

    @Column(nullable = false)
    private Boolean isOperational = false;

    @Column
    private Integer deliveryRadiusKm = 10;

    @Column
    private Integer maxDeliveryDistanceKm = 25;

    @Column(nullable = false)
    private String currencyCode;

    @Column(nullable = false)
    private String languageCode;

    @Column
    private Boolean isMetro = false;

    @Column
    private Long population;

    @Column(length = 2000)
    private String operationalAddress;

    @Column
    private String googlePlaceId;

    @Column(nullable = false)
    private Boolean requiresSpecialPermit = false;
}
