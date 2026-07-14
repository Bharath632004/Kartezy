package com.kartezy.orderservice.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
/**
 * Data Transfer Object for Order
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private UUID id;
    private UUID userId;
    private String orderNumber;
    private BigDecimal totalAmount;
    private String status; // e.g., PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    private UUID driverId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}