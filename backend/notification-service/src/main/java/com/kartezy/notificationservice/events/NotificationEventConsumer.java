package com.kartezy.notificationservice.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kartezy.notificationservice.service.NotificationService;
import com.kartezy.shared.events.OrderEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j @Component @RequiredArgsConstructor
public class NotificationEventConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "order.created", groupId = "notification-service-group")
    public void handleOrderCreated(String message) {
        try {
            OrderEvent event = objectMapper.readValue(message, OrderEvent.class);
            String title = "Order Placed Successfully";
            String body = "Your order has been placed. Total: ₹" + event.getTotalAmount();
            notificationService.sendFromTemplate(event.getUserId(), "ORDER_CONFIRMED", "IN_APP",
                java.util.Map.of("orderId", event.getOrderId().toString(), "amount", event.getTotalAmount().toString()));
            log.info("Order notification sent to user: {}", event.getUserId());
        } catch (Exception e) {
            log.error("Failed to process order event: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "order.delivered", groupId = "notification-service-group")
    public void handleOrderDelivered(String message) {
        try {
            OrderEvent event = objectMapper.readValue(message, OrderEvent.class);
            notificationService.sendFromTemplate(event.getUserId(), "ORDER_DELIVERED", "IN_APP",
                java.util.Map.of("orderId", event.getOrderId().toString()));
            log.info("Delivery notification sent to user: {}", event.getUserId());
        } catch (Exception e) {
            log.error("Failed to process delivery event: {}", e.getMessage());
        }
    }
}
