package com.kartezy.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEnhancedDto {
    private UUID id;
    private UUID userId;
    private String orderNumber;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal deliveryFee;
    private BigDecimal discount;
    private BigDecimal totalAmount;
    private BigDecimal platformFee;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private List<OrderItemEnhancedDto> items;
    private DeliveryInfoDto deliveryInfo;
    private List<TimelineEntryDto> timeline;
    private UUID driverId;
    private String driverName;
    private String driverPhone;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime deliveredAt;
}
