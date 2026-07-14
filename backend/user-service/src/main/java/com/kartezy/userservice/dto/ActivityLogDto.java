package com.kartezy.userservice.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;
/**
 * Data Transfer Object for ActivityLog entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLogDto {
    private UUID id;
    @NotNull
    private UUID customerProfileId;
    @NotBlank
    @Size(max = 255)
    private String activityType; // e.g., LOGIN, PROFILE_UPDATE, ADDRESS_ADD
    @NotBlank
    @Size(max = 500)
    private String description;
    private LocalDateTime activityTime;
    @Size(max = 45)
    private String ipAddress; // IPv4 or IPv6
    @Size(max = 255)
    private String userAgent;
    private Double latitude;
    private Double longitude;
}
