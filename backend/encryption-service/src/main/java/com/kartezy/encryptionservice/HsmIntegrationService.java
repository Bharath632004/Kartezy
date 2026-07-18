package com.kartezy.encryptionservice;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Optional;

/**
 * Service for integrating with Hardware Security Modules (HSMs) for secure key storage and operations.
 * Provides an abstraction layer that allows the application to use either software-based keys
 * or HSM-based keys depending on configuration.
 */
@Service
public class HsmIntegrationService {

    private boolean hsmEnabled;
    private String hsmProvider;
    private String hsmPin;
    private String hsmSlot;

    public HsmIntegrationService() {
        // In a real implementation, these would be read from configuration
        this.hsmEnabled = false; // Default to software-based keys for development
        this.hsmProvider = "SunPKCS11";
        this.hsmPin = "";
        this.hsmSlot = "0";
    }

    /**
     * Generates or retrieves a key from the HSM, or falls back to software-based key generation.
     *
     * @param algorithm the algorithm for the key (e.g., "AES")
     * @param keySize   the size of the key in bits
     * @param alias     an alias for the key
     * @return          the generated or retrieved key
     */
    public Optional<SecretKey> getOrCreateKey(String algorithm, int keySize, String alias) {
        if (hsmEnabled && isHsmAvailable()) {
            return getKeyFromHsm(algorithm, keySize, alias);
        } else {
            // Fall back to software-based key generation
            return generateSoftwareKey(algorithm, keySize, alias);
        }
    }

    /**
     * Performs a cryptographic operation (encryption/decryption) using the HSM.
     *
     * @param key       the key to use for the operation
     * @param algorithm the algorithm to use (e.g., "AES/GCM/NoPadding")
     * @param input     the input data
     * @param operation the operation to perform ("encrypt" or "decrypt")
     * @return          the result of the operation
     */
    public Optional<byte[]> performCryptoOperation(Key key, String algorithm,
                                                   byte[] input, String operation) {
        if (hsmEnabled && isHsmAvailable()) {
            return performHsmCryptoOperation(key, algorithm, input, operation);
        } else {
            return performSoftwareCryptoOperation(key, algorithm, input, operation);
        }
    }

    /**
     * Checks if the HSM is available and accessible.
     *
     * @return true if HSM is available, false otherwise
     */
    private boolean isHsmAvailable() {
        // In a real implementation, this would check actual HSM connectivity
        // For now, we'll simulate based on the enabled flag
        return hsmEnabled;
    }

    /**
     * Retrieves a key from the HSM.
     *
     * @param algorithm the algorithm for the key
     * @param keySize   the size of the key in bits
     * @param alias     an alias for the key
     * @return          the key from the HSM, or empty if not found
     */
    private Optional<SecretKey> getKeyFromHsm(String algorithm, int keySize, String alias) {
        try {
            // Attempt PKCS#11 provider initialization
            java.security.Provider provider = java.security.Security.getProvider(hsmProvider);
            if (provider == null) {
                // Try loading SunPKCS11 provider
                provider = new sun.security.pkcs11.SunPKCS11(new java.io.ByteArrayInputStream(
                    ("name=" + hsmProvider + "\\nlibrary=/usr/local/lib/softhsm/libsofthsm2.so").getBytes()
                ));
                java.security.Security.addProvider(provider);
            }

            javax.crypto.KeyGenerator keyGen = javax.crypto.KeyGenerator.getInstance(algorithm, provider);
            keyGen.init(keySize, new java.security.SecureRandom());
            SecretKey key = keyGen.generateKey();
            System.out.println("Successfully retrieved/generated key from HSM: " + alias);
            return Optional.of(key);
        } catch (Exception e) {
            System.err.println("Failed to retrieve key from HSM: " + e.getMessage());
            // Fall back to software-based key generation
            return generateSoftwareKey(algorithm, keySize, alias);
        }
    }

    /**
     * Generates a software-based key.
     *
     * @param algorithm the algorithm for the key (e.g., "AES")
     * @param keySize   the size of the key in bits
     * @param alias     an alias for the key
     * @return          the generated key
     */
    private Optional<SecretKey> generateSoftwareKey(String algorithm, int keySize, String alias) {
        try {
            javax.crypto.KeyGenerator keyGen = javax.crypto.KeyGenerator.getInstance(algorithm);
            keyGen.init(keySize);
            SecretKey key = keyGen.generateKey();
            System.out.println("Generated software key: " + alias);
            return Optional.of(key);
        } catch (Exception e) {
            System.err.println("Failed to generate software key: " + e.getMessage());
            return empty();
        }
    }

    /**
     * Performs a cryptographic operation using the HSM.
     *
     * @param key       the key to use for the operation
     * @param algorithm the algorithm to use
     * @param input     the input data
     * @param operation the operation to perform
     * @return          the result of the operation
     */
    private Optional<byte[]> performHsmCryptoOperation(Key key, String algorithm,
                                                       byte[] input, String operation) {
        try {
            javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance(algorithm, hsmProvider);
            if ("encrypt".equalsIgnoreCase(operation)) {
                cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, key);
            } else if ("decrypt".equalsIgnoreCase(operation)) {
                cipher.init(javax.crypto.Cipher.DECRYPT_MODE, key);
            } else {
                throw new IllegalArgumentException("Invalid operation: " + operation);
            }
            byte[] result = cipher.doFinal(input);
            System.out.println("HSM crypto operation completed: " + operation);
            return Optional.of(result);
        } catch (Exception e) {
            System.err.println("Failed HSM crypto operation, falling back to software: " + e.getMessage());
            return performSoftwareCryptoOperation(key, algorithm, input, operation);
        }
    }

    /**
     * Performs a cryptographic operation using software-based cryptography.
     *
     * @param key       the key to use for the operation
     * @param algorithm the algorithm to use
     * @param input     the input data
     * @param operation the operation to perform
     * @return          the result of the operation
     */
    private Optional<byte[]> performSoftwareCryptoOperation(Key key, String algorithm,
                                                            byte[] input, String operation) {
        try {
            javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance(algorithm);

            if ("encrypt".equalsIgnoreCase(operation)) {
                cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, key);
            } else if ("decrypt".equalsIgnoreCase(operation)) {
                cipher.init(javax.crypto.Cipher.DECRYPT_MODE, key);
            } else {
                throw new IllegalArgumentException("Invalid operation: " + operation);
            }

            byte[] result = cipher.doFinal(input);
            return Optional.of(result);
        } catch (Exception e) {
            System.err.println("Failed to perform crypto operation: " + e.getMessage());
            return empty();
        }
    }

    // Helper method to create an empty Optional
    private static <T> Optional<T> empty() {
        return Optional.empty();
    }

    // Getters and setters for configuration
    public boolean isHsmEnabled() {
        return hsmEnabled;
    }

    public void setHsmEnabled(boolean hsmEnabled) {
        this.hsmEnabled = hsmEnabled;
    }

    public String getHsmProvider() {
        return hsmProvider;
    }

    public void setHsmProvider(String hsmProvider) {
        this.hsmProvider = hsmProvider;
    }

    public String getHsmPin() {
        return hsmPin;
    }

    public void setHsmPin(String hsmPin) {
        this.hsmPin = hsmPin;
    }

    public String getHsmSlot() {
        return hsmSlot;
    }

    public void setHsmSlot(String hsmSlot) {
        this.hsmSlot = hsmSlot;
    }
}