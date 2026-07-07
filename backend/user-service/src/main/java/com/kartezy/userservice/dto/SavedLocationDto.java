package com.kartezy.userservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.UUID;

/**
 * Data Transfer Object for SavedLocation entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedLocationDto {

    private UUID id;

    @NotNull
    private UUID customerProfileId;

    @NotBlank
    @Size(max = 100)
    private String name;

    private Double latitude;

    private Double longitude;

    @Size(max = 255)
    private String address;

    @Size(max = 500)
    private String instructions;
}
