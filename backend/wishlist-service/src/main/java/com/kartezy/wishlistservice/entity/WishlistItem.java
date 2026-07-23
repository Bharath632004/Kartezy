package com.kartezy.wishlistservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "wishlist_items", indexes = {
    @Index(name = "idx_wishlist_item_wishlist_id", columnList = "wishlistId"),
    @Index(name = "idx_wishlist_item_product_id", columnList = "productId"),
    @Index(name = "idx_wishlist_item_wishlist_product", columnList = "wishlistId, productId", unique = true)
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID wishlistId;

    @Column(nullable = false)
    private UUID productId;

    @Column(nullable = false)
    private UUID merchantId;

    @Column(nullable = false, length = 255)
    private String productName;

    @Column(length = 500)
    private String productImage;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal priceAtAdd;

    @Column(length = 255)
    private String notes;

    @Column(nullable = false)
    @Builder.Default
    private boolean notified = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
