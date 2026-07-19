package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_operations", indexes = {
    @Index(name = "idx_co_customer", columnList = "customerId"),
    @Index(name = "idx_co_kyc", columnList = "kycStatus"),
    @Index(name = "idx_co_city", columnList = "city_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomerOperation extends BaseEntity {
    @Column(nullable = false, unique = true)
    private Long customerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id")
    private City city;

    @Size(max = 50)
    @Column(nullable = false)
    private String kycStatus;

    private LocalDateTime kycVerifiedAt;

    @Builder.Default
    private Integer totalOrders = 0;

    @Builder.Default
    private Integer cancelledOrders = 0;

    @Builder.Default
    private Integer returnedOrders = 0;

    @Builder.Default
    private Integer supportTickets = 0;

    @Builder.Default
    private Double customerLifetimeValue = 0.0;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private Boolean isBlacklisted = false;

    @Column(length = 500)
    private String blacklistReason;

    private LocalDateTime lastOrderAt;
    private LocalDateTime lastLoginAt;
}
