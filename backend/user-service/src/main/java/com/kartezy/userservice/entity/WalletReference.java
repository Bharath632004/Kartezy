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
 * Wallet reference entity for linking customer to wallet service.
 */
@Entity
@Table(name = "wallet_references")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletReference extends AuditableEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_profile_id", nullable = false)
    private CustomerProfile customerProfile;
    @NotBlank
    @Size(max = 100)
    @Column(name = "wallet_id", length = 100)
    private String walletId; // Reference to wallet service wallet ID
    @NotBlank
    @Size(max = 100)
    @Column(name = "wallet_type", length = 100)
    private String walletType; // e.g., WALLET, BANK, CARD
    @Column(name = "is_primary")
    @Builder.Default
    private boolean isPrimary = false;
    @Column(name = "is_verified")
    @Builder.Default
    private boolean isVerified = false;
}
