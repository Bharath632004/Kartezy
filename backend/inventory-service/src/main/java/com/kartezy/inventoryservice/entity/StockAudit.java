package com.kartezy.inventoryservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "stock_audits", indexes = {
    @Index(name = "idx_sa_sku", columnList = "sku"),
    @Index(name = "idx_sa_status", columnList = "status")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String sku;

    @Column(length = 200)
    private String productName;

    @Column(nullable = false)
    private Integer systemQuantity;

    @Column(nullable = false)
    private Integer physicalQuantity;

    @Column(nullable = false)
    private Integer variance;

    @Column(length = 500)
    private String notes;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private AuditStatus status;

    @Column(length = 100)
    private String auditedBy;

    @Column(nullable = false)
    private LocalDateTime auditDate;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        auditDate = LocalDateTime.now();
        variance = physicalQuantity - systemQuantity;
        if (status == null) status = AuditStatus.PENDING;
    }

    public enum AuditStatus { PENDING, VERIFIED, DISCREPANCY_FOUND, RESOLVED }
}
