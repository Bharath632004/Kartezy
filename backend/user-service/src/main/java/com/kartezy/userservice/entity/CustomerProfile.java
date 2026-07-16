package com.kartezy.userservice.entity;
import jakarta.persistence.*;
import lombok.*;
import com.kartezy.shared.audit.AuditableEntity;
import java.util.UUID;
import java.time.LocalDate;
import java.util.Set;
import java.util.HashSet;
/**
 * Customer profile extending the auth user with additional profile information.
 */
@Entity
@Table(name = "customer_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerProfile extends AuditableEntity {
    // Reference to the auth service user (by user id)
    @Column(name = "user_id", nullable = false, updatable = false, unique = true)
    private UUID userId;
    @Column(name = "first_name", length = 100)
    private String firstName;
    @Column(name = "last_name", length = 100)
    private String lastName;
    @Column(name = "email", length = 255)
    private String email;
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", length = 20)
    private Gender gender;
    @Column(name = "nationality", length = 100)
    private String nationality;
    @Column(name = "occupation", length = 100)
    private String occupation;
    @Column(name = "profile_photo_url", length = 500)
    private String profilePhotoUrl;
    @Column(name = "email_verified")
    @Builder.Default
    private boolean emailVerified = false;
    @Column(name = "phone_verified")
    @Builder.Default
    private boolean phoneVerified = false;
    @Column(name = "mfa_enabled")
    @Builder.Default
    private boolean mfaEnabled = false;
    // One-to-Many with Address
    @OneToMany(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Address> addresses = new HashSet<>();
    // One-to-Many with FavoriteStore
    @OneToMany(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<FavoriteStore> favoriteStores = new HashSet<>();
    // One-to-Many with FavoriteProduct
    @OneToMany(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<FavoriteProduct> favoriteProducts = new HashSet<>();
    // One-to-Many with Wishlist (maybe one wishlist per user? We'll make it a collection for now)
    @OneToMany(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Wishlist> wishlists = new HashSet<>();
    // One-to-One with NotificationPreference
    @OneToOne(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private NotificationPreference notificationPreference;
    // One-to-One with LanguagePreference
    @OneToOne(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private LanguagePreference languagePreference;
    // One-to-One with ThemePreference
    @OneToOne(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private ThemePreference themePreference;
    // One-to-One with PrivacySettings
    @OneToOne(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private PrivacySettings privacySettings;
    // One-to-One with UserPreference (general preferences)
    @OneToOne(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserPreference userPreference;
    // One-to-Many with Referral (as referrer)
    @OneToMany(mappedBy = "referrer", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Referral> referralsMade = new HashSet<>();
    // One-to-One with ReferralReward (the rewards for this user)
    @OneToOne(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private ReferralReward referralReward;
    // One-to-One with LoyaltyPoints
    @OneToOne(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private LoyaltyPoints loyaltyPoints;
    // One-to-One with Membership
    @OneToOne(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private Membership membership;
    // One-to-One with WalletReference
    @OneToOne(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private WalletReference walletReference;
    // One-to-Many with ActivityLog
    @OneToMany(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ActivityLog> activityLogs = new HashSet<>();
    // One-to-Many with SearchHistory
    @OneToMany(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<SearchHistory> searchHistories = new HashSet<>();
    // One-to-Many with DeviceHistory
    @OneToMany(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<DeviceHistory> deviceHistories = new HashSet<>();
    // One-to-Many with LoginHistory
    @OneToMany(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<LoginHistory> loginHistories = new HashSet<>();
    // One-to-One with DeleteAccountRequest (if any)
    @OneToOne(mappedBy = "customerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private DeleteAccountRequest deleteAccountRequest;
    // Enums
    public enum Gender {
        MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    }
}