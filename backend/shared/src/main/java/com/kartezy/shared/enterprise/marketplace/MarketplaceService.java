package com.kartezy.shared.enterprise.marketplace;

import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Core marketplace service for multi-vendor operations.
 * Manages vendor registration, product listing, order splitting,
 * commission calculations, and settlement processing.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MarketplaceService {

    private final Map<String, Vendor> vendors = new ConcurrentHashMap<>();

    /**
     * Register a new vendor.
     */
    public Vendor registerVendor(Vendor vendor) {
        vendor.setStatus(Vendor.VendorStatus.PENDING);
        vendor.setActive(true);
        vendor.setCreatedAt(java.time.ZonedDateTime.now());
        vendors.put(vendor.getVendorId(), vendor);
        log.info("New vendor registered: {} ({})", vendor.getName(), vendor.getVendorId());
        return vendor;
    }

    /**
     * Get a vendor by ID.
     */
    public Vendor getVendor(String vendorId) {
        return vendors.get(vendorId);
    }

    /**
     * Get all active vendors in a city.
     */
    public List<Vendor> getActiveVendorsByCity(String city) {
        return vendors.values().stream()
                .filter(v -> v.isActive() && v.getStatus() == Vendor.VendorStatus.APPROVED)
                .filter(v -> v.getCity().equalsIgnoreCase(city))
                .collect(Collectors.toList());
    }

    /**
     * Split an order across multiple vendors.
     */
    public MultiVendorOrder splitOrder(MultiVendorOrder order) {
        log.info("Splitting order {} across {} vendors",
                order.getOrderId(), order.getVendorOrders().size());
        return order;
    }

    /**
     * Calculate commission for a vendor order.
     */
    public BigDecimal calculateCommission(String vendorId, BigDecimal orderAmount) {
        Vendor vendor = vendors.get(vendorId);
        if (vendor == null || vendor.getCommissionRate() == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal commission = orderAmount.multiply(vendor.getCommissionRate())
                .divide(BigDecimal.valueOf(100));

        // Apply cap if configured
        if (vendor.getCommissionCap() != null
                && commission.compareTo(vendor.getCommissionCap()) > 0) {
            commission = vendor.getCommissionCap();
        }

        return commission;
    }

    /**
     * Process settlement for a vendor.
     */
    public Vendor.VendorPayout processSettlement(String vendorId) {
        Vendor vendor = vendors.get(vendorId);
        if (vendor == null) return null;

        Vendor.VendorPayout payout = Vendor.VendorPayout.builder()
                .payoutId(UUID.randomUUID().toString())
                .vendorId(vendorId)
                .amount(vendor.getTotalRevenue())
                .currencyCode("INR")
                .status(Vendor.VendorPayout.PayoutStatus.PENDING)
                .requestedAt(java.time.ZonedDateTime.now())
                .build();

        log.info("Settlement processed for vendor {}: {} {}", 
                vendorId, payout.getAmount(), payout.getCurrencyCode());
        return payout;
    }

    /**
     * Get marketplace analytics for a vendor.
     */
    public Map<String, Object> getVendorAnalytics(String vendorId) {
        Vendor vendor = vendors.get(vendorId);
        if (vendor == null) return Collections.emptyMap();

        return Map.of(
                "totalOrders", vendor.getTotalOrders(),
                "totalRevenue", vendor.getTotalRevenue(),
                "fulfillmentRate", vendor.getFulfillmentRate(),
                "cancellationRate", vendor.getCancellationRate(),
                "activeProducts", vendor.getActiveProducts(),
                "averageOrderValue", vendor.getTotalOrders() > 0
                        ? vendor.getTotalRevenue().divide(BigDecimal.valueOf(vendor.getTotalOrders()))
                        : BigDecimal.ZERO,
                "rating", vendor.getRating(),
                "returnRate", vendor.getReturnRate()
        );
    }

    /**
     * Multi-vendor order with split items.
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MultiVendorOrder {
        private String orderId;
        private String customerId;
        private List<VendorOrder> vendorOrders;
        private BigDecimal totalAmount;
        private BigDecimal totalCommission;
        private String currencyCode;
        private java.time.ZonedDateTime createdAt;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class VendorOrder {
            private String vendorId;
            private String vendorName;
            private List<OrderItem> items;
            private BigDecimal subtotal;
            private BigDecimal commission;
            private BigDecimal vendorPayout;
            private String deliveryAddress;
            private String status;

            @Data
            @Builder
            @NoArgsConstructor
            @AllArgsConstructor
            public static class OrderItem {
                private String productId;
                private String productName;
                private int quantity;
                private BigDecimal unitPrice;
                private BigDecimal totalPrice;
            }
        }
    }
}
