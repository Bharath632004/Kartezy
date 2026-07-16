package com.kartezy.deliveryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryAssignmentDto {
    private UUID id;
    private UUID orderId;
    private UUID partnerId;
    private String status;
    private String deliveryType;
    private String pickupAddress;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String deliveryAddress;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private Double estimatedDistance;
    private Integer estimatedDuration;
    private Double actualDistance;
    private LocalDateTime acceptedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private String deliveryOtp;
    private String proofPhotoUrl;
    private String customerSignatureUrl;
    private String notes;
    private LocalDateTime createdAt;
}
