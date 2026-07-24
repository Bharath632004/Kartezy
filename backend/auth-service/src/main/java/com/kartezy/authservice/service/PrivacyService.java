package com.kartezy.authservice.service;

import com.kartezy.authservice.entity.*;
import com.kartezy.authservice.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

/**
 * Privacy service implementing rights under GDPR / India DPDP Act.
 * <p>
 * Features:
 * - Download My Data (data portability)
 * - Delete My Account (right to be forgotten)
 * - Data anonymization
 * - Cookie preferences
 * - Data retention enforcement
 * - Consent management
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PrivacyService {

    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final SessionRepository sessionRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OTPRepository otpRepository;
    private final OAuthAccountRepository oauthAccountRepository;

    /**
     * Exports all data associated with a user.
     * Implements GDPR Article 20 - Right to Data Portability.
     */
    public UserDataExport exportUserData(UUID userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }

        User user = userOpt.get();

        UserDataExport export = new UserDataExport();
        export.setExportedAt(Instant.now());
        export.setUserId(userId);

        // Basic profile
        UserDataExport.UserProfile profile = new UserDataExport.UserProfile();
        profile.setEmail(user.getEmail());
        profile.setPhoneNumber(user.getPhoneNumber());
        profile.setFirstName(user.getFirstName());
        profile.setLastName(user.getLastName());
        profile.setStatus(user.getStatus().name());
        profile.setEmailVerified(user.isEmailVerified());
        profile.setPhoneVerified(user.isPhoneVerified());
        profile.setMfaEnabled(user.isMfaEnabled());
        profile.setCreatedAt(user.getCreatedAtDt() != null
                ? Instant.ofEpochMilli(user.getCreatedAtDt()) : null);
        profile.setUpdatedAt(user.getUpdatedAtDt() != null
                ? Instant.ofEpochMilli(user.getUpdatedAtDt()) : null);
        export.setProfile(profile);

        // Roles
        Set<String> roles = new HashSet<>();
        for (Role role : user.getRoles()) {
            roles.add(role.getName());
        }
        export.setRoles(roles);

        // Connected OAuth accounts
        List<UserDataExport.OAuthAccountInfo> oauthAccounts = new ArrayList<>();
        for (OAuthAccount oauth : user.getOauthAccounts()) {
            UserDataExport.OAuthAccountInfo info = new UserDataExport.OAuthAccountInfo();
            info.setProvider(oauth.getProvider());
            info.setProviderUserId(oauth.getProviderUserId());
            info.setLinkedAt(oauth.getCreatedAtDt() != null
                    ? Instant.ofEpochMilli(oauth.getCreatedAtDt()) : null);
            oauthAccounts.add(info);
        }
        export.setOauthAccounts(oauthAccounts);

        // Devices
        List<UserDataExport.DeviceInfo> devices = new ArrayList<>();
        for (Device device : user.getDevices()) {
            UserDataExport.DeviceInfo info = new UserDataExport.DeviceInfo();
            info.setDeviceName(device.getDeviceName());
            info.setDeviceType(device.getDeviceType());
            info.setOs(device.getOs());
            info.setBrowser(device.getBrowser());
            info.setLastUsed(device.getLastUsedAt());
            info.setTrusted(device.isTrusted());
            devices.add(info);
        }
        export.setDevices(devices);

        log.info("Data export generated for user: {}", user.getEmail());
        return export;
    }

    /**
     * Anonymizes or deletes a user's data.
     * Implements GDPR Article 17 - Right to Erasure (Right to be Forgotten).
     *
     * @param hardDelete If true, physically delete data. If false, anonymize.
     */
    @Transactional
    public void deleteUserData(UUID userId, boolean hardDelete) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return;
        }

        User user = userOpt.get();

        if (hardDelete) {
            // Physical deletion
            oauthAccountRepository.deleteAll(user.getOauthAccounts());
            deviceRepository.deleteAll(user.getDevices());
            sessionRepository.deleteAll(user.getSessions());
            refreshTokenRepository.deleteAll(user.getRefreshTokens());
            otpRepository.deleteAll(user.getOtps());
            userRepository.delete(user);
            log.info("User data permanently deleted: {}", userId);
        } else {
            // Anonymization (pseudonymization)
            String anonymizedEmail = "deleted-" + userId + "@anonymized.kartezy.com";
            user.setEmail(anonymizedEmail);
            user.setPhoneNumber("ANONYMIZED");
            user.setFirstName("[DELETED]");
            user.setLastName("[DELETED]");
            user.setPasswordHash("[DELETED]");
            user.setStatus(UserStatus.INACTIVE);
            user.setEmailVerified(false);
            user.setPhoneVerified(false);
            userRepository.save(user);

            // Anonymize OAuth accounts
            for (OAuthAccount oauth : user.getOauthAccounts()) {
                oauth.setProviderUserId("[DELETED]");
                oauth.setAccessToken("[DELETED]");
                oauth.setRefreshToken("[DELETED]");
            }
            oauthAccountRepository.saveAll(user.getOauthAccounts());

            // Anonymize devices
            for (Device device : user.getDevices()) {
                device.setDeviceId("[DELETED]");
                device.setDeviceName("[DELETED]");
            }
            deviceRepository.saveAll(user.getDevices());

            log.info("User data anonymized: {}", userId);
        }
    }

    /**
     * Enforces data retention policy by deleting data older than the retention period.
     * Called by a scheduled job.
     */
    @Transactional
    public int enforceDataRetention(int retentionDays) {
        Instant cutoff = Instant.now().minusSeconds(retentionDays * 86400L);

        // Delete expired OTPs
        int deletedOtps = otpRepository.deleteExpired(cutoff);

        // Find users inactive beyond retention period
        List<User> inactiveUsers = userRepository.findAll().stream()
                .filter(u -> u.getUpdatedAtDt() != null
                        && Instant.ofEpochMilli(u.getUpdatedAtDt()).isBefore(cutoff)
                        && u.getStatus() == UserStatus.INACTIVE)
                .toList();

        for (User user : inactiveUsers) {
            deleteUserData(user.getId(), true);
        }

        log.info("Data retention enforced: {} OTPs deleted, {} inactive users removed", deletedOtps, inactiveUsers.size());
        return deletedOtps + inactiveUsers.size();
    }

    // ======== Data Export Model ========

    public static class UserDataExport {
        private Instant exportedAt;
        private UUID userId;
        private UserProfile profile;
        private Set<String> roles;
        private List<OAuthAccountInfo> oauthAccounts;
        private List<DeviceInfo> devices;

        public Instant getExportedAt() { return exportedAt; }
        public void setExportedAt(Instant exportedAt) { this.exportedAt = exportedAt; }
        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }
        public UserProfile getProfile() { return profile; }
        public void setProfile(UserProfile profile) { this.profile = profile; }
        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> roles) { this.roles = roles; }
        public List<OAuthAccountInfo> getOauthAccounts() { return oauthAccounts; }
        public void setOauthAccounts(List<OAuthAccountInfo> oauthAccounts) { this.oauthAccounts = oauthAccounts; }
        public List<DeviceInfo> getDevices() { return devices; }
        public void setDevices(List<DeviceInfo> devices) { this.devices = devices; }

        public static class UserProfile {
            private String email;
            private String phoneNumber;
            private String firstName;
            private String lastName;
            private String status;
            private boolean emailVerified;
            private boolean phoneVerified;
            private boolean mfaEnabled;
            private Instant createdAt;
            private Instant updatedAt;

            public String getEmail() { return email; }
            public void setEmail(String email) { this.email = email; }
            public String getPhoneNumber() { return phoneNumber; }
            public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
            public String getFirstName() { return firstName; }
            public void setFirstName(String firstName) { this.firstName = firstName; }
            public String getLastName() { return lastName; }
            public void setLastName(String lastName) { this.lastName = lastName; }
            public String getStatus() { return status; }
            public void setStatus(String status) { this.status = status; }
            public boolean isEmailVerified() { return emailVerified; }
            public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
            public boolean isPhoneVerified() { return phoneVerified; }
            public void setPhoneVerified(boolean phoneVerified) { this.phoneVerified = phoneVerified; }
            public boolean isMfaEnabled() { return mfaEnabled; }
            public void setMfaEnabled(boolean mfaEnabled) { this.mfaEnabled = mfaEnabled; }
            public Instant getCreatedAt() { return createdAt; }
            public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
            public Instant getUpdatedAt() { return updatedAt; }
            public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
        }

        public static class OAuthAccountInfo {
            private String provider;
            private String providerUserId;
            private Instant linkedAt;

            public String getProvider() { return provider; }
            public void setProvider(String provider) { this.provider = provider; }
            public String getProviderUserId() { return providerUserId; }
            public void setProviderUserId(String providerUserId) { this.providerUserId = providerUserId; }
            public Instant getLinkedAt() { return linkedAt; }
            public void setLinkedAt(Instant linkedAt) { this.linkedAt = linkedAt; }
        }

        public static class DeviceInfo {
            private String deviceName;
            private String deviceType;
            private String os;
            private String browser;
            private Instant lastUsed;
            private boolean trusted;

            public String getDeviceName() { return deviceName; }
            public void setDeviceName(String deviceName) { this.deviceName = deviceName; }
            public String getDeviceType() { return deviceType; }
            public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
            public String getOs() { return os; }
            public void setOs(String os) { this.os = os; }
            public String getBrowser() { return browser; }
            public void setBrowser(String browser) { this.browser = browser; }
            public Instant getLastUsed() { return lastUsed; }
            public void setLastUsed(Instant lastUsed) { this.lastUsed = lastUsed; }
            public boolean isTrusted() { return trusted; }
            public void setTrusted(boolean trusted) { this.trusted = trusted; }
        }
    }
}
