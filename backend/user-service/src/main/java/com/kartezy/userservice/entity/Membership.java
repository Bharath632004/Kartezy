package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Membership entity for customer's membership/subscription details.
 */
@Entity
@Table(name = "memberships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Membership extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @NotBlank
    @Size(max = 20)
    @Column(name = "plan", length = 20)
    private String plan; // e.g., BASIC, PREMIUM, ULTIMATE

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_active")
    private boolean isActive = false;

    @Column(name = "auto_renew")
    private boolean autoRenew = false;

    @Column(name = "price")
    private Double price;

    @Column(name = "currency")
    @Size(max = 3)
    private String currency; // e.g., USD, EUR, INR
}
