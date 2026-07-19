package com.kartezy.shared.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Base64;

/**
 * Security utility class for common security operations including JWT token handling.
 */
public final class SecurityUtils {
    private static final Logger log = LoggerFactory.getLogger(SecurityUtils.class);
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private SecurityUtils() {
        // Prevent instantiation
    }

    /**
     * Encodes a password using BCrypt.
     *
     * @param rawPassword the raw password to encode
     * @return the encoded password
     */
    public static String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * Checks if a raw password matches an encoded password.
     *
     * @param rawPassword     the raw password to check
     * @param encodedPassword the encoded password to check against
     * @return true if the password matches, false otherwise
     */
    public static boolean matches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    /**
     * Extracts the user ID from a JWT token or Bearer authorization header.
     * Handles both raw tokens and "Bearer <token>" formatted headers.
     *
     * @param authHeaderOrToken the Authorization header ("Bearer <token>") or raw JWT token
     * @return the extracted user ID, or null if extraction fails
     */
    public static String extractUserIdFromToken(String authHeaderOrToken) {
        if (authHeaderOrToken == null || authHeaderOrToken.isEmpty()) {
            return null;
        }

        String token = authHeaderOrToken;
        // Strip "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (token.isEmpty()) {
            return null;
        }

        try {
            // Decode JWT payload (second part of the token)
            String[] parts = token.split("\\.");
            if (parts.length < 2) {
                return null;
            }

            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            String payload = new String(decoded);

            // Parse JSON to extract subject (sub) claim
            // Simple JSON parsing without external dependencies
            String subKey = "\"sub\"";
            int subIndex = payload.indexOf(subKey);
            if (subIndex >= 0) {
                int valueStart = payload.indexOf('"', subIndex + subKey.length()) + 1;
                int valueEnd = payload.indexOf('"', valueStart);
                if (valueStart > 0 && valueEnd > valueStart) {
                    return payload.substring(valueStart, valueEnd);
                }
            }
        } catch (Exception e) {
            // Log and return null on any parsing error
            log.warn("Failed to extract user ID from token: {}", e.getMessage());
        }

        return null;
    }
}