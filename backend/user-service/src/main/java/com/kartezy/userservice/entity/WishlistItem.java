package com.kartezy.userservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Wishlist item entity representing a product in a wishlist.
 */
@Entity
@Table(name = "wishlist_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistItem extends AuditableEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wishlist_id", nullable = false)
    private Wishlist wishlist;

    @Column(name = "product_id", nullable = false)
    private String productId; // Reference to catalog service product

    @Column(name = "product_name", length = 255)
    private String productName;

    @Column(name = "product_image_url", length = 500)
    private String productImageUrl;

    @Column(name = "added_at")
    private Long addedAt; // timestamp when added
}