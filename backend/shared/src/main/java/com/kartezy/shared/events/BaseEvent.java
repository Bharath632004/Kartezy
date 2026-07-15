package com.kartezy.shared.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.Instant;
import java.util.UUID;

/**
 * Base event class for all platform events.
 * Every event published to Kafka/RabbitMQ should extend this.
 */
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class BaseEvent {
    private String eventId;
    private String eventType;
    private String sourceService;
    private String correlationId;
    private Instant timestamp;

    public static BaseEvent create(String eventType, String sourceService) {
        return BaseEvent.builder()
            .eventId(UUID.randomUUID().toString())
            .eventType(eventType)
            .sourceService(sourceService)
            .correlationId(UUID.randomUUID().toString())
            .timestamp(Instant.now())
            .build();
    }
}
