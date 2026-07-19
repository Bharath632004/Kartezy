package com.kartezy.ops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ops_dashboard", indexes = {
    @Index(name = "idx_dash_date", columnList = "snapshotDate"),
    @Index(name = "idx_dash_city", columnList = "city_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OpsDashboard extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id")
    private City city;

    @Column(nullable = false)
    private LocalDateTime snapshotDate;

    // Order metrics
    @Builder.Default private Integer totalOrders = 0;
    @Builder.Default private Integer successfulDeliveries = 0;
    @Builder.Default private Integer failedDeliveries = 0;
    @Builder.Default private Integer onTimeDeliveries = 0;

    // Support metrics
    @Builder.Default private Integer openTickets = 0;
    @Builder.Default private Integer criticalTickets = 0;
    @Builder.Default private Integer slaBreaches = 0;
    @Builder.Default private Double avgResolutionTimeHrs = 0.0;
    @Builder.Default private Double avgCsatScore = 0.0;

    // Inventory metrics
    @Builder.Default private Integer outOfStockItems = 0;
    @Builder.Default private Integer lowStockItems = 0;
    @Builder.Default private Double inventoryAccuracyPct = 100.0;

    // Delivery metrics
    @Builder.Default private Integer activeDeliveries = 0;
    @Builder.Default private Integer availablePartners = 0;
    @Builder.Default private Integer busyPartners = 0;
    @Builder.Default private Double avgDeliveryTimeMin = 0.0;

    // Warehouse metrics
    @Builder.Default private Double warehouseUtilizationPct = 0.0;
    @Builder.Default private Integer activeWarehouses = 0;

    // Merchant metrics
    @Builder.Default private Integer pendingVerifications = 0;
    @Builder.Default private Integer activeMerchants = 0;

    @Builder.Default private Boolean isActive = true;
}
