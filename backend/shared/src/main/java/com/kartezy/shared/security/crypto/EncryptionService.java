package com.kartezy.shared.security.crypto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

/**
 * Service for encrypting and decrypting sensitive data fields.
 * <p>
 * Handles automatic encryption/decryption of:
 * - Bank account details
 * - Payment tokens
 * - Wallet information
 * - Personal Identifiable Information (PII)
 * - Refresh tokens at rest
 * </p>
 */
@Service
public class EncryptionService {

    private static final Logger log = LoggerFactory.getLogger(EncryptionService.class);

    private final String masterEncryptionKey;

    public EncryptionService(@Value("${kartezy.security.encryption.key}") String masterEncryptionKey) {
        this.masterEncryptionKey = masterEncryptionKey;
    }

    @PostConstruct
    public void init() {
        if (masterEncryptionKey == null || masterEncryptionKey.isEmpty() ||
            masterEncryptionKey.contains("${kartezy")) {
            throw new IllegalStateException(
                    "Master encryption key (kartezy.security.encryption.key) is not configured! " +
                    "Generate a key with: AESUtil.generateKey() and set it as an environment variable.");
        }
        log.info("EncryptionService initialized with master key");
    }

    /**
     * Encrypts sensitive data.
     */
    public String encrypt(String plaintext) {
        return AESUtil.encrypt(plaintext, masterEncryptionKey);
    }

    /**
     * Decrypts sensitive data.
     */
    public String decrypt(String ciphertext) {
        return AESUtil.decrypt(ciphertext, masterEncryptionKey);
    }

    /**
     * Encrypts a bank account number for secure storage.
     */
    public String encryptBankAccount(String accountNumber) {
        return encrypt(accountNumber);
    }

    /**
     * Decrypts a bank account number.
     */
    public String decryptBankAccount(String encryptedAccount) {
        return decrypt(encryptedAccount);
    }

    /**
     * Encrypts a payment token or card details.
     */
    public String encryptPaymentToken(String token) {
        return encrypt(token);
    }

    /**
     * Decrypts a payment token.
     */
    public String decryptPaymentToken(String encryptedToken) {
        return decrypt(encryptedToken);
    }

    /**
     * Encrypts a refresh token before storing in database.
     */
    public String encryptToken(String token) {
        return encrypt(token);
    }

    /**
     * Decrypts a refresh token retrieved from database.
     */
    public String decryptToken(String encryptedToken) {
        return decrypt(encryptedToken);
    }

    /**
     * Masks sensitive data for logging, showing only last 4 characters.
     */
    public static String mask(String data) {
        if (data == null || data.length() < 4) {
            return "****";
        }
        int maskLength = data.length() - 4;
        return "*".repeat(Math.max(0, maskLength)) + data.substring(data.length() - 4);
    }

    /**
     * Masks an email address for display.
     */
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) {
            return "***@***";
        }
        String[] parts = email.split("@");
        String local = parts[0];
        String domain = parts[1];
        String maskedLocal = local.length() > 2
                ? local.charAt(0) + "*".repeat(local.length() - 2) + local.charAt(local.length() - 1)
                : "***";
        return maskedLocal + "@" + domain;
    }

    /**
     * Masks a phone number for display.
     */
    public static String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) {
            return "****";
        }
        return phone.substring(0, 2) + "******" + phone.substring(phone.length() - 2);
    }
}
