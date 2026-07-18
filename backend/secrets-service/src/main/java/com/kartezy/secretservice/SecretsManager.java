package com.kartezy.secretservice;

/**
 * Interface defining the contract for secrets managers.
 * Different implementations can integrate with various secret stores
 * like HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, etc.
 */
public interface SecretsManager {

    /**
     * Retrieves a secret value by its key.
     *
     * @param key the key identifying the secret
     * @return the secret value, or null if not found
     */
    String getSecret(String key);

    /**
     * Stores a secret value with the specified key.
     *
     * @param key   the key to associate with the secret
     * @param value the secret value to store
     */
    void storeSecret(String key, String value);

    /**
     * Deletes a secret by its key.
     *
     * @param key the key identifying the secret to delete
     */
    void deleteSecret(String key);

    /**
     * Checks if a secret exists for the given key.
     *
     * @param key the key to check
     * @return true if a secret exists for the key, false otherwise
     */
    boolean containsSecret(String key);
}