package com.kartezy.shared.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * Event published when order state changes.
 * Consumed by Inventory, Payment, Delivery, Notification, Analytics services.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OrderEvent extends BaseEvent {
    private UUID orderId;
    private UUID userId;
    private UUID merchantId;
    private BigDecimal totalAmount;
    private String orderStatus;
    private String paymentMethod;
}
