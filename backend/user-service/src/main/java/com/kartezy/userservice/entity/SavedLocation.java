package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Saved location entity for customer's saved locations (like home, office, etc.)
 */
@Entity
@Table(name = "saved_locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedLocation extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", length = 100)
    private String name;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Size(max = 255)
    @Column(name = "address", length = 255)
    private String address;

    @Size(max = 500)
    @Column(name = "instructions", length = 500)
    private String instructions;
}
