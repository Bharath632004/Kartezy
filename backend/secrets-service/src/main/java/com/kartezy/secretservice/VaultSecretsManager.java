package com.kartezy.secretservice;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * In-memory implementation of SecretsManager for development and testing.
 * In production, this would be replaced with actual integrations
 * like HashiCorp Vault, AWS Secrets Manager, or Azure Key Vault.
 */
@Service
public class VaultSecretsManager implements SecretsManager {

    // In-memory store for secrets (use a proper secret store in production)
    private final Map<String, String> secrets = new HashMap<>();

    @Override
    public String getSecret(String key) {
        return secrets.get(key);
    }

    @Override
    public void storeSecret(String key, String value) {
        secrets.put(key, value);
    }

    @Override
    public void deleteSecret(String key) {
        secrets.remove(key);
    }

    @Override
    public boolean containsSecret(String key) {
        return secrets.containsKey(key);
    }
}