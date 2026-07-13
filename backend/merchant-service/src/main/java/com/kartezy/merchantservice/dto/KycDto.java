package com.kartezy.merchantservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for Merchant KYC information
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycDto {
    private String status; // PENDING, APPROVED, REJECTED
    private String documentType; // e.g., PASSPORT, DRIVER_LICENSE
    private String documentNumber;
    private String verifiedBy;
    private java.time.LocalDateTime verifiedAt;
}