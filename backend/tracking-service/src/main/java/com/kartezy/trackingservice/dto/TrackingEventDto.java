package com.kartezy.trackingservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @NotNull
    private UUID orderId;

    @NotNull
    private UUID deliveryPartnerId;

    @NotBlank @Size(max = 50)
    private String status;

    private Double latitude;

    private Double longitude;

    @Size(max = 500)
    private String locationDescription;

    @NotBlank @Size(max = 50)
    private String eventType;

    private LocalDateTime timestamp;
}
