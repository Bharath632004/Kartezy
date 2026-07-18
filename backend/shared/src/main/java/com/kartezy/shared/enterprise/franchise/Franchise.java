package com.kartezy.shared.enterprise.franchise;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Map;
import java.util.Set;

/**
 * Franchise entity for multi-franchise management.
 * Each franchise can operate independently with its own merchants,
 * delivery zones, and operational rules.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Franchise {

    private String franchiseId;
    private String tenantId;
    private String name;
    private String legalName;
    private String registrationNumber;
    private String taxId;

    // Contact
    private String email;
    private String phone;
    private String website;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    // Operations
    private String timezone;
    private String currencyCode;
    private String languageCode;
    private FranchiseStatus status;
    private FranchiseTier tier;

    // Financial
    private BigDecimal setupFee;
    private BigDecimal monthlyFee;
    private BigDecimal commissionPercentage;
    private BigDecimal revenueShare;
    private String paymentTerms;

    // Geo
    private Double serviceRadiusKm;
    private Integer maxDeliveryDistanceKm;
    private Set<String> serviceableCities;
    private Set<String> serviceablePincodes;

    // Timestamps
    private ZonedDateTime onboardedAt;
    private ZonedDateTime activatedAt;
    private ZonedDateTime contractEndDate;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    // Resources
    private Integer maxMerchants;
    private Integer maxDeliveryPartners;
    private Integer currentMerchants;
    private Integer currentDeliveryPartners;

    // Branding
    private boolean whiteLabelEnabled;
    private String logoUrl;
    private String brandName;
    private String primaryColor;
    private String secondaryColor;

    // Metadata
    private Map<String, Object> metadata;
    private Set<String> permissions;

    public enum FranchiseStatus {
        PENDING, ONBOARDING, ACTIVE, SUSPENDED, TERMINATED
    }

    public enum FranchiseTier {
        BASIC, STANDARD, PREMIUM, ENTERPRISE
    }

    public boolean isOperational() {
        return status == FranchiseStatus.ACTIVE;
    }

    public boolean canAddMerchant() {
        return isOperational() && currentMerchants < maxMerchants;
    }
}
