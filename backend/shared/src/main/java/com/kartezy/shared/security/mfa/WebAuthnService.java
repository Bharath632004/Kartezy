package com.kartezy.shared.security.mfa;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * WebAuthn / FIDO2 authentication service for passwordless and
 * multi-factor authentication. Supports:
 * - Platform authenticators (Touch ID, Face ID, Windows Hello)
 * - Cross-platform authenticators (YubiKey, security keys)
 * - Backup codes for account recovery
 * - Device attestation
 */
@Slf4j
@Service
public class WebAuthnService {

    private final Map<String, WebAuthnCredential> credentials = new ConcurrentHashMap<>();
    private final Map<String, List<BackupCode>> backupCodes = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        log.info("WebAuthnService initialized");
    }

    /**
     * Generate a registration challenge for a new credential.
     */
    public RegistrationChallenge generateRegistrationChallenge(String userId, String relyingPartyId) {
        byte[] challenge = generateChallenge();
        return RegistrationChallenge.builder()
                .challenge(Base64.getUrlEncoder().withoutPadding().encodeToString(challenge))
                .rpId(relyingPartyId)
                .rpName("Kartezy")
                .userId(userId)
                .userName(userId)
                .userDisplayName("Kartezy User")
                .timeout(60000)
                .attestationType("none")
                .excludeCredentials(getExistingCredentialIds(userId))
                .algorithms(List.of(-7, -257)) // ES256, RS256
                .build();
    }

    /**
     * Verify registration response and store credential.
     */
    public WebAuthnCredential verifyRegistration(String userId, String credentialId,
                                                  String publicKey, String attestationType) {
        if (credentials.containsKey(credentialId)) {
            throw new SecurityException("Credential ID already registered");
        }

        WebAuthnCredential credential = WebAuthnCredential.builder()
                .credentialId(credentialId)
                .userId(userId)
                .publicKey(publicKey)
                .attestationType(attestationType)
                .signatureCounter(0)
                .transports(List.of("internal", "usb", "nfc", "ble"))
                .createdAt(ZonedDateTime.now())
                .lastUsedAt(ZonedDateTime.now())
                .build();

        credentials.put(credentialId, credential);
        log.info("WebAuthn credential registered for user: {} (credential: {})",
                userId, credentialId.substring(0, 8) + "...");
        return credential;
    }

    /**
     * Generate an authentication challenge for login.
     */
    public AuthChallenge generateAuthChallenge(String credentialId, String relyingPartyId) {
        WebAuthnCredential credential = credentials.get(credentialId);
        if (credential == null) {
            throw new SecurityException("Credential not found");
        }

        byte[] challenge = generateChallenge();
        return AuthChallenge.builder()
                .challenge(Base64.getUrlEncoder().withoutPadding().encodeToString(challenge))
                .rpId(relyingPartyId)
                .credentialId(credentialId)
                .timeout(60000)
                .build();
    }

    /**
     * Verify authentication assertion.
     */
    public boolean verifyAssertion(String credentialId, String signature, String clientData,
                                    String authenticatorData) {
        WebAuthnCredential credential = credentials.get(credentialId);
        if (credential == null) {
            log.warn("Unknown credential: {}", credentialId);
            return false;
        }

        try {
            // In production: verify signature using stored public key
            byte[] publicKeyBytes = Base64.getDecoder().decode(credential.getPublicKey());
            KeyFactory keyFactory = KeyFactory.getInstance("EC");
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
            PublicKey publicKey = keyFactory.generatePublic(keySpec);

            Signature sig = Signature.getInstance("SHA256withECDSA");
            sig.initVerify(publicKey);
            sig.update(authenticatorData.getBytes());
            sig.update(Sha256.hash(clientData));

            boolean verified = sig.verify(Base64.getDecoder().decode(signature));

            if (verified) {
                credential.setLastUsedAt(ZonedDateTime.now());
                credential.setSignatureCounter(credential.getSignatureCounter() + 1);
                log.debug("WebAuthn assertion verified for credential: {}",
                        credentialId.substring(0, 8) + "...");
            } else {
                log.warn("WebAuthn assertion FAILED for credential: {}",
                        credentialId.substring(0, 8) + "...");
            }

            return verified;

        } catch (Exception e) {
            log.error("WebAuthn verification error", e);
            return false;
        }
    }

    /**
     * Remove a WebAuthn credential.
     */
    public void removeCredential(String credentialId) {
        WebAuthnCredential credential = credentials.remove(credentialId);
        if (credential != null) {
            log.info("WebAuthn credential removed: {} for user: {}",
                    credentialId, credential.getUserId());
        }
    }

    /**
     * Get all credentials for a user.
     */
    public List<WebAuthnCredential> getUserCredentials(String userId) {
        return credentials.values().stream()
                .filter(c -> c.getUserId().equals(userId))
                .toList();
    }

    /**
     * Generate recovery backup codes.
     */
    public List<BackupCode> generateBackupCodes(String userId, int count) {
        List<BackupCode> codes = new ArrayList<>();
        SecureRandom random = new SecureRandom();

        for (int i = 0; i < count; i++) {
            StringBuilder code = new StringBuilder();
            for (int j = 0; j < 4; j++) {
                if (j > 0) code.append("-");
                code.append(String.format("%04d", random.nextInt(10000)));
            }

            BackupCode backupCode = BackupCode.builder()
                    .codeId(UUID.randomUUID().toString())
                    .hashedCode(hashBackupCode(code.toString()))
                    .createdAt(ZonedDateTime.now())
                    .used(false)
                    .build();

            codes.add(backupCode);
        }

        backupCodes.put(userId, codes);
        log.info("Generated {} backup codes for user: {}", count, userId);
        return codes;
    }

    /**
     * Verify and consume a backup code.
     */
    public boolean verifyBackupCode(String userId, String code) {
        List<BackupCode> codes = backupCodes.get(userId);
        if (codes == null) return false;

        Optional<BackupCode> matched = codes.stream()
                .filter(bc -> !bc.isUsed())
                .filter(bc -> bc.getHashedCode().equals(hashBackupCode(code)))
                .findFirst();

        if (matched.isPresent()) {
            matched.get().setUsed(true);
            matched.get().setUsedAt(ZonedDateTime.now());
            log.info("Backup code used for user: {}", userId);
            return true;
        }

        return false;
    }

    private byte[] generateChallenge() {
        byte[] challenge = new byte[32];
        new SecureRandom().nextBytes(challenge);
        return challenge;
    }

    private List<String> getExistingCredentialIds(String userId) {
        return credentials.values().stream()
                .filter(c -> c.getUserId().equals(userId))
                .map(WebAuthnCredential::getCredentialId)
                .toList();
    }

    private String hashBackupCode(String code) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(code.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    // ================================================================
    // Data Models
    // ================================================================

    @Data
    @Builder
    public static class RegistrationChallenge {
        private String challenge;
        private String rpId;
        private String rpName;
        private String userId;
        private String userName;
        private String userDisplayName;
        private int timeout;
        private String attestationType;
        private List<String> excludeCredentials;
        private List<Integer> algorithms;
    }

    @Data
    @Builder
    public static class AuthChallenge {
        private String challenge;
        private String rpId;
        private String credentialId;
        private int timeout;
    }

    @Data
    @Builder
    public static class WebAuthnCredential {
        private String credentialId;
        private String userId;
        private String publicKey;
        private String attestationType;
        private long signatureCounter;
        private List<String> transports;
        private ZonedDateTime createdAt;
        private ZonedDateTime lastUsedAt;
    }

    @Data
    @Builder
    public static class BackupCode {
        private String codeId;
        private String hashedCode;
        private ZonedDateTime createdAt;
        private boolean used;
        private ZonedDateTime usedAt;
    }

    // Simple SHA-256 utility
    public static class Sha256 {
        public static byte[] hash(String input) {
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                return digest.digest(input.getBytes(StandardCharsets.UTF_8));
            } catch (NoSuchAlgorithmException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
