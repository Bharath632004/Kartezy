package com.kartezy.shared.security.compliance;

import lombok.Builder;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.Map;

/**
 * GDPR compliance implementation for the Kartezy platform.
 * Handles data subject requests, consent management, and data protection.
 */
public final class GDPRCompliance {

    private GDPRCompliance() {}

    // GDPR Data Subject Rights
    public enum DataSubjectRight {
        RIGHT_TO_ACCESS,            // Article 15
        RIGHT_TO_RECTIFICATION,     // Article 16
        RIGHT_TO_ERASURE,           // Article 17 - Right to be Forgotten
        RIGHT_TO_RESTRICTION,       // Article 18
        RIGHT_TO_DATA_PORTABILITY,  // Article 20
        RIGHT_TO_OBJECT,            // Article 21
        RIGHT_TO_AUTOMATED_DECISIONS // Article 22
    }

    // Lawful Basis for Processing
    public enum LawfulBasis {
        CONSENT,                    // Article 6(1)(a)
        CONTRACT,                   // Article 6(1)(b)
        LEGAL_OBLIGATION,           // Article 6(1)(c)
        VITAL_INTERESTS,            // Article 6(1)(d)
        PUBLIC_TASK,                // Article 6(1)(e)
        LEGITIMATE_INTERESTS        // Article 6(1)(f)
    }

    @Data
    @Builder
    public static class DataSubjectRequest {
        private String requestId;
        private String userId;
        private DataSubjectRight right;
        private String description;
        private RequestStatus status;
        private ZonedDateTime receivedAt;
        private ZonedDateTime completedAt;
        private ZonedDateTime deadline; // 1 month for most requests
        private String result;
        private String rejectionReason;

        public enum RequestStatus {
            RECEIVED, VERIFYING_IDENTITY, IN_PROGRESS, COMPLETED, REJECTED, EXTENDED
        }

        public boolean isOverdue() {
            return status != RequestStatus.COMPLETED &&
                    status != RequestStatus.REJECTED &&
                    ZonedDateTime.now().isAfter(deadline);
        }
    }

    @Data
    @Builder
    public static class ConsentRecord {
        private String consentId;
        private String userId;
        private String purpose;
        private LawfulBasis basis;
        private boolean granted;
        private ZonedDateTime grantedAt;
        private ZonedDateTime expiresAt;
        private String ipAddress;
        private String userAgent;
        private String documentVersion;
    }

    @Data
    @Builder
    public static class DataProcessingRecord {
        private String recordId;
        private String processName;
        private String description;
        private String purpose;
        private LawfulBasis lawfulBasis;
        private String dataCategories;
        private String dataSubjects;
        private String recipients;
        private String retentionPeriod;
        private boolean crossBorderTransfer;
        private String safeguards;
    }

    // DPDP Act (India) Specific
    @Data
    @Builder
    public static class DPDPCompliance {
        private boolean consentObtained;        // Section 4 - Consent
        private boolean purposeSpecified;       // Section 5 - Purpose limitation
        private boolean dataMinimized;          // Section 6 - Data minimization
        private boolean accuracyMaintained;     // Section 7 - Accuracy
        private boolean storageLimited;         // Section 8 - Storage limitation
        private boolean safeguardsImplemented;  // Section 9 - Safeguards
        private boolean dataBreachNotified;     // Section 10 - Data breach notification
        private boolean dataProtectionOfficer;  // Section 11 - DPO
        private boolean grievanceRedressal;     // Section 12 - Grievance redressal
        private boolean childrenDataProtected;  // Section 13 - Children's data
        private boolean dataAuditorAppointed;   // Section 14 - Data auditor
        private boolean dataFiduciaryRegistered; // Section 15 - Registration
    }
}
