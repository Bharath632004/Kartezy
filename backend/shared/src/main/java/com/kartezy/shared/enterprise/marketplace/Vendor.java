package com.kartezy.shared.enterprise.marketplace;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Set;

/**
 * Vendor entity for the Kartezy marketplace.
 * Vendors can be individual sellers or businesses selling through the platform.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {

    private String vendorId;
    private String tenantId;
    private String name;
    private String legalName;
    private String businessType; // INDIVIDUAL, PARTNERSHIP, PRIVATE_LIMITED, PUBLIC_LIMITED
    private String registrationNumber;
    private String gstin; // GST Identification Number
    private String panNumber; // Permanent Account Number

    // Contact
    private String email;
    private String phone;
    private String website;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    // Marketplace configuration
    private String storeName;
    private String storeDescription;
    private String storeLogo;
    private String storeBanner;
    private String storeSlug;
    private boolean isFeatured;
    private boolean isVerified;
    private double rating;
    private int totalReviews;

    // Financial
    private BigDecimal commissionRate; // Platform commission percentage
    private BigDecimal commissionCap; // Maximum commission amount
    private BigDecimal settlementPeriod; // Days between settlements
    private String settlementMode; // DAILY, WEEKLY, BIWEEKLY, MONTHLY
    private BigDecimal minimumPayout;
    private String payoutMethod; // BANK_TRANSFER, WALLET, CHECK

    // Catalog
    private int totalProducts;
    private int activeProducts;
    private Set<String> categories;
    private Set<String> supportedPincodes;

    // Status
    private VendorStatus status;
    private boolean isActive;
    private boolean kycCompleted;

    // Timestamps
    private ZonedDateTime onboardedAt;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private ZonedDateTime lastSaleAt;

    // Performance
    private int totalOrders;
    private BigDecimal totalRevenue;
    private BigDecimal lifetimeRevenue;
    private double fulfillmentRate;
    private double cancellationRate;
    private int returnRate;

    public enum VendorStatus {
        PENDING, DOCUMENTS_UPLOADED, UNDER_REVIEW, APPROVED, REJECTED, SUSPENDED
    }

    public boolean canSell() {
        return isActive && kycCompleted && status == VendorStatus.APPROVED;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VendorPayout {
        private String payoutId;
        private String vendorId;
        private BigDecimal amount;
        private String currencyCode;
        private PayoutStatus status;
        private ZonedDateTime requestedAt;
        private ZonedDateTime processedAt;
        private String transactionReference;

        public enum PayoutStatus {
            PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
        }
    }
}
