package com.kartezy.shared.security.encryption;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Utility class for AES encryption and decryption using GCM mode.
 * This utility provides methods to encrypt and decrypt data using a 256-bit AES key.
 * <p>
 * For production use, keys should be managed via a secure key management service (e.g., AWS KMS, HashiCorp Vault).
 * </p>
 */
public final class AESUtil {

    private static final String AES_ALGORITHM = "AES";
    private static final String AES_TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int KEY_SIZE = 256;
    private static final int GCM_TAG_LENGTH = 128;
    private static final int GCM_IV_LENGTH = 12;

    private AESUtil() {
        // Prevent instantiation
    }

    /**
     * Generates a random 256-bit AES key.
     *
     * @return a Base64-encoded AES key
     * @throws NoSuchAlgorithmException if the AES algorithm is not available
     */
    public static String generateKey() throws NoSuchAlgorithmException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(AES_ALGORITHM);
        keyGenerator.init(KEY_SIZE, new SecureRandom());
        SecretKey secretKey = keyGenerator.generateKey();
        return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    }

    /**
     * Encrypts the given plaintext using the provided AES key.
     *
     * @param plaintext the data to encrypt
     * @param keyBase64 the Base64-encoded AES key (256-bit)
     * @return the Base64-encoded encrypted data (includes IV and ciphertext)
     * @throws Exception if encryption fails
     */
    public static String encrypt(String plaintext, String keyBase64) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(keyBase64);
        SecretKey secretKey = new javax.crypto.spec.SecretKeySpec(keyBytes, AES_ALGORITHM);

        Cipher cipher = Cipher.getInstance(AES_TRANSFORMATION);
        byte[] iv = new byte[GCM_IV_LENGTH];
        new SecureRandom().nextBytes(iv);
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);

        byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

        // Combine IV and ciphertext for storage/transmission
        ByteBuffer buffer = ByteBuffer.allocate(iv.length + ciphertext.length);
        buffer.put(iv);
        buffer.put(ciphertext);
        return Base64.getEncoder().encodeToString(buffer.array());
    }

    /**
     * Decrypts the given encrypted data using the provided AES key.
     *
     * @param encryptedDataBase64 the Base64-encoded encrypted data (includes IV and ciphertext)
     * @param keyBase64 the Base64-encoded AES key (256-bit)
     * @return the decrypted plaintext
     * @throws Exception if decryption fails
     */
    public static String decrypt(String encryptedDataBase64, String keyBase64) throws Exception {
        byte[] combined = Base64.getDecoder().decode(encryptedDataBase64);
        byte[] iv = new byte[GCM_IV_LENGTH];
        byte[] ciphertext = new byte[combined.length - GCM_IV_LENGTH];

        System.arraycopy(combined, 0, iv, 0, GCM_IV_LENGTH);
        System.arraycopy(combined, GCM_IV_LENGTH, ciphertext, 0, ciphertext.length);

        byte[] keyBytes = Base64.getDecoder().decode(keyBase64);
        SecretKey secretKey = new javax.crypto.spec.SecretKeySpec(keyBytes, AES_ALGORITHM);

        Cipher cipher = Cipher.getInstance(AES_TRANSFORMATION);
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);

        byte[] plaintextBytes = cipher.doFinal(ciphertext);
        return new String(plaintextBytes, StandardCharsets.UTF_8);
    }
}