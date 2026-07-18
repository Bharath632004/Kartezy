package com.kartezy.shared.enterprise.geography;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.HashSet;
import java.util.Set;

/**
 * Represents a state/province/region entity for multi-state operations.
 * Supports regional tax configurations, shipping zones, and market expansion.
 */
@Entity
@Table(name = "states", schema = "kartezy_enterprise")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class State extends GeoEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "country_id", nullable = false)
    @ToString.Exclude
    private Country country;

    @Column(nullable = false)
    private String stateCode; // e.g., "CA", "MH", "TS"

    @Column
    private Integer taxPercentage; // State-specific tax

    @Column
    private String taxLabel; // "State GST", "Provincial Tax"

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column
    private String region; // "North", "South", "East", "West", "Central"

    @OneToMany(mappedBy = "state", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<City> cities = new HashSet<>();

    @Column
    private Boolean hasSundayRestrictions = false;

    @Column
    private Boolean hasAlcoholRestrictions = false;
}
