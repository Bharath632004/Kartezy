package com.kartezy.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

/**
 * Data Transfer Object for CustomerProfile entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerProfileDto {

    private UUID id;

    @NotNull
    private UUID userId;

    @NotBlank
    @Size(max = 100)
    private String firstName;

    @NotBlank
    @Size(max = 100)
    private String lastName;

    @NotBlank
    @Email
    @Size(max = 255)
    private String email;

    @NotBlank
    @Size(max = 20)
    private String phoneNumber;

    private LocalDate dateOfBirth;

    private Gender gender;

    @Size(max = 100)
    private String nationality;

    @Size(max = 100)
    private String occupation;

    @Size(max = 500)
    private String profilePhotoUrl;

    private boolean emailVerified = false;

    private boolean phoneVerified = false;

    private boolean mfaEnabled = false;

    private Set<AddressDto> addresses = java.util.Set.of();

    private Set<FavoriteStoreDto> favoriteStores = java.util.Set.of();

    private Set<FavoriteProductDto> favoriteProducts = java.util.Set.of();

    private Set<WishlistDto> wishlists = java.util.Set.of();

    private NotificationPreferenceDto notificationPreference;

    private LanguagePreferenceDto languagePreference;

    private ThemePreferenceDto themePreference;

    private PrivacySettingsDto privacySettings;

    private UserPreferenceDto userPreference;

    private ReferralDto referral;

    private ReferralRewardDto referralReward;

    private LoyaltyPointsDto loyaltyPoints;

    private MembershipDto membership;

    private WalletReferenceDto walletReference;

    /**
     * Gender enumeration
     */
    public enum Gender {
        MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    }
}
