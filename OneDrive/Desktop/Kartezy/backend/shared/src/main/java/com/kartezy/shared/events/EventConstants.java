package com.kartezy.shared.events;

/**
 * Shared Kafka/RabbitMQ event constants for the Kartezy platform.
 * All services should reference these constants for consistency.
 */
public final class EventConstants {

    private EventConstants() {}

    // ========== Order Events ==========
    public static final String TOPIC_ORDER_CREATED = "order.created";
    public static final String TOPIC_ORDER_CONFIRMED = "order.confirmed";
    public static final String TOPIC_ORDER_ACCEPTED = "order.accepted";
    public static final String TOPIC_ORDER_CANCELLED = "order.cancelled";
    public static final String TOPIC_ORDER_DELIVERED = "order.delivered";

    // ========== Inventory Events ==========
    public static final String TOPIC_INVENTORY_RESERVED = "inventory.reserved";
    public static final String TOPIC_INVENTORY_RELEASED = "inventory.released";
    public static final String TOPIC_INVENTORY_LOW_STOCK = "inventory.low.stock";

    // ========== Payment Events ==========
    public static final String TOPIC_PAYMENT_COMPLETED = "payment.completed";
    public static final String TOPIC_PAYMENT_FAILED = "payment.failed";
    public static final String TOPIC_PAYMENT_REFUNDED = "payment.refunded";

    // ========== Delivery Events ==========
    public static final String TOPIC_DELIVERY_ASSIGNED = "delivery.assigned";
    public static final String TOPIC_DELIVERY_PICKED_UP = "delivery.picked.up";
    public static final String TOPIC_DELIVERY_COMPLETED = "delivery.completed";

    // ========== Notification Events ==========
    public static final String TOPIC_NOTIFICATION_SEND = "notification.send";

    // ========== Analytics Events ==========
    public static final String TOPIC_ANALYTICS_ORDER = "analytics.order";
    public static final String TOPIC_ANALYTICS_USER_ACTION = "analytics.user.action";

    // ========== Event Headers ==========
    public static final String HEADER_EVENT_TYPE = "eventType";
    public static final String HEADER_SOURCE_SERVICE = "sourceService";
    public static final String HEADER_CORRELATION_ID = "correlationId";
    public static final String HEADER_TIMESTAMP = "timestamp";
}
