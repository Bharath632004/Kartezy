package com.kartezy.shared.security.crypto;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Enterprise password policy validator.
 * <p>
 * Enforces:
 * - Minimum length (default 12, configurable)
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 * - No common/weak passwords (check against a blocklist)
 * - No sequential or repeated characters
 * - No common keyboard patterns
 * </p>
 */
public final class PasswordPolicyValidator {

    private static final int DEFAULT_MIN_LENGTH = 12;
    private static final int DEFAULT_MAX_LENGTH = 128;

    private static final String UPPERCASE_PATTERN = ".*[A-Z].*";
    private static final String LOWERCASE_PATTERN = ".*[a-z].*";
    private static final String DIGIT_PATTERN = ".*\\d.*";
    private static final String SPECIAL_CHAR_PATTERN = ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?~`].*";

    /**
     * Set of commonly used weak passwords that should be rejected.
     * In production, load from an external file or service.
     */
    private static final Set<String> COMMON_PASSWORDS = Set.of(
            "password", "password123", "123456", "12345678", "123456789",
            "qwerty", "qwerty123", "admin", "admin123", "letmein",
            "welcome", "monkey", "dragon", "master", "sunshine",
            "princess", "football", "baseball", "iloveyou", "trustno1",
            "abc123", "passw0rd", "Pa$$w0rd", "changeme", "default"
    );

    private PasswordPolicyValidator() {
        // Prevent instantiation
    }

    /**
     * Validates a password against enterprise security policy.
     *
     * @param password The password to validate
     * @return A ValidationResult containing success/failure and error messages
     */
    public static ValidationResult validate(String password) {
        return validate(password, DEFAULT_MIN_LENGTH, DEFAULT_MAX_LENGTH);
    }

    /**
     * Validates a password with custom minimum length.
     *
     * @param password    The password to validate
     * @param minLength   Minimum password length
     * @param maxLength   Maximum password length
     * @return A ValidationResult containing success/failure and error messages
     */
    public static ValidationResult validate(String password, int minLength, int maxLength) {
        List<String> errors = new ArrayList<>();

        if (password == null || password.isEmpty()) {
            errors.add("Password must not be empty");
            return new ValidationResult(false, errors);
        }

        // Length checks
        if (password.length() < minLength) {
            errors.add("Password must be at least " + minLength + " characters long");
        }
        if (password.length() > maxLength) {
            errors.add("Password must not exceed " + maxLength + " characters");
        }

        // Complexity checks
        if (!password.matches(UPPERCASE_PATTERN)) {
            errors.add("Password must contain at least one uppercase letter");
        }
        if (!password.matches(LOWERCASE_PATTERN)) {
            errors.add("Password must contain at least one lowercase letter");
        }
        if (!password.matches(DIGIT_PATTERN)) {
            errors.add("Password must contain at least one digit");
        }
        if (!password.matches(SPECIAL_CHAR_PATTERN)) {
            errors.add("Password must contain at least one special character");
        }

        // Common password check
        String lowerPassword = password.toLowerCase();
        for (String common : COMMON_PASSWORDS) {
            if (lowerPassword.contains(common)) {
                errors.add("Password contains a common or weak password pattern");
                break;
            }
        }

        // Sequential character check
        if (hasSequentialChars(password)) {
            errors.add("Password must not contain sequential characters (e.g., '123', 'abc')");
        }

        // Repeated character check
        if (hasRepeatedChars(password)) {
            errors.add("Password must not contain repeated characters (e.g., 'aaa', '111')");
        }

        // Keyboard pattern check
        if (hasKeyboardPattern(password)) {
            errors.add("Password must not contain keyboard patterns (e.g., 'qwerty', 'asdf')");
        }

        return new ValidationResult(errors.isEmpty(), errors);
    }

    /**
     * Checks if password contains 3+ sequential characters (e.g., "abc", "123", "cba").
     */
    private static boolean hasSequentialChars(String password) {
        String lower = password.toLowerCase();
        for (int i = 0; i < lower.length() - 2; i++) {
            char c1 = lower.charAt(i);
            char c2 = lower.charAt(i + 1);
            char c3 = lower.charAt(i + 2);

            if (Character.isLetter(c1) && Character.isLetter(c2) && Character.isLetter(c3)) {
                // Forward sequence: abc, bcd, ..., xyz
                if (c2 == c1 + 1 && c3 == c2 + 1) return true;
                // Reverse sequence: cba, zyx
                if (c2 == c1 - 1 && c3 == c2 - 1) return true;
            }

            if (Character.isDigit(c1) && Character.isDigit(c2) && Character.isDigit(c3)) {
                // Forward sequence: 123, 234, ...
                if (c2 == c1 + 1 && c3 == c2 + 1) return true;
                // Reverse sequence: 321, 987
                if (c2 == c1 - 1 && c3 == c2 - 1) return true;
            }
        }
        return false;
    }

    /**
     * Checks if password contains 3+ identical characters in a row.
     */
    private static boolean hasRepeatedChars(String password) {
        for (int i = 0; i < password.length() - 2; i++) {
            if (password.charAt(i) == password.charAt(i + 1) &&
                password.charAt(i) == password.charAt(i + 2)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if password contains keyboard row patterns.
     */
    private static boolean hasKeyboardPattern(String password) {
        String lower = password.toLowerCase();
        String[] rows = {"qwertyuiop", "asdfghjkl", "zxcvbnm", "!@#$%^&*()"};

        for (String row : rows) {
            for (int i = 0; i < lower.length() - 2; i++) {
                String sub = lower.substring(i, i + 3);
                if (row.contains(sub)) return true;
                // Check reverse
                String rev = new StringBuilder(sub).reverse().toString();
                if (row.contains(rev)) return true;
            }
        }
        return false;
    }

    /**
     * Result of a password validation check.
     */
    public static class ValidationResult {
        private final boolean valid;
        private final List<String> errors;

        public ValidationResult(boolean valid, List<String> errors) {
            this.valid = valid;
            this.errors = java.util.Collections.unmodifiableList(errors);
        }

        public boolean isValid() {
            return valid;
        }

        public List<String> getErrors() {
            return errors;
        }

        public String getErrorMessage() {
            return String.join("; ", errors);
        }
    }
}
