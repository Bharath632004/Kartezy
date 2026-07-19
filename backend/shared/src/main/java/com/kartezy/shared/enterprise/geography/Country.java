package com.kartezy.shared.enterprise.geography;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.HashSet;
import java.util.Set;

/**
 * Represents a country entity for multi-country operations.
 * Supports international expansion with regional configurations.
 */
@Entity
@Table(name = "countries", schema = "kartezy_enterprise")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class Country extends GeoEntity {

    @Column(nullable = false, length = 3)
    private String isoCode; // ISO 3166-1 alpha-3

    @Column(length = 2)
    private String isoCode2; // ISO 3166-1 alpha-2

    @Column(nullable = false)
    private String callingCode;

    @Column(nullable = false)
    private String currencyCode; // ISO 4217

    @Column(nullable = false)
    private String defaultLocale;

    @Column(nullable = false)
    private String defaultTimezone;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(length = 500)
    private String flagUrl;

    @OneToMany(mappedBy = "country", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @Builder.Default
    private Set<State> states = new HashSet<>();

    @Column(nullable = false)
    @Builder.Default
    private Boolean requiresVat = false;

    @Column
    private String vatLabel; // "GST", "VAT", "IVA", "Sales Tax"

    @Column
    private Integer vatPercentage;

    @Column(nullable = false)
    @Builder.Default
    private Boolean gdprEnabled = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean dataLocalizationRequired = false;
}
