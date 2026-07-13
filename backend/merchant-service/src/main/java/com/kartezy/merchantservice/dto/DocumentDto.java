package com.kartezy.merchantservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data Transfer Object for Merchant Document
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDto {
    private String id;
    private String type; // e.g., ID_PROOF, ADDRESS_PROOF, BUSINESS_LICENSE
    private String name;
    private String url; // URL to stored document
    private boolean verified;
}