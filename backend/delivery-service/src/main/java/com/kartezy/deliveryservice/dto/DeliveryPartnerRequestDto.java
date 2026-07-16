package com.kartezy.deliveryservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryPartnerRequestDto {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private String vehicleType;
    private String vehicleNumber;
    private String vehicleModel;
    private String vehicleColor;
    private String city;
    private String state;
    private String pincode;
    private Double currentLatitude;
    private Double currentLongitude;
}
