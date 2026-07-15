package com.kartezy.inventoryservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "stock_transfers", indexes = {
    @Index(name = "idx_st_from_wh", columnList = "fromWarehouseId"),
    @Index(name = "idx_st_to_wh", columnList = "toWarehouseId"),
    @Index(name = "idx_st_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockTransfer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID fromWarehouseId;

    @Column(nullable = false)
    private UUID toWarehouseId;

    @Column(nullable = false)
    private UUID productId;

    @Column(nullable = false, length = 100)
    private String sku;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 500)
    private String reason;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private TransferStatus status;

    @Column(length = 100)
    private String initiatedBy;

    @Column(length = 100)
    private String approvedBy;

    private LocalDateTime approvedAt;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = TransferStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TransferStatus { PENDING, APPROVED, IN_TRANSIT, COMPLETED, CANCELLED }
}
