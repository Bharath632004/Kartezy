package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Favorite product entity for customer's favorite products.
 */
@Entity
@Table(name = "favorite_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteProduct extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;

    @Column(name = "product_id", nullable = false)
    private String productId; // Reference to catalog service product

    @Column(name = "product_name", length = 255)
    private String productName;

    @Column(name = "product_image_url", length = 500)
    private String productImageUrl;

    @Column(name = "added_at")
    private Long addedAt; // timestamp when added
}