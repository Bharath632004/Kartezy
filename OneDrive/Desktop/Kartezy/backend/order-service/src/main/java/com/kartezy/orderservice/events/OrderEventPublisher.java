package com.kartezy.orderservice.events;

import com.kartezy.orderservice.entity.Order;
import com.kartezy.shared.events.KafkaEventPublisher;
import com.kartezy.shared.events.OrderEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j @Component @RequiredArgsConstructor
public class OrderEventPublisher {

    private final KafkaEventPublisher eventPublisher;

    public void publishOrderCreated(Order order) {
        OrderEvent event = OrderEvent.builder()
            .orderId(order.getId()).userId(order.getUserId())
            .totalAmount(order.getTotalAmount())
            .orderStatus(order.getStatus()).paymentMethod(order.getPaymentMethod())
            .build();
        event.setSourceService("order-service");
        event.setEventType("ORDER_CREATED");
        eventPublisher.publishOrderEvent(event);
        log.info("Order created event published: {}", order.getId());
    }

    public void publishOrderDelivered(Order order) {
        OrderEvent event = OrderEvent.builder()
            .orderId(order.getId()).userId(order.getUserId())
            .totalAmount(order.getTotalAmount()).orderStatus("DELIVERED")
            .build();
        event.setSourceService("order-service");
        event.setEventType("ORDER_DELIVERED");
        eventPublisher.publish(event.getEventType(), event);
        log.info("Order delivered event published: {}", order.getId());
    }
}
