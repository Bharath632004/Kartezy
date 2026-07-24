package com.kartezy.shared.security.kyc;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

/**
 * KYC (Know Your Customer) verification service.
 * <p>
 * Handles verification for:
 * - Merchants: PAN, GST, Business Registration, Bank Account, Owner Verification
 * - Delivery Partners: Driving License, Government ID, Vehicle, Insurance
 * </p>
 */
@Slf4j
@Service
public class KycService {

    private final Map<UUID, KycSubmission> kycSubmissions = new java.util.concurrent.ConcurrentHashMap<>();

    /**
     * Submits a KYC application for review.
     */
    public KycSubmission submitKyc(KycSubmission submission) {
        submission.setId(UUID.randomUUID());
        submission.setStatus(KycStatus.PENDING);
        submission.setSubmittedAt(Instant.now());
        submission.setUpdatedAt(Instant.now());
        kycSubmissions.put(submission.getId(), submission);

        log.info("KYC submitted: userId={}, type={}", submission.getUserId(), submission.getKycType());
        return submission;
    }

    /**
     * Approves a KYC application.
     */
    public KycSubmission approveKyc(UUID submissionId, String approvedBy, String notes) {
        KycSubmission submission = kycSubmissions.get(submissionId);
        if (submission == null) {
            throw new IllegalArgumentException("KYC submission not found: " + submissionId);
        }

        submission.setStatus(KycStatus.APPROVED);
        submission.setReviewedBy(approvedBy);
        submission.setReviewNotes(notes);
        submission.setReviewedAt(Instant.now());
        submission.setUpdatedAt(Instant.now());
        kycSubmissions.put(submissionId, submission);

        log.info("KYC approved: submissionId={}, by={}", submissionId, approvedBy);
        return submission;
    }

    /**
     * Rejects a KYC application with reasons.
     */
    public KycSubmission rejectKyc(UUID submissionId, String rejectedBy, String reason) {
        KycSubmission submission = kycSubmissions.get(submissionId);
        if (submission == null) {
            throw new IllegalArgumentException("KYC submission not found: " + submissionId);
        }

        submission.setStatus(KycStatus.REJECTED);
        submission.setReviewedBy(rejectedBy);
        submission.setReviewNotes(reason);
        submission.setReviewedAt(Instant.now());
        submission.setUpdatedAt(Instant.now());
        kycSubmissions.put(submissionId, submission);

        log.warn("KYC rejected: submissionId={}, by={}, reason={}", submissionId, rejectedBy, reason);
        return submission;
    }

    /**
     * Gets the KYC status for a user.
     */
    public KycStatus getKycStatus(UUID userId) {
        return kycSubmissions.values().stream()
                .filter(s -> s.getUserId().equals(userId))
                .map(KycSubmission::getStatus)
                .findFirst()
                .orElse(KycStatus.NOT_SUBMITTED);
    }

    /**
     * Gets all KYC submissions for a user.
     */
    public List<KycSubmission> getUserSubmissions(UUID userId) {
        return kycSubmissions.values().stream()
                .filter(s -> s.getUserId().equals(userId))
                .sorted(Comparator.comparing(KycSubmission::getSubmittedAt).reversed())
                .toList();
    }

    /**
     * Validates a PAN card number format.
     * Format: AAAPL1234C (10 alphanumeric characters)
     */
    public static boolean validatePan(String pan) {
        return pan != null && pan.matches("[A-Z]{5}[0-9]{4}[A-Z]{1}");
    }

    /**
     * Validates a GST number format.
     * Format: 22AAAAA0000A1Z5 (15 characters)
     */
    public static boolean validateGst(String gst) {
        return gst != null && gst.matches("[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}");
    }

    /**
     * Validates an Indian driving license format.
     * Format: MH-0120210112345 (state code + RTO + year + number)
     */
    public static boolean validateDrivingLicense(String license) {
        return license != null && license.matches("[A-Z]{2}-[0-9]{2}[0-9]{13}");
    }

    /**
     * Validates a vehicle registration number (Indian format).
     * Format: MH01AB1234
     */
    public static boolean validateVehicleNumber(String vehicleNumber) {
        return vehicleNumber != null &&
                vehicleNumber.matches("[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{1,4}");
    }

    // ======== Data Models ========

    public enum KycType {
        MERCHANT_PAN,
        MERCHANT_GST,
        MERCHANT_BUSINESS_REGISTRATION,
        MERCHANT_BANK_ACCOUNT,
        MERCHANT_OWNER_VERIFICATION,
        DELIVERY_DRIVING_LICENSE,
        DELIVERY_GOVERNMENT_ID,
        DELIVERY_VEHICLE,
        DELIVERY_INSURANCE,
        DELIVERY_PAN,
        DELIVERY_BANK_ACCOUNT,
        DELIVERY_SELFIE
    }

    public enum KycStatus {
        NOT_SUBMITTED,
        PENDING,
        APPROVED,
        REJECTED,
        EXPIRED
    }

    public enum DocumentType {
        PAN_CARD,
        GST_CERTIFICATE,
        BUSINESS_REGISTRATION,
        BANK_STATEMENT,
        CANCELED_CHEQUE,
        DRIVING_LICENSE,
        AADHAAR,
        VOTER_ID,
        PASSPORT,
        VEHICLE_RC,
        INSURANCE_CERTIFICATE,
        SELFIE,
        SHOP_IMAGE,
        OWNER_PHOTO
    }

    @Data
    @Builder
    public static class KycSubmission {
        private UUID id;
        private UUID userId;
        private KycType kycType;
        private KycStatus status;
        private String documentNumber; // PAN number, GST number, etc.
        private List<KycDocument> documents;
        private String reviewedBy;
        private String reviewNotes;
        private Instant reviewedAt;
        private Instant submittedAt;
        private Instant updatedAt;
        private int attemptCount;
    }

    @Data
    @Builder
    public static class KycDocument {
        private String documentType;
        private String fileName;
        private String fileUrl; // URL to secure object storage
        private long fileSize;
        private boolean verified;
        private String verificationNotes;
    }
}
