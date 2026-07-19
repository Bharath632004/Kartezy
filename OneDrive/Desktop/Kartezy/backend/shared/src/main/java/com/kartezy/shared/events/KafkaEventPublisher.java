package com.kartezy.shared.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class KafkaEventPublisher {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public KafkaEventPublisher(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    public void publish(String topic, BaseEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, event.getCorrelationId(), json);
            log.info("Event published to {}: {} [correlationId={}]", topic, event.getEventType(), event.getCorrelationId());
        } catch (Exception e) {
            log.error("Failed to publish event to {}: {}", topic, e.getMessage(), e);
        }
    }

    public void publishOrderEvent(OrderEvent event) {
        publish(EventConstants.TOPIC_ORDER_CREATED, event);
    }

    public void publishPaymentEvent(PaymentEvent event) {
        publish(EventConstants.TOPIC_PAYMENT_COMPLETED, event);
    }

    public void publishDeliveryEvent(DeliveryEvent event) {
        publish(EventConstants.TOPIC_DELIVERY_ASSIGNED, event);
    }
}
