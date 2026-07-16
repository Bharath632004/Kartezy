package com.kartezy.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequestDto {
    private UUID userId;
    private String deliveryType;
    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryState;
    private String deliveryPincode;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private LocalDateTime scheduledTime;
    private String pickupAddress;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String notes;
    private String paymentMethod;
    private List<OrderItemRequestDto> items;
}
