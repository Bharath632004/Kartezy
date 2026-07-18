package com.kartezy.shared.security.encryption;

/**
 * Field-level encryption utilities for protecting sensitive data
 * at the application layer. Supports PII, financial data, and
 * other sensitive fields.
 */
public final class FieldLevelEncryption {

    private static final String MASK_CHAR = "*";
    private static final int VISIBLE_PREFIX = 4;
    private static final int VISIBLE_SUFFIX = 4;

    private FieldLevelEncryption() {}

    /**
     * Mask sensitive data, showing only first and last 4 chars.
     */
    public static String mask(String data) {
        if (data == null) return null;
        if (data.length() <= VISIBLE_PREFIX + VISIBLE_SUFFIX) {
            return data.substring(0, Math.min(1, data.length())) +
                    MASK_CHAR.repeat(Math.max(0, data.length() - 2)) +
                    data.substring(Math.max(1, data.length() - 1));
        }
        return data.substring(0, VISIBLE_PREFIX) +
                MASK_CHAR.repeat(data.length() - VISIBLE_PREFIX - VISIBLE_SUFFIX) +
                data.substring(data.length() - VISIBLE_SUFFIX);
    }

    /**
     * Mask email address.
     */
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) return mask(email);
        String[] parts = email.split("@");
        String localPart = parts[0];
        String domain = parts[1];

        String maskedLocal = localPart.length() <= 2
                ? localPart.substring(0, 1) + MASK_CHAR
                : localPart.substring(0, 2) + MASK_CHAR.repeat(localPart.length() - 2);
        return maskedLocal + "@" + domain;
    }

    /**
     * Mask phone number.
     */
    public static String maskPhone(String phone) {
        if (phone == null) return null;
        if (phone.length() <= 6) return mask(phone);
        return phone.substring(0, 3) + "******" +
                phone.substring(phone.length() - 2);
    }

    /**
     * Mask Aadhaar number (Indian ID).
     */
    public static String maskAadhaar(String aadhaar) {
        if (aadhaar == null) return null;
        String clean = aadhaar.replaceAll("[\\s-]", "");
        if (clean.length() != 12) return mask(aadhaar);
        return "XXXX XXXX " + clean.substring(8);
    }

    /**
     * Mask PAN card (Indian tax ID).
     */
    public static String maskPAN(String pan) {
        if (pan == null) return null;
        if (pan.length() != 10) return mask(pan);
        return pan.substring(0, 5) + "XXXX" + pan.substring(9);
    }

    /**
     * Mask bank account number.
     */
    public static String maskAccountNumber(String accountNumber) {
        if (accountNumber == null) return null;
        if (accountNumber.length() <= 4) return MASK_CHAR.repeat(accountNumber.length());
        return "XXXXXX" + accountNumber.substring(accountNumber.length() - 4);
    }

    /**
     * Mask credit/debit card number (PCI DSS).
     */
    public static String maskCardNumber(String cardNumber) {
        if (cardNumber == null) return null;
        String clean = cardNumber.replaceAll("[\\s-]", "");
        if (clean.length() < 13) return mask(cardNumber);
        return clean.substring(0, 6) + "******" + clean.substring(clean.length() - 4);
    }

    /**
     * Truncate data to a maximum length (for data minimization).
     */
    public static String truncate(String data, int maxLength) {
        if (data == null) return null;
        if (data.length() <= maxLength) return data;
        return data.substring(0, maxLength);
    }

    /**
     * Anonymize data by replacing with a hash (for analytics).
     */
    public static String anonymize(String data) {
        if (data == null) return null;
        return Integer.toHexString(data.hashCode());
    }

    /**
     * Classify data sensitivity level.
     */
    public enum SensitivityLevel {
        PUBLIC,          // No sensitivity
        INTERNAL,        // Internal business data
        CONFIDENTIAL,    // Business sensitive
        PERSONAL,        // PII/Personal data
        RESTRICTED       // Highly sensitive (financial, health)
    }

    /**
     * Get the appropriate masking strategy for a data type.
     */
    public static String maskByType(String data, DataType type) {
        return switch (type) {
            case EMAIL -> maskEmail(data);
            case PHONE -> maskPhone(data);
            case AADHAAR -> maskAadhaar(data);
            case PAN -> maskPAN(data);
            case ACCOUNT_NUMBER -> maskAccountNumber(data);
            case CARD_NUMBER -> maskCardNumber(data);
            case ADDRESS, NAME, GENERAL -> mask(data);
        };
    }

    public enum DataType {
        EMAIL, PHONE, AADHAAR, PAN, ACCOUNT_NUMBER,
        CARD_NUMBER, ADDRESS, NAME, GENERAL
    }
}
