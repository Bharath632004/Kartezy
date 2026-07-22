package com.kartezy.deliveryservice.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Thin wrapper so DeliveryService can broadcast location updates
 * without depending directly on the WebSocket handler.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DeliveryWebSocketPublisher {

    private final LocationWebSocketHandler locationHandler;

    /**
     * Broadcasts a delivery partner's location update to all customers
     * who are watching the given order.
     */
    public void broadcastLocation(String orderId, double latitude, double longitude) {
        log.debug("Publishing location for order {}: ({}, {})", orderId, latitude, longitude);
        locationHandler.broadcastLocationUpdate(orderId, latitude, longitude);
    }
}
