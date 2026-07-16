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
public class OrderInvoiceDto {
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
