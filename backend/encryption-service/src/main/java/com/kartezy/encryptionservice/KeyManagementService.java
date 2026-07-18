package com.kartezy.encryptionservice;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for managing encryption keys, including generation, storage, and retrieval.
 */
@Service
public class KeyManagementService {

    // In a real implementation, this would be backed by a secure key store or HSM
    private final Map<String, KeyEntry> keyStore = new HashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generates and stores a new encryption key with the specified alias.
     *
     * @param alias   the alias to associate with the key
     * @param keySize the key size in bits
     * @return        the generated key ID
     */
    public String generateKey(String alias, int keySize) {
        String keyId = generateKeyId();
        // In a real implementation, we would generate and store the actual key material
        // For this example, we're simulating key storage

        KeyEntry keyEntry = new KeyEntry(
                keyId,
                alias,
                generateRandomKeyBytes(keySize / 8), // Convert bits to bytes
                new Date(),
                keySize
        );

        keyStore.put(keyId, keyEntry);
        return keyId;
    }

    /**
     * Retrieves an encryption key by its ID.
     *
     * @param keyId the ID of the key to retrieve
     * @return      the key bytes, or null if not found
     */
    public byte[] getKey(String keyId) {
        KeyEntry keyEntry = keyStore.get(keyId);
        return keyEntry != null ? keyEntry.getKeyBytes() : null;
    }

    /**
     * Retrieves an encryption key by its alias.
     * Returns the most recent version if multiple versions exist.
     *
     * @param alias the alias of the key to retrieve
     * @return      the key bytes, or null if not found
     */
    public byte[] getKeyByAlias(String alias) {
        // In a real implementation with versioning, we would return the latest version
        return keyStore.values().stream()
                .filter(entry -> alias.equals(entry.getAlias()))
                .findFirst()
                .map(KeyEntry::getKeyBytes)
                .orElse(null);
    }

    /**
     * Generates a unique key ID.
     *
     * @return a unique key ID string
     */
    private String generateKeyId() {
        byte[] randomBytes = new byte[16];
        secureRandom.nextBytes(randomBytes);
        return "key_" + Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    /**
     * Generates random key bytes of the specified length.
     *
     * @param length the length of the key bytes to generate
     * @return       the generated key bytes
     */
    private byte[] generateRandomKeyBytes(int length) {
        byte[] keyBytes = new byte[length];
        secureRandom.nextBytes(keyBytes);
        return keyBytes;
    }

    /**
     * Internal class representing a key entry in the key store.
     */
    private static class KeyEntry {
        private final String keyId;
        private final String alias;
        private final byte[] keyBytes;
        private final Date creationDate;
        private final int keySize;

        public KeyEntry(String keyId, String alias, byte[] keyBytes, Date creationDate, int keySize) {
            this.keyId = keyId;
            this.alias = alias;
            this.keyBytes = keyBytes;
            this.creationDate = creationDate;
            this.keySize = keySize;
        }

        public String getKeyId() {
            return keyId;
        }

        public String getAlias() {
            return alias;
        }

        public byte[] getKeyBytes() {
            return keyBytes;
        }

        public Date getCreationDate() {
            return creationDate;
        }

        public int getKeySize() {
            return keySize;
        }
    }
}