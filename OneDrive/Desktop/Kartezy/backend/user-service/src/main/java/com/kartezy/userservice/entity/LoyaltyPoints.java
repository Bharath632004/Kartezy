package com.kartezy.userservice.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Email;
import lombok.*;
import com.kartezy.shared.audit.AuditableEntity;
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
