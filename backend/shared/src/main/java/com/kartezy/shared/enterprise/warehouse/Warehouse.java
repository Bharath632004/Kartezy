package com.kartezy.shared.enterprise.warehouse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.Set;

/**
 * Warehouse entity for multi-warehouse operations.
 * Each warehouse can serve specific cities, pincodes, and merchant types.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Warehouse {

    private String warehouseId;
    private String tenantId;
    private String name;
    private String code;
    private WarehouseType type;

    // Location
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private double latitude;
    private double longitude;
    private String timezone;

    // Service area
    private Set<String> serviceablePincodes;
    private Set<String> serviceableCities;
    private double maxDeliveryRadiusKm;
    private int priority;

    // Capacity
    private double totalAreaSqFt;
    private double capacity;
    private double currentUtilization;
    private int maxPickingStations;
    private int activePickingStations;

    // Status
    private boolean isActive;
    private boolean isPrimary;
    private WarehouseStatus status;

    // Timestamps
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private ZonedDateTime lastInventoryCheck;

    // Operational
    private String operatingHoursStart;
    private String operatingHoursEnd;
    private Set<String> operatingDays;
    private int maxSameDayOrders;
    private int currentOrderLoad;

    // Performance
    private double pickingAccuracy;
    private double avgPickingTimeMinutes;
    private double fulfillmentRate;
    private int totalOrdersProcessed;

    public enum WarehouseType {
        FULFILLMENT, DISTRIBUTION, CROSS_DOCK, MICRO_FULFILLMENT, DARK_STORE, RETURNS_PROCESSING
    }

    public enum WarehouseStatus {
        ACTIVE, MAINTENANCE, CLOSED, UNDER_CONSTRUCTION
    }

    public boolean canAcceptOrders() {
        return isActive && status == WarehouseStatus.ACTIVE
                && currentOrderLoad < maxSameDayOrders;
    }
}
