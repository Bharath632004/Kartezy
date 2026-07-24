package com.kartezy.shared.security.crypto;

import java.security.SecureRandom;
import java.util.Base64;

/**
 * Utility for generating cryptographically secure secrets, API keys, and tokens.
 * <p>
 * Uses SecureRandom for all generation to ensure cryptographic strength.
 * </p>
 */
public final class SecretUtils {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private static final String ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final String ALPHANUMERIC_SPECIAL = ALPHANUMERIC + "!@#$%^&*()_+-=[]{}|;:',.<>?/~`";

    private SecretUtils() {
        // Prevent instantiation
    }

    /**
     * Generates a cryptographically random API key (Base64, 32 bytes).
     */
    public static String generateApiKey() {
        byte[] key = new byte[32];
        SECURE_RANDOM.nextBytes(key);
        return "kzy_" + Base64.getUrlEncoder().withoutPadding().encodeToString(key);
    }

    /**
     * Generates a cryptographically random secret (Base64, 64 bytes).
     */
    public static String generateSecret() {
        byte[] secret = new byte[64];
        SECURE_RANDOM.nextBytes(secret);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(secret);
    }

    /**
     * Generates a random alphanumeric string of the specified length.
     * Useful for temporary codes, OAuth state parameters, nonces.
     */
    public static String generateAlphanumeric(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHANUMERIC.charAt(SECURE_RANDOM.nextInt(ALPHANUMERIC.length())));
        }
        return sb.toString();
    }

    /**
     * Generates a random string with special characters.
     * Useful for temporary passwords.
     */
    public static String generateStrongPassword(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHANUMERIC_SPECIAL.charAt(SECURE_RANDOM.nextInt(ALPHANUMERIC_SPECIAL.length())));
        }
        return sb.toString();
    }

    /**
     * Generates a cryptographically secure OTP of specified length.
     * Uses only digits 0-9.
     */
    public static String generateOtp(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(SECURE_RANDOM.nextInt(10));
        }
        return sb.toString();
    }

    /**
     * Generates a UUID v4 string.
     */
    public static String generateUuid() {
        return java.util.UUID.randomUUID().toString();
    }

    /**
     * Generates a secure random session ID.
     */
    public static String generateSessionId() {
        byte[] sessionId = new byte[32];
        SECURE_RANDOM.nextBytes(sessionId);
        return "sess_" + Base64.getUrlEncoder().withoutPadding().encodeToString(sessionId);
    }

    /**
     * Generates a secure random nonce for OAuth/OIDC flows.
     */
    public static String generateNonce() {
        byte[] nonce = new byte[16];
        SECURE_RANDOM.nextBytes(nonce);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(nonce);
    }

    /**
     * Generates a secure random state parameter for OAuth2 flows.
     */
    public static String generateOAuthState() {
        byte[] state = new byte[32];
        SECURE_RANDOM.nextBytes(state);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(state);
    }
}
