package com.kartezy.merchantservice.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;
/**
 * Data Transfer Object for Merchant
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MerchantDto {
    private UUID id;
    private String phoneNumber;
    private String address;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}