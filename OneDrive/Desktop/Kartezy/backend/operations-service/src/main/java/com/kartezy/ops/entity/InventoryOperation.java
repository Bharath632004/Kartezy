package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_operations", indexes = {
    @Index(name = "idx_io_warehouse", columnList = "warehouse_id"),
    @Index(name = "idx_io_health", columnList = "healthStatus"),
    @Index(name = "idx_io_merchant", columnList = "merchantId")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryOperation extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    private Long merchantId;

    @Size(max = 100)
    private String inventoryType;

    @Builder.Default
    private Integer totalSkuCount = 0;

    @Builder.Default
    private Integer activeSkuCount = 0;

    @Builder.Default
    private Integer outOfStockSkuCount = 0;

    @Builder.Default
    private Integer lowStockSkuCount = 0;

    @Column(nullable = false)
    private String healthStatus;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal stockAccuracyPercent = BigDecimal.valueOf(100.0);

    @Builder.Default
    private Integer pendingRestocks = 0;

    @Builder.Default
    private Integer inboundShipments = 0;

    @Builder.Default
    private Integer outboundShipments = 0;

    private LocalDateTime lastAuditAt;

    @Column(length = 500)
    private String notes;
}
