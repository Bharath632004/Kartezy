package com.kartezy.encryptionservice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Map;

/**
 * Service for automatically rotating encryption keys based on policies.
 */
@Slf4j
@Service
public class KeyRotationService {

    private final KeyManagementService keyManagementService;
    private final int defaultKeyLifetimeDays = 90; // Default key lifetime of 90 days

    public KeyRotationService(KeyManagementService keyManagementService) {
        this.keyManagementService = keyManagementService;
    }

    /**
     * Scheduled task to check for and rotate expired keys.
     * Runs daily at 2:00 AM.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void rotateExpiredKeys() {
        java.util.Map<String, java.util.Date> keys = keyManagementService.getAllKeyCreationDates();
        for (java.util.Map.Entry<String, java.util.Date> entry : keys.entrySet()) {
            if (isKeyExpired(entry.getValue(), defaultKeyLifetimeDays)) {
                String newKeyId = rotateKey(entry.getKey());
                if (newKeyId != null) {
                    log.info("Rotated key: {} -> new key: {}", entry.getKey(), newKeyId);
                }
            }
        }
        log.info("Key rotation check completed at: {}", LocalDateTime.now());
    }

    /**
     * Checks if a key has expired based on its creation date and the specified lifetime.
     *
     * @param creationDate the date the key was created
     * @param lifetimeDays the lifetime of the key in days
     * @return true if the key has expired, false otherwise
     */
    public boolean isKeyExpired(Date creationDate, int lifetimeDays) {
        long now = System.currentTimeMillis();
        long keyTime = creationDate.getTime();
        long diffInMillis = now - keyTime;
        long diffInDays = diffInMillis / (24 * 60 * 60 * 1000);

        return diffInDays >= lifetimeDays;
    }

    /**
     * Rotates a specific key by generating a new version.
     *
     * @param keyId the ID of the key to rotate
     * @return      the ID of the new key version, or null if rotation failed
     */
    public String rotateKey(String keyId) {
        byte[] existingKey = keyManagementService.getKey(keyId);
        if (existingKey == null) {
            return null;
        }
        // Generate new key with same alias but new material
        String alias = keyManagementService.getKeyAlias(keyId);
        if (alias == null) {
            return null;
        }
        return keyManagementService.generateKey(alias, existingKey.length * 8);
    }
}