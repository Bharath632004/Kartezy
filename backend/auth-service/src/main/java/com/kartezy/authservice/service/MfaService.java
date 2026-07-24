package com.kartezy.authservice.service;

import com.kartezy.authservice.entity.MfaBackupCode;
import com.kartezy.authservice.entity.MfaDevice;
import com.kartezy.authservice.entity.User;
import com.kartezy.authservice.repository.MfaBackupCodeRepository;
import com.kartezy.authservice.repository.MfaDeviceRepository;
import com.kartezy.authservice.repository.UserRepository;
import com.kartezy.shared.security.crypto.AESUtil;
import com.kartezy.shared.security.crypto.SecretUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.*;

/**
 * Service for Multi-Factor Authentication (MFA) using TOTP (Time-based One-Time Passwords).
 * Implements RFC 6238 (TOTP) compatible with Google Authenticator, Authy, Microsoft Authenticator.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MfaService {

    private final MfaDeviceRepository mfaDeviceRepository;
    private final MfaBackupCodeRepository backupCodeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${kartezy.security.encryption.key}")
    private String encryptionKey;

    @Value("${kartezy.security.mfa.issuer:kartezy.com}")
    private String mfaIssuer;

    private static final int TOTP_TIME_STEP = 30; // 30 seconds (RFC 6238)
    private static final int TOTP_DIGITS = 6;     // 6 digits
    private static final int BACKUP_CODE_COUNT = 10;
    private static final int BACKUP_CODE_LENGTH = 10;
    private static final int ACCOUNT_LOCKOUT_THRESHOLD = 5;
    private static final int ACCOUNT_LOCKOUT_DURATION_MINUTES = 15;

    /**
     * Generates TOTP secret and provisioning URI for QR code enrollment.
     *
     * @param user The user enrolling in MFA
     * @return MfaEnrollmentResult with secret, QR URI, and backup codes
     */
    @Transactional
    public MfaEnrollmentResult enroll(User user, String deviceName) {
        // Generate TOTP secret (20 bytes = 160 bits per RFC 4226)
        byte[] secretBytes = new byte[20];
        new java.security.SecureRandom().nextBytes(secretBytes);
        String base32Secret = base32Encode(secretBytes);

        // Encrypt and store the secret
        String encryptedSecret = AESUtil.encrypt(base32Secret, encryptionKey);

        MfaDevice device = MfaDevice.builder()
                .user(user)
                .deviceName(deviceName != null ? deviceName : "Default")
                .secretKey(encryptedSecret)
                .verified(false)
                .active(true)
                .method("TOTP")
                .build();
        mfaDeviceRepository.save(device);

        // Generate provisioning URI for QR code
        String provisioningUri = generateProvisioningUri(user.getEmail(), base32Secret);

        // Generate backup codes
        List<MfaBackupCodeDto> backupCodes = generateBackupCodes(user);

        // Enable MFA on user account
        user.setMfaEnabled(true);
        userRepository.save(user);

        log.info("MFA enrollment initiated for user: {}", user.getEmail());

        return new MfaEnrollmentResult(
                device.getId(),
                base32Secret,
                provisioningUri,
                backupCodes
        );
    }

    /**
     * Verifies a TOTP code and marks the device as verified.
     */
    @Transactional
    public boolean verifyAndEnable(User user, UUID deviceId, String totpCode) {
        Optional<MfaDevice> deviceOpt = mfaDeviceRepository.findById(deviceId);
        if (deviceOpt.isEmpty() || !deviceOpt.get().getUser().getId().equals(user.getId())) {
            return false;
        }

        MfaDevice device = deviceOpt.get();
        String decryptedSecret = AESUtil.decrypt(device.getSecretKey(), encryptionKey);

        // Verify the TOTP code (check current and adjacent time steps for clock drift)
        boolean valid = verifyTotp(decryptedSecret, totpCode);

        if (valid) {
            device.setVerified(true);
            device.setVerifiedAt(Instant.now());
            device.setLastUsedAt(Instant.now());
            mfaDeviceRepository.save(device);
            log.info("MFA device verified for user: {}", user.getEmail());
        }

        return valid;
    }

    /**
     * Validates a TOTP code against the user's MFA device.
     */
    public boolean validateCode(User user, String totpCode) {
        List<MfaDevice> devices = mfaDeviceRepository.findByUserAndActiveTrue(user);
        for (MfaDevice device : devices) {
            if (!device.isVerified()) continue;

            String decryptedSecret = AESUtil.decrypt(device.getSecretKey(), encryptionKey);
            if (verifyTotp(decryptedSecret, totpCode)) {
                device.setLastUsedAt(Instant.now());
                mfaDeviceRepository.save(device);
                return true;
            }
        }
        return false;
    }

    /**
     * Validates a backup code and marks it as used.
     */
    @Transactional
    public boolean validateBackupCode(User user, String backupCode) {
        List<MfaBackupCode> codes = backupCodeRepository.findByUserAndUsedFalse(user);
        for (MfaBackupCode storedCode : codes) {
            if (passwordEncoder.matches(backupCode, storedCode.getCodeHash())) {
                backupCodeRepository.markAsUsed(storedCode.getId());
                log.info("Backup code used for user: {}", user.getEmail());
                return true;
            }
        }
        return false;
    }

    /**
     * Disables MFA for a user, removing all devices and backup codes.
     */
    @Transactional
    public void disableMfa(User user) {
        List<MfaDevice> devices = mfaDeviceRepository.findByUserAndActiveTrue(user);
        devices.forEach(d -> d.setActive(false));
        mfaDeviceRepository.saveAll(devices);

        backupCodeRepository.deleteAllByUser(user);

        user.setMfaEnabled(false);
        userRepository.save(user);

        log.info("MFA disabled for user: {}", user.getEmail());
    }

    /**
     * Gets MFA status for a user.
     */
    public MfaStatus getMfaStatus(User user) {
        List<MfaDevice> devices = mfaDeviceRepository.findByUserAndActiveTrue(user);
        long verifiedCount = devices.stream().filter(MfaDevice::isVerified).count();
        long backupCodeCount = backupCodeRepository.countByUserAndUsedFalse(user);

        return new MfaStatus(
                user.isMfaEnabled(),
                verifiedCount > 0,
                devices.size(),
                backupCodeCount
        );
    }

    /**
     * Checks if a user has MFA enabled and verified.
     */
    public boolean isMfaEnabled(User user) {
        return user.isMfaEnabled() && mfaDeviceRepository.existsByUserAndVerifiedTrue(user);
    }

    // ======== Private Methods ========

    private List<MfaBackupCodeDto> generateBackupCodes(User user) {
        // Remove old backup codes
        backupCodeRepository.deleteAllByUser(user);

        List<MfaBackupCodeDto> result = new ArrayList<>();
        for (int i = 0; i < BACKUP_CODE_COUNT; i++) {
            String code = SecretUtils.generateAlphanumeric(BACKUP_CODE_LENGTH);
            String formatted = formatBackupCode(code);

            MfaBackupCode backupCode = MfaBackupCode.builder()
                    .user(user)
                    .codeHash(passwordEncoder.encode(code))
                    .codePrefix(code.substring(0, 4))
                    .used(false)
                    .expiresAt(Instant.now().plusSeconds(365 * 24 * 60 * 60L)) // 1 year expiry
                    .build();
            backupCodeRepository.save(backupCode);

            result.add(new MfaBackupCodeDto(formatted, false));
        }
        return result;
    }

    private String formatBackupCode(String code) {
        if (code.length() <= 4) return code;
        return code.substring(0, 4) + "-" + code.substring(4);
    }

    /**
     * Verifies a TOTP code against a secret.
     * Checks current time step +/- 1 for clock drift tolerance.
     */
    private boolean verifyTotp(String base32Secret, String code) {
        byte[] secret = base32Decode(base32Secret);
        long currentTime = System.currentTimeMillis() / 1000L;
        long timeStep = currentTime / TOTP_TIME_STEP;

        // Check 3 time windows: previous, current, next (allows 30s clock drift)
        for (int i = -1; i <= 1; i++) {
            String expected = generateTotp(secret, timeStep + i);
            if (expected.equals(code)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Generates a TOTP code for a given secret and time step.
     * Implements RFC 6238 / RFC 4226 (HOTP).
     */
    private String generateTotp(byte[] secret, long timeStep) {
        try {
            ByteBuffer buffer = ByteBuffer.allocate(8);
            buffer.putLong(timeStep);

            Mac mac = Mac.getInstance("HmacSHA1");
            SecretKeySpec spec = new SecretKeySpec(secret, "HmacSHA1");
            mac.init(spec);
            byte[] hash = mac.doFinal(buffer.array());

            int offset = hash[hash.length - 1] & 0xf;
            int binary = ((hash[offset] & 0x7f) << 24) |
                         ((hash[offset + 1] & 0xff) << 16) |
                         ((hash[offset + 2] & 0xff) << 8) |
                         (hash[offset + 3] & 0xff);

            int otp = binary % (int) Math.pow(10, TOTP_DIGITS);
            return String.format("%0" + TOTP_DIGITS + "d", otp);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            log.error("TOTP generation failed: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Generates the otpauth:// URI for QR code generation.
     * Compatible with Google Authenticator, Authy, etc.
     */
    private String generateProvisioningUri(String email, String secret) {
        String issuer = mfaIssuer.replace(":", "").replace(" ", "%20");
        String userEmail = email.replace(":", "").replace(" ", "%20");
        return String.format(
                "otpauth://totp/%s:%s?secret=%s&issuer=%s&algorithm=SHA1&digits=%d&period=%d",
                issuer, userEmail, secret, issuer, TOTP_DIGITS, TOTP_TIME_STEP
        );
    }

    /**
     * Base32 encoding (RFC 4648).
     */
    private String base32Encode(byte[] data) {
        final char[] BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".toCharArray();
        StringBuilder result = new StringBuilder();
        int i = 0;
        while (i < data.length) {
            int bytes = Math.min(5, data.length - i);
            long buffer = 0;
            for (int j = 0; j < bytes; j++) {
                buffer = (buffer << 8) | (data[i + j] & 0xFF);
            }
            int bits = bytes * 8;
            while (bits > 0) {
                int index = (int) ((buffer >>> (bits - 5)) & 0x1F);
                result.append(BASE32[index]);
                bits -= 5;
            }
            i += bytes;
        }
        return result.toString();
    }

    /**
     * Base32 decoding (RFC 4648).
     */
    private byte[] base32Decode(String base32) {
        String cleaned = base32.replaceAll("[= \t\n\r]", "").toUpperCase();
        java.io.ByteArrayOutputStream output = new java.io.ByteArrayOutputStream();
        int bits = 0;
        int buffer = 0;
        for (int i = 0; i < cleaned.length(); i++) {
            int value = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".indexOf(cleaned.charAt(i));
            if (value < 0) continue;
            buffer = (buffer << 5) | value;
            bits += 5;
            if (bits >= 8) {
                output.write((buffer >> (bits - 8)) & 0xFF);
                bits -= 8;
            }
        }
        return output.toByteArray();
    }

    // ======== DTOs ========

    public record MfaEnrollmentResult(
            UUID deviceId,
            String secret,
            String provisioningUri,
            List<MfaBackupCodeDto> backupCodes
    ) {}

    public record MfaBackupCodeDto(String code, boolean used) {}

    public record MfaStatus(
            boolean mfaEnabled,
            boolean mfaVerified,
            int deviceCount,
            long backupCodeCount
    ) {}
}
