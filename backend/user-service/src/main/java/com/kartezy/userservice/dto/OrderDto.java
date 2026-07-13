package com.kartezy.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Double totalAmount;
    private String status; // e.g., PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}