package com.kartezy.ops.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "merchant_operations", indexes = {
    @Index(name = "idx_mo_merchant", columnList = "merchantId"),
    @Index(name = "idx_mo_status", columnList = "verificationStatus"),
    @Index(name = "idx_mo_city", columnList = "city_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MerchantOperation extends BaseEntity {
    @Column(nullable = false, unique = true)
    private Long merchantId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @NotBlank @Size(max = 200)
    @Column(nullable = false)
    private String businessName;

    @NotBlank @Size(max = 50)
    @Column(nullable = false)
    private String businessType;

    @Column(nullable = false)
    private String verificationStatus;

    private LocalDateTime verifiedAt;

    @Size(max = 100)
    private String verifiedBy;

    @Builder.Default
    private Integer totalOrders = 0;

    @Builder.Default
    private BigDecimal avgRating = BigDecimal.ZERO;

    @Builder.Default
    private Integer slaBreaches = 0;

    @Builder.Default
    private Double onTimeDeliveryRate = 100.0;

    @Builder.Default
    private Boolean isActive = true;

    @Column(length = 1000)
    private String remarks;

    private LocalDateTime lastOrderAt;
}
