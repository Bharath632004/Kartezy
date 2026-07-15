package com.kartezy.orderservice.entity;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    ACCEPTED,
    PICKING,
    PACKING,
    READY,
    ASSIGNED,
    PICKED_UP,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED,
    RETURNED,
    REFUNDED,
    FAILED,
    REPLACEMENT
}
