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