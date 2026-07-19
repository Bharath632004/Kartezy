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

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class OrderItemEnhancedDto {
    private UUID id;
    private UUID merchantId;
    private UUID productId;
    private String productName;
    private String productImage;
    private String sku;
    private String variantName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private BigDecimal discountAmount;
    private BigDecimal netPrice;
    private String status;
    private String notes;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class DeliveryInfoDto {
    private String deliveryAddress;
    private String deliveryCity;
    private String deliveryState;
    private String deliveryPincode;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private String deliveryType;
    private LocalDateTime scheduledTime;
    private String pickupAddress;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String deliveryOtp;
    private String deliveryNotes;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class TimelineEntryDto {
    private UUID id;
    private String status;
    private String description;
    private String updatedBy;
    private LocalDateTime createdAt;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class CreateOrderRequestDto {
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

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class OrderItemRequestDto {
    private UUID merchantId;
    private UUID productId;
    private String productName;
    private String productImage;
    private String sku;
    private String variantName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal discountAmount;
    private String discountDescription;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class OrderStatusUpdateDto {
    private String status;
    private String description;
    private String updatedBy;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class OrderInvoiceDto {
    private UUID orderId;
    private String orderNumber;
    private String invoiceNumber;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String billingAddress;
    private List<OrderItemEnhancedDto> items;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal tax;
    private BigDecimal deliveryFee;
    private BigDecimal totalAmount;
    private String paymentMethod;
    private String paymentStatus;
    private LocalDateTime invoiceDate;
    private String notes;
}

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
class OrderStatsDto {
    private long totalOrders;
    private long pendingOrders;
    private long activeOrders;
    private long deliveredOrders;
    private long cancelledOrders;
    private long returnedOrders;
    private BigDecimal totalRevenue;
    private BigDecimal todayRevenue;
    private double averageOrderValue;
    private long totalItemsSold;
}
