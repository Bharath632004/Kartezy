package com.kartezy.userservice.entity;
import jakarta.persistence.*;
import lombok.*;
import com.kartezy.shared.audit.AuditableEntity;
import java.util.HashSet;
import java.util.Set;
/**
 * Wishlist entity for customer's wishlists.
 */
@Entity
@Table(name = "wishlists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist extends AuditableEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;
    @Column(name = "name", length = 100)
    private String name;
    @Column(name = "description", length = 500)
    private String description;
    @OneToMany(mappedBy = "wishlist", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<WishlistItem> items = new HashSet<>();
    // Convenience methods
    public void addItem(WishlistItem item) {
        this.items.add(item);
        item.setWishlist(this);
    }
    public void removeItem(WishlistItem item) {
        this.items.remove(item);
        item.setWishlist(null);
    }
}