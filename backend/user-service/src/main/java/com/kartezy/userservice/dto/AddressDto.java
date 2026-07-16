package com.kartezy.userservice.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.UUID;
/**
 * Data Transfer Object for Address entity
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDto {
    private UUID id;
    @NotNull
    private UUID customerProfileId;
    @NotNull
    private AddressType type;
    @NotBlank
    @Size(max = 255)
    private String street;
    @Size(max = 100)
    private String apartment;
    @Size(max = 50)
    private String floor;
    @Size(max = 100)
    private String building;
    @Size(max = 255)
    private String landmark;
    @NotBlank
    @Size(max = 100)
    private String city;
    @NotBlank
    @Size(max = 100)
    private String state;
    @NotBlank
    @Size(max = 100)
    private String country;
    @NotBlank
    @Size(max = 20)
    private String postalCode;
    private Double latitude;
    private Double longitude;
    @Builder.Default
    private boolean defaultAddress = false;
    @Size(max = 500)
    private String instructions;
    /**
     * Address type enumeration
     */
    public enum AddressType {
        HOME, OFFICE, OTHER
    }
}
