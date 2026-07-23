package com.kartezy.trackingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingEventDto {
    private UUID id;
    private UUID orderId;
    private UUID deliveryPartnerId;
    private String status;
    private Double latitude;
    private Double longitude;
    private String locationDescription;
    private String eventType;
    private LocalDateTime timestamp;
}
