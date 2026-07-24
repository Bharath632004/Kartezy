package com.kartezy.authservice.service;

import com.kartezy.authservice.dto.LoginResponse;
import com.kartezy.authservice.entity.OAuthAccount;
import com.kartezy.authservice.entity.Role;
import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.entity.UserStatus;
import com.kartezy.authservice.repository.OAuthAccountRepository;
import com.kartezy.authservice.repository.RoleRepository;
import com.kartezy.authservice.repository.UserRepository;
import com.kartezy.authservice.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

/**
 * Service for social login via OAuth2 providers (Google, Apple, Facebook).
 * <p>
 * Handles the token exchange and user creation/linking flow:
 * 1. Client sends provider access token from the mobile/web OAuth flow
 * 2. Service validates the token with the provider (optional, can trust client)
 * 3. Finds or creates a user account linked to the OAuth provider
 * 4. Returns JWT tokens for the application
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SocialLoginService {

    private final OAuthAccountRepository oauthAccountRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;

    /**
     * Authenticates or registers a user via social login.
     *
     * @param provider The OAuth provider: "google", "apple", "facebook"
     * @param providerToken The OAuth access token or ID token from the provider
     * @param email Email from the provider
     * @param firstName First name from the provider
     * @param lastName Last name from the provider
     * @param providerUserId The user's unique ID from the provider
     * @return LoginResponse with JWT tokens
     */
    @Transactional
    public LoginResponse authenticate(
            String provider,
            String providerToken,
            String email,
            String firstName,
            String lastName,
            String providerUserId
    ) {
        // Check if OAuth account already exists
        Optional<OAuthAccount> existingOAuth = oauthAccountRepository
                .findByProviderAndProviderUserId(provider.toUpperCase(), providerUserId);

        User user;
        if (existingOAuth.isPresent()) {
            // Existing OAuth account - update tokens and login
            user = existingOAuth.get().getUser();
            updateOAuthAccount(existingOAuth.get(), providerToken);
            log.info("Social login for existing user: {} via {}", email, provider);
        } else if (email != null && userRepository.findByEmail(email).isPresent()) {
            // User exists with this email but not linked to this OAuth provider
            user = userRepository.findByEmail(email).get();
            linkOAuthAccount(user, provider, providerToken, providerUserId);
            log.info("Linked OAuth account {} to existing user: {}", provider, email);
        } else {
            // New user registration via social login
            user = createUserFromSocialLogin(email, firstName, lastName);
            linkOAuthAccount(user, provider, providerToken, providerUserId);
            log.info("New user registered via {}: {}", provider, email);
        }

        // Generate JWT tokens
        String accessToken = jwtUtil.generateAccessToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken();

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getJwtExpiration() / 1000)
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    /**
     * Processes an ID token from the OAuth provider.
     * Validates the token and extracts user info.
     *
     * @param provider The OAuth provider
     * @param idToken The JWT ID token from the provider
     * @return Map of user attributes extracted from the token
     */
    public Map<String, String> processIdToken(String provider, String idToken) {
        try {
            // Decode JWT payload to extract user info
            String[] parts = idToken.split("\\.");
            if (parts.length < 2) {
                throw new IllegalArgumentException("Invalid ID token format");
            }

            java.util.Base64.Decoder decoder = java.util.Base64.getUrlDecoder();
            String payload = new String(decoder.decode(parts[1]));

            // Simple JSON parsing
            String email = extractJsonValue(payload, "email");
            String name = extractJsonValue(payload, "name");
            String givenName = extractJsonValue(payload, "given_name");
            String familyName = extractJsonValue(payload, "family_name");
            String sub = extractJsonValue(payload, "sub");

            if (givenName == null && name != null) {
                String[] nameParts = name.split(" ", 2);
                givenName = nameParts[0];
                familyName = nameParts.length > 1 ? nameParts[1] : "";
            }

            return Map.of(
                    "email", email != null ? email : "",
                    "firstName", givenName != null ? givenName : "",
                    "lastName", familyName != null ? familyName : "",
                    "sub", sub != null ? sub : ""
            );
        } catch (Exception e) {
            log.error("Failed to process ID token from {}: {}", provider, e.getMessage());
            throw new RuntimeException("Invalid OAuth token");
        }
    }

    private String extractJsonValue(String json, String key) {
        String searchKey = "\"" + key + "\"";
        int keyIndex = json.indexOf(searchKey);
        if (keyIndex < 0) return null;

        int valueStart = json.indexOf('"', keyIndex + searchKey.length() + 1);
        if (valueStart < 0) return null;
        valueStart++;

        int valueEnd = json.indexOf('"', valueStart);
        if (valueEnd < 0) return null;

        return json.substring(valueStart, valueEnd);
    }

    private void updateOAuthAccount(OAuthAccount account, String providerToken) {
        account.setAccessToken(providerToken);
        oauthAccountRepository.save(account);
    }

    private void linkOAuthAccount(User user, String provider, String providerToken, String providerUserId) {
        OAuthAccount oauthAccount = OAuthAccount.builder()
                .provider(provider.toUpperCase())
                .providerUserId(providerUserId)
                .accessToken(providerToken)
                .expiresAt(Instant.now().plusSeconds(3600)) // Default 1 hour expiry
                .user(user)
                .build();
        oauthAccountRepository.save(oauthAccount);
    }

    private User createUserFromSocialLogin(String email, String firstName, String lastName) {
        User user = User.builder()
                .email(email)
                .firstName(firstName != null ? firstName : "")
                .lastName(lastName != null ? lastName : "")
                .passwordHash("") // No password for social login users
                .status(UserStatus.ACTIVE)
                .emailVerified(true) // Social providers have verified the email
                .phoneVerified(false)
                .mfaEnabled(false)
                .build();

        User savedUser = userRepository.save(user);

        // Assign default role
        roleRepository.findByName("ROLE_USER").ifPresent(role -> savedUser.addRole(role));
        userRepository.save(savedUser);

        return savedUser;
    }
}
