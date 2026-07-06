package com.kartezy.shared.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Security utility class for common security operations.
 * This class will be expanded in later phases with more security utilities.
 */
public final class SecurityUtils {

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
}