package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Favorite store entity for customer's favorite stores.
 */
@Entity
@Table(name = "favorite_stores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteStore extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @Column(name = "store_id", nullable = false)
    private String storeId; // Reference to catalog/service store

    @Column(name = "store_name", length = 255)
    private String storeName;

    @Column(name = "store_logo_url", length = 500)
    private String storeLogoUrl;
}