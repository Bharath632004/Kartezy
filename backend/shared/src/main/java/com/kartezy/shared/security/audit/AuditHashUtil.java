package com.kartezy.shared.security.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Map;

/**
 * Utility class for generating and verifying cryptographic hashes of audit events.
 * <p>
 * This provides tamper-evident properties to audit logs by chaining hashes together,
 * similar to a blockchain but optimized for audit trail integrity.
 * </p>
 */
public final class AuditHashUtil {

    private static final String HASH_ALGORITHM = "SHA-256";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    static {
        // Configure ObjectMapper for consistent serialization
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    private AuditHashUtil() {
        // Prevent instantiation
    }

    /**
     * Generates a cryptographic hash for an audit event based on its content.
     * <p>
     * The hash includes all relevant fields except the hash itself and database-generated fields.
     * </p>
     *
     * @param event the audit event to hash
     * @return hexadecimal string representation of the SHA-256 hash
     */
    public static String generateEventHash(EnhancedAuditEvent event) {
        try {
            // Create a map of the fields to include in the hash
            // We exclude: id, previousHash, eventHash, schemaVersion, redacted, createdAt, updatedAt
            // as these are either database-generated or part of the chaining mechanism
            var data = java.util.Map.<String, Object>of(
                    "eventType", event.getEventType(),
                    "principal", event.getPrincipal(),
                    "ipAddress", event.getIpAddress(),
                    "description", event.getDescription(),
                    "outcome", event.getOutcome(),
                    "details", event.getDetails(),
                    "eventTimestamp", event.getEventTimestamp()
            );

            // Convert to JSON string for consistent hashing
            String jsonString = objectMapper.writeValueAsString(data);

            // Generate SHA-256 hash
            MessageDigest digest = MessageDigest.getInstance(HASH_ALGORITHM);
            byte[] hashBytes = digest.digest(jsonString.getBytes(StandardCharsets.UTF_8));

            // Convert to hexadecimal string
            return bytesToHex(hashBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate audit event hash", e);
        }
    }

    /**
     * Verifies that the stored hash of an event matches the recomputed hash.
     *
     * @param event the audit event to verify
     * @return true if the hash matches, false otherwise
     */
    public static boolean verifyEventHash(EnhancedAuditEvent event) {
        if (event == null || event.getEventHash() == null) {
            return false;
        }
        String computedHash = generateEventHash(event);
        return java.util.Objects.equals(event.getEventHash(), computedHash);
    }

    /**
     * Verifies the integrity of a chain of audit events.
     * <p>
     * This checks that each event's previousHash matches the hash of the previous event
     * in the chain, and that each event's own hash is valid.
     * </p>
     *
     * @param events the list of audit events in chronological order
     * @return true if the chain is valid, false otherwise
     */
    public static boolean verifyChain(List<EnhancedAuditEvent> events) {
        if (events == null || events.isEmpty()) {
            return true;
        }

        String previousHash = "";
        for (int i = 0; i < events.size(); i++) {
            EnhancedAuditEvent event = events.get(i);

            // Skip redacted events in chain verification (their content has been modified for GDPR)
            // but we still need to verify their hash matches what was stored when redacted
            if (event.isRedacted()) {
                // For redacted events, we only verify that the stored hash matches what
                // it would be with the redacted content
                if (!verifyEventHash(event)) {
                    return false;
                }
                // Continue with the stored hash for chaining
                previousHash = event.getEventHash();
                continue;
            }

            // Check that the previous hash matches
            String eventPreviousHash = event.getPreviousHash();
            if (!java.util.Objects.equals(eventPreviousHash, previousHash)) {
                return false;
            }

            // Verify the event's own hash
            if (!verifyEventHash(event)) {
                return false;
            }

            // Update previous hash for next iteration
            previousHash = event.getEventHash();
        }
        return true;
    }

    /**
     * Converts a byte array to a hexadecimal string.
     *
     * @param bytes the byte array to convert
     * @return hexadecimal string representation
     */
    private static String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder(2 * bytes.length);
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}