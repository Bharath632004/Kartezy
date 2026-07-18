package com.kartezy.shared.security.compliance;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

/**
 * PCI DSS compliance for payment card industry data security.
 * Implements requirements for secure payment processing.
 */
public final class PCIDSSCompliance {

    private PCIDSSCompliance() {}

    // PCI DSS 4.0 Requirements
    public enum PCIRequirement {
        // Build and Maintain a Secure Network
        R1_FIREWALL_CONFIGURATION,          // Requirement 1
        R2_SECURE_CONFIGURATION,           // Requirement 2

        // Protect Cardholder Data
        R3_CARDHOLDER_DATA_PROTECTION,     // Requirement 3
        R4_ENCRYPTED_TRANSMISSION,         // Requirement 4

        // Maintain Vulnerability Management Program
        R5_ANTI_MALWARE,                    // Requirement 5
        R6_SECURE_SYSTEMS_APPLICATIONS,     // Requirement 6

        // Implement Strong Access Control Measures
        R7_BUSINESS_NEED_TO_KNOW,           // Requirement 7
        R8_UNIQUE_USER_ID,                  // Requirement 8
        R9_RESTRICT_PHYSICAL_ACCESS,        // Requirement 9

        // Regularly Monitor and Test Networks
        R10_LOG_AND_MONITOR_ALL_ACCESS,     // Requirement 10
        R11_REGULAR_TESTING,                // Requirement 11

        // Maintain Information Security Policy
        R12_INFORMATION_SECURITY_POLICY     // Requirement 12
    }

    public enum CardholderEnvironment {
        CDE,     // Cardholder Data Environment
        OUT_OF_SCOPE,  // Not in CDE
        CONNECTED_TO  // Connected to CDE
    }

    @Data
    @Builder
    public static class PCIValidation {
        private String requirementId;
        private String requirementDescription;
        private boolean implemented;
        private Map<String, Boolean> testingProcedures;
        private String evidenceLocation;
        private String responsibleParty;
        private String lastValidationDate;
        private String nextValidationDate;

        // Key PCI DSS Controls
        public static final Map<String, String> KEY_CONTROLS = Map.ofEntries(
                Map.entry("3.4", "Render PAN unreadable anywhere stored"),
                Map.entry("3.5", "Protect cryptographic keys used for cardholder data"),
                Map.entry("4.1", "Use strong cryptography for transmission"),
                Map.entry("6.5", "Address common coding vulnerabilities"),
                Map.entry("8.3", "Secure all individual non-console administrative access"),
                Map.entry("10.2", "Implement automated audit trails"),
                Map.entry("10.5", "Secure audit trails so they cannot be altered"),
                Map.entry("11.3", "Implement penetration testing methodology"),
                Map.entry("12.3", "Develop usage policies for critical technologies"),
                Map.entry("12.8", "Maintain information security policy for service providers")
        );
    }

    /**
     * Checks if data is within the cardholder data environment.
     */
    public static boolean isCardholderDataEnvironment(String dataType) {
        return switch (dataType.toUpperCase()) {
            case "PAN", "CARDHOLDER_NAME", "EXPIRATION_DATE", "SERVICE_CODE", "TRACK_DATA" -> true;
            default -> false;
        };
    }

    /**
     * Validates that PAN is properly masked.
     */
    public static String maskPAN(String pan) {
        if (pan == null || pan.length() < 6) return "****";
        int len = pan.length();
        return pan.substring(0, 6) + "******" + pan.substring(len - 4);
    }
}
