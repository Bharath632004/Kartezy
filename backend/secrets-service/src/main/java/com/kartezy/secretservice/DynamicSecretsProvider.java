package com.kartezy.secretservice;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.HashMap;
import java.util.Date;

/**
 * Service for providing dynamic secrets that are generated on-demand
 * and have limited lifetimes (e.g., database credentials, API tokens).
 */
@Service
public class DynamicSecretsProvider {

    // In-memory store for dynamic secrets with their expiration times
    private final Map<String, DynamicSecretEntry> dynamicSecrets = new HashMap<>();

    /**
     * Generates a dynamic secret with the specified time-to-live.
     *
     * @param baseKey    the base key for the secret
     * @param ttlSeconds the time-to-live in seconds
     * @param generator  a function that generates the secret value
     * @return           a unique key that can be used to retrieve the secret
     */
    public String getDynamicSecret(String baseKey, int ttlSeconds,
                                   java.util.function.Supplier<String> generator) {
        String secretKey = generateDynamicKey(baseKey);
        String secretValue = generator.get();

        Date expirationTime = new Date(System.currentTimeMillis() + (ttlSeconds * 1000L));
        dynamicSecrets.put(secretKey, new DynamicSecretEntry(secretValue, expirationTime));

        return secretKey;
    }

    /**
     * Retrieves a dynamic secret if it exists and hasn't expired.
     *
     * @param secretKey the key of the dynamic secret to retrieve
     * @return          the secret value, or null if not found or expired
     */
    public String getSecret(String secretKey) {
        DynamicSecretEntry entry = dynamicSecrets.get(secretKey);
        if (entry == null) {
            return null;
        }

        // Check if the secret has expired
        if (new Date().after(entry.getExpiresAt())) {
            // Remove expired secret
            dynamicSecrets.remove(secretKey);
            return null;
        }

        return entry.getValue();
    }

    /**
     * Generates a unique key for a dynamic secret.
     *
     * @param baseKey the base key to use
     * @return        a unique key for the dynamic secret
     */
    private String generateDynamicKey(String baseKey) {
        // In a real implementation, you might use UUIDs or other unique identifiers
        return baseKey + "_" + System.currentTimeMillis();
    }

    /**
     * Internal class representing a dynamic secret entry.
     */
    private static class DynamicSecretEntry {
        private final String value;
        private final Date expiresAt;

        public DynamicSecretEntry(String value, Date expiresAt) {
            this.value = value;
            this.expiresAt = expiresAt;
        }

        public String getValue() {
            return value;
        }

        public Date getExpiresAt() {
            return expiresAt;
        }
    }
}