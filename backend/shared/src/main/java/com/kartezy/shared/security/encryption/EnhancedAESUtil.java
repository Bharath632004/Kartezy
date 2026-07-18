package com.kartezy.shared.security.encryption;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Enhanced AES encryption utility with support for GCM mode and key management integration.
 */
public class EnhancedAESUtil {

    private static final String AES_ALGORITHM = "AES";
    private static final String AES_GCM_ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH_BITS = 128;
    private static final int GCM_IV_LENGTH_BYTES = 12;
    private static final String KEY_ALGORITHM = "AES";

    /**
     * Generates a new AES key.
     *
     * @param keySize the size of the key in bits (128, 192, or 256)
     * @return        the generated AES key
     * @throws Exception if key generation fails
     */
    public static SecretKey generateAesKey(int keySize) throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance(KEY_ALGORITHM);
        keyGen.init(keySize);
        return keyGen.generateKey();
    }

    /**
     * Encrypts data using AES in GCM mode.
     *
     * @param plaintext the data to encrypt
     * @param key       the AES key to use for encryption
     * @return          the encrypted data as a Base64-encoded string, with IV prepended
     * @throws Exception if encryption fails
     */
    public static String encrypt(String plaintext, SecretKey key) throws Exception {
        byte[] plaintextBytes = plaintext.getBytes("UTF-8");

        // Generate a random IV
        byte[] iv = new byte[GCM_IV_LENGTH_BYTES];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(iv);

        // Initialize cipher for encryption
        Cipher cipher = Cipher.getInstance(AES_GCM_ALGORITHM);
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);

        // Perform encryption
        byte[] ciphertext = cipher.doFinal(plaintextBytes);

        // Combine IV and ciphertext for storage/transmission
        byte[] combined = new byte[iv.length + ciphertext.length];
        System.arraycopy(iv, 0, combined, 0, iv.length);
        System.arraycopy(ciphertext, 0, combined, iv.length, ciphertext.length);

        return Base64.getEncoder().encodeToString(combined);
    }

    /**
     * Decrypts data that was encrypted using AES in GCM mode.
     *
     * @param encryptedData the encrypted data as a Base64-encoded string (with IV prepended)
     * @param key           the AES key to use for decryption
     * @return              the decrypted string
     * @throws Exception    if decryption fails
     */
    public static String decrypt(String encryptedData, SecretKey key) throws Exception {
        // Decode the Base64-encoded data
        byte[] combined = Base64.getDecoder().decode(encryptedData);

        // Extract IV and ciphertext
        byte[] iv = new byte[GCM_IV_LENGTH_BYTES];
        byte[] ciphertext = new byte[combined.length - iv.length];
        System.arraycopy(combined, 0, iv, 0, iv.length);
        System.arraycopy(combined, iv.length, ciphertext, 0, ciphertext.length);

        // Initialize cipher for decryption
        Cipher cipher = Cipher.getInstance(AES_GCM_ALGORITHM);
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv);
        cipher.init(Cipher.DECRYPT_MODE, key, spec);

        // Perform decryption
        byte[] plaintextBytes = cipher.doFinal(ciphertext);
        return new String(plaintextBytes, "UTF-8");
    }

    /**
     * Encrypts data using AES in GCM mode with a separately provided IV.
     * This is useful when the IV needs to be stored or transmitted separately.
     *
     * @param plaintext the data to encrypt
     * @param key       the AES key to use for encryption
     * @param iv        the initialization vector to use
     * @return          the encrypted data as a Base64-encoded string
     * @throws Exception if encryption fails
     */
    public static String encryptWithIv(String plaintext, SecretKey key, byte[] iv) throws Exception {
        byte[] plaintextBytes = plaintext.getBytes("UTF-8");

        // Validate IV length
        if (iv.length != GCM_IV_LENGTH_BYTES) {
            throw new IllegalArgumentException("IV must be exactly " + GCM_IV_LENGTH_BYTES + " bytes");
        }

        // Initialize cipher for encryption
        Cipher cipher = Cipher.getInstance(AES_GCM_ALGORITHM);
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);

        // Perform encryption
        byte[] ciphertext = cipher.doFinal(plaintextBytes);

        return Base64.getEncoder().encodeToString(ciphertext);
    }

    /**
     * Decrypts data using AES in GCM mode with a separately provided IV.
     *
     * @param ciphertext the encrypted data as a Base64-encoded string
     * @param key        the AES key to use for decryption
     * @param iv         the initialization vector to use
     * @return           the decrypted string
     * @throws Exception if decryption fails
     */
    public static String decryptWithIv(String ciphertext, SecretKey key, byte[] iv) throws Exception {
        // Validate IV length
        if (iv.length != GCM_IV_LENGTH_BYTES) {
            throw new IllegalArgumentException("IV must be exactly " + GCM_IV_LENGTH_BYTES + " bytes");
        }

        // Decode the Base64-encoded data
        byte[] ciphertextBytes = Base64.getDecoder().decode(ciphertext);

        // Initialize cipher for decryption
        Cipher cipher = Cipher.getInstance(AES_GCM_ALGORITHM);
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv);
        cipher.init(Cipher.DECRYPT_MODE, key, spec);

        // Perform decryption
        byte[] plaintextBytes = cipher.doFinal(ciphertextBytes);
        return new String(plaintextBytes, "UTF-8");
    }
}