package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_operations", indexes = {
    @Index(name = "idx_del_order", columnList = "orderId"),
    @Index(name = "idx_del_partner", columnList = "deliveryPartnerId"),
    @Index(name = "idx_del_status", columnList = "status"),
    @Index(name = "idx_del_zone", columnList = "zone_id"),
    @Index(name = "idx_del_date", columnList = "assignedAt")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryOperation extends BaseEntity {
    @Column(nullable = false, unique = true)
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "zone_id")
    private Zone zone;

    private Long deliveryPartnerId;

    @Size(max = 100)
    private String deliveryPartnerName;

    @Column(nullable = false)
    private String status;

    private LocalDateTime assignedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    @Builder.Default
    private Integer distanceKm = 0;

    @Builder.Default
    private Integer estimatedMinutes = 0;

    @Builder.Default
    private Integer actualMinutes = 0;

    @Builder.Default
    private Boolean isOnTime = true;

    @Column(length = 500)
    private String deliveryAddress;

    @Size(max = 20)
    private String customerPhone;

    @Builder.Default
    private Boolean isActive = true;
}
