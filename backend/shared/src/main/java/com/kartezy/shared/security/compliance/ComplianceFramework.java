package com.kartezy.shared.security.compliance;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Compliance framework for Kartezy Enterprise Security Platform.
 * Supports SOC2, ISO 27001, PCI DSS, GDPR, and DPDP Act (India).
 */
public final class ComplianceFramework {

    private ComplianceFramework() {}

    // ================================================================
    // SOC 2 (Service Organization Control 2)
    // ================================================================
    public enum SOC2Principle {
        SECURITY,           // Protected against unauthorized access
        AVAILABILITY,       // Available for operation and use
        PROCESSING_INTEGRITY, // System processing is complete, valid, accurate
        CONFIDENTIALITY,    // Information designated as confidential is protected
        PRIVACY             // Personal information is collected, used, retained, disclosed
    }

    public enum SOC2Control {
        // Access Control
        LOGICAL_ACCESS, PHYSICAL_ACCESS, REMOTE_ACCESS,

        // Change Management
        CHANGE_CONTROL, SOFTWARE_DEVELOPMENT_LIFECYCLE, CONFIGURATION_MANAGEMENT,

        // Risk Management
        RISK_ASSESSMENT, VENDOR_MANAGEMENT, THREAT_MODELING,

        // Monitoring
        INTRUSION_DETECTION, SECURITY_INCIDENT_RESPONSE, CONTINUOUS_MONITORING,

        // Data Protection
        ENCRYPTION_AT_REST, ENCRYPTION_IN_TRANSIT, DATA_BACKUP, DATA_RETENTION,

        // Availability
        CAPACITY_MANAGEMENT, DISASTER_RECOVERY, BUSINESS_CONTINUITY,
        FAULT_TOLERANCE, PERFORMANCE_MONITORING,

        // Processing Integrity
        INPUT_VALIDATION, OUTPUT_VALIDATION, ERROR_HANDLING, DATA_VALIDATION,

        // Confidentiality
        DATA_CLASSIFICATION, DATA_MASKING, ACCESS_CONTROLS, NDA_ENFORCEMENT,

        // Privacy
        CONSENT_MANAGEMENT, DATA_SUBJECT_RIGHTS, PRIVACY_NOTICE,
        DATA_MINIMIZATION, PURPOSE_LIMITATION
    }

    // ================================================================
    // ISO 27001
    // ================================================================
    public enum ISO27001AnnexA {
        // A.5 Information Security Policies
        A5_1_MANAGEMENT_DIRECTION,
        A5_2_POLICY_REVIEW,

        // A.6 Organization of Information Security
        A6_1_INTERNAL_ORGANIZATION,
        A6_2_MOBILE_DEVICES_REMOTE_WORKING,

        // A.7 Human Resource Security
        A7_1_BEFORE_EMPLOYMENT,
        A7_2_DURING_EMPLOYMENT,
        A7_3_TERMINATION_CHANGE,

        // A.8 Asset Management
        A8_1_RESPONSIBILITY_ASSETS,
        A8_2_INFORMATION_CLASSIFICATION,
        A8_3_MEDIA_HANDLING,

        // A.9 Access Control
        A9_1_BUSINESS_REQUIREMENTS_ACCESS,
        A9_2_USER_ACCESS_MANAGEMENT,
        A9_3_USER_RESPONSIBILITIES,
        A9_4_SYSTEM_APPLICATION_ACCESS_CONTROL,

        // A.10 Cryptography
        A10_1_CRYPTOGRAPHIC_CONTROLS,
        A10_2_KEY_MANAGEMENT,

        // A.11 Physical & Environmental Security
        A11_1_SECURE_AREAS,
        A11_2_EQUIPMENT_SECURITY,

        // A.12 Operations Security
        A12_1_OPERATIONAL_PROCEDURES,
        A12_2_PROTECTION_MALWARE,
        A12_3_BACKUP,
        A12_4_LOGGING_MONITORING,
        A12_5_CONTROL_OPERATIONAL_SOFTWARE,
        A12_6_TECHNICAL_VULNERABILITY_MANAGEMENT,
        A12_7_INFORMATION_SYSTEMS_AUDIT,

        // A.13 Communications Security
        A13_1_NETWORK_SECURITY_MANAGEMENT,
        A13_2_INFORMATION_TRANSFER,

        // A.14 System Acquisition, Development & Maintenance
        A14_1_SECURITY_REQUIREMENTS_SYSTEMS,
        A14_2_SECURITY_DEVELOPMENT,
        A14_3_TEST_DATA,

        // A.15 Supplier Relationships
        A15_1_SUPPLIER_SECURITY,
        A15_2_SUPPLIER_SERVICE_DELIVERY,

        // A.16 Incident Management
        A16_1_INCIDENT_MANAGEMENT,

        // A.17 Business Continuity
        A17_1_INFORMATION_SECURITY_CONTINUITY,
        A17_2_REDUNDANCIES,

        // A.18 Compliance
        A18_1_COMPLIANCE_LEGAL_REQUIREMENTS,
        A18_2_COMPLIANCE_SECURITY_REVIEWS
    }

    @Data
    @Builder
    public static class ComplianceControl {
        private String controlId;
        private String framework;
        private String controlName;
        private String description;
        private String implementation;
        private String evidence;
        private String status; // IMPLEMENTED, PARTIALLY_IMPLEMENTED, PLANNED, NOT_IMPLEMENTED
        private String owner;
        private ZonedDateTime lastReviewed;
        private ZonedDateTime nextReviewDate;
        private Map<String, String> evidenceLinks;
    }
}
