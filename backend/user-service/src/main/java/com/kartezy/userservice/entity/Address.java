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

import java.util.UUID;

/**
 * Address entity for customer addresses.
 */
@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @Column(name = "type", length = 20)
    @Enumerated(EnumType.STRING)
    private AddressType type;

    @Column(name = "street", length = 255)
    private String street;

    @Column(name = "apartment", length = 100)
    private String apartment;

    @Column(name = "floor", length = 50)
    private String floor;

    @Column(name = "building", length = 100)
    private String building;

    @Column(name = "landmark", length = 255)
    private String landmark;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "is_default")
    private boolean defaultAddress = false;

    @Column(name = "instructions", length = 500)
    private String instructions;

    // Enums
    public enum AddressType {
        HOME, OFFICE, OTHER
    }
}