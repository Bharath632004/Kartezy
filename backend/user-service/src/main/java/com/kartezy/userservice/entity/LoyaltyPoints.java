package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Loyalty points entity for tracking customer's loyalty points and tier.
 */
@Entity
@Table(name = "loyalty_points")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoyaltyPoints extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @Column(name = "current_points")
    private Long currentPoints = 0L;

    @Column(name = "total_earned")
    private Long totalEarned = 0L;

    @Column(name = "total_redeemed")
    private Long totalRedeemed = 0L;

    @NotBlank
    @Size(max = 20)
    @Column(name = "tier", length = 20)
    private String tier = "BRONZE"; // BRONZE, SILVER, GOLD, PLATINUM

    @Column(name = "last_updated")
    private Long lastUpdated;
}
