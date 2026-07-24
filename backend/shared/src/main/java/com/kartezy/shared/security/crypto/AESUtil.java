package com.kartezy.shared.security.crypto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * AES-256 GCM encryption utility for encrypting sensitive data at rest.
 * <p>
 * Uses AES-256 in GCM mode (Authenticated Encryption) for confidentiality + integrity.
 * Keys must be 256 bits (32 bytes) and should be stored in a secure secrets manager.
 * </p>
 */
public final class AESUtil {

    private static final Logger log = LoggerFactory.getLogger(AESUtil.class);

    private static final String ALGORITHM = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12;    // 96 bits
    private static final int GCM_TAG_LENGTH = 128;  // 128-bit authentication tag

    private AESUtil() {
        // Prevent instantiation
    }

    /**
     * Encrypts plaintext using AES-256 GCM.
     *
     * @param plaintext The plaintext to encrypt
     * @param key       The 256-bit (32-byte) AES key, Base64-encoded
     * @return Base64-encoded ciphertext with IV prepended: Base64(IV + ciphertext)
     * @throws EncryptionException if encryption fails
     */
    public static String encrypt(String plaintext, String key) {
        if (plaintext == null) {
            return null;
        }
        if (key == null || key.isEmpty()) {
            throw new EncryptionException("Encryption key must not be null or empty");
        }
        try {
            byte[] keyBytes = Base64.getDecoder().decode(key);
            if (keyBytes.length != 32) {
                throw new EncryptionException("AES key must be 32 bytes (256 bits), got " + keyBytes.length);
            }

            SecretKey secretKey = new SecretKeySpec(keyBytes, ALGORITHM);

            // Generate random IV
            byte[] iv = new byte[GCM_IV_LENGTH];
            SecureRandom secureRandom = new SecureRandom();
            secureRandom.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, gcmSpec);

            byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

            // Prepend IV to ciphertext: IV (12 bytes) + Ciphertext
            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + ciphertext.length);
            byteBuffer.put(iv);
            byteBuffer.put(ciphertext);

            return Base64.getEncoder().encodeToString(byteBuffer.array());
        } catch (Exception e) {
            log.error("AES encryption failed: {}", e.getMessage());
            throw new EncryptionException("Failed to encrypt data", e);
        }
    }

    /**
     * Decrypts ciphertext that was encrypted with {@link #encrypt(String, String)}.
     *
     * @param encryptedData Base64-encoded ciphertext with IV prepended
     * @param key           The 256-bit (32-byte) AES key, Base64-encoded
     * @return Decrypted plaintext
     * @throws EncryptionException if decryption fails
     */
    public static String decrypt(String encryptedData, String key) {
        if (encryptedData == null) {
            return null;
        }
        if (key == null || key.isEmpty()) {
            throw new EncryptionException("Decryption key must not be null or empty");
        }
        try {
            byte[] keyBytes = Base64.getDecoder().decode(key);
            if (keyBytes.length != 32) {
                throw new EncryptionException("AES key must be 32 bytes (256 bits), got " + keyBytes.length);
            }

            SecretKey secretKey = new SecretKeySpec(keyBytes, ALGORITHM);

            byte[] decoded = Base64.getDecoder().decode(encryptedData);

            // Extract IV (first 12 bytes) and ciphertext
            ByteBuffer byteBuffer = ByteBuffer.wrap(decoded);
            byte[] iv = new byte[GCM_IV_LENGTH];
            byteBuffer.get(iv);
            byte[] ciphertext = new byte[byteBuffer.remaining()];
            byteBuffer.get(ciphertext);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmSpec);

            byte[] plaintext = cipher.doFinal(ciphertext);
            return new String(plaintext, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.error("AES decryption failed: {}", e.getMessage());
            throw new EncryptionException("Failed to decrypt data", e);
        }
    }

    /**
     * Generates a new random 256-bit AES key, Base64-encoded.
     */
    public static String generateKey() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] key = new byte[32];
        secureRandom.nextBytes(key);
        return Base64.getEncoder().encodeToString(key);
    }

    /**
     * Exception thrown for encryption/decryption failures.
     */
    public static class EncryptionException extends RuntimeException {
        public EncryptionException(String message) {
            super(message);
        }

        public EncryptionException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
