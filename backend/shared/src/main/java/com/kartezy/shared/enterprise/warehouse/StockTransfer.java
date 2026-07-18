package com.kartezy.shared.enterprise.warehouse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

/**
 * Stock transfer between warehouses for inventory redistribution.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockTransfer {

    private String transferId;
    private String fromWarehouse;
    private String toWarehouse;
    private String productId;
    private String sku;
    private int quantity;
    private TransferStatus status;
    private String reason;
    private String referenceNumber;

    // Timeline
    private ZonedDateTime requestedAt;
    private ZonedDateTime approvedAt;
    private ZonedDateTime pickedAt;
    private ZonedDateTime shippedAt;
    private ZonedDateTime receivedAt;
    private ZonedDateTime createdAt;

    // Tracking
    private String trackingNumber;
    private String carrier;
    private String driverId;
    private String vehicleNumber;

    // Notes
    private String notes;
    private String approvedBy;
    private String receivedBy;

    public enum TransferStatus {
        REQUESTED, APPROVED, PICKING, PACKED, IN_TRANSIT, ARRIVED, RECEIVED, COMPLETED, CANCELLED
    }
}
