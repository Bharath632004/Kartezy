package com.kartezy.deliveryservice.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.net.URI;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

/**
 * Manages WebSocket connections for live delivery tracking.
 *
 * URL pattern: /ws/delivery/location/{orderId}
 *
 * Two roles connect:
 *   - DELIVERY: Sends location updates as a delivery partner
 *   - CUSTOMER: Receives location updates for a specific order
 *
 * Message format (JSON):
 *   From delivery partner:
 *     { "type": "LOCATION_UPDATE", "orderId": "...", "latitude": 12.34, "longitude": 56.78, "timestamp": "..." }
 *
 *   Broadcast to customers:
 *     { "type": "LOCATION_UPDATE", "orderId": "...", "latitude": 12.34, "longitude": 56.78, "timestamp": "..." }
 */
@Slf4j
@Component
public class LocationWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Map of orderId -> Set of customer WebSocket sessions watching that order
    private final Map<String, Set<WebSocketSession>> customerSessions = new ConcurrentHashMap<>();

    // Map of orderId -> Set of delivery partner WebSocket sessions
    private final Map<String, Set<WebSocketSession>> deliverySessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String orderId = extractOrderId(session);
        if (orderId == null) {
            log.warn("WebSocket connection without orderId: {}", session.getId());
            try { session.close(CloseStatus.BAD_DATA); } catch (IOException ignored) {}
            return;
        }

        log.info("WebSocket connected: session={}, orderId={}", session.getId(), orderId);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> payload = objectMapper.readValue(message.getPayload(), Map.class);
            String type = (String) payload.getOrDefault("type", "");
            String orderId = (String) payload.getOrDefault("orderId", extractOrderId(session));

            if (orderId == null) {
                session.sendMessage(new TextMessage("{\"error\":\"Missing orderId\"}"));
                return;
            }

            switch (type) {
                case "SUBSCRIBE_CUSTOMER":
                    // Customer wants to watch this order
                    registerCustomer(session, orderId);
                    session.sendMessage(new TextMessage(
                        "{\"type\":\"SUBSCRIBED\",\"orderId\":\"" + orderId + "\"}"));
                    break;

                case "SUBSCRIBE_DELIVERY":
                    // Delivery partner registers to send updates for this order
                    registerDelivery(session, orderId);
                    session.sendMessage(new TextMessage(
                        "{\"type\":\"SUBSCRIBED\",\"orderId\":\"" + orderId + "\"}"));
                    break;

                case "LOCATION_UPDATE":
                    // Delivery partner sends GPS coordinates
                    broadcastLocation(payload, session, orderId);
                    break;

                default:
                    log.warn("Unknown message type: {} from session {}", type, session.getId());
                    session.sendMessage(new TextMessage("{\"error\":\"Unknown type: " + type + "\"}"));
            }
        } catch (Exception e) {
            log.error("Error processing WebSocket message: {}", e.getMessage(), e);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        // Remove session from all maps
        customerSessions.values().forEach(set -> set.remove(session));
        deliverySessions.values().forEach(set -> set.remove(session));
        log.info("WebSocket disconnected: session={}, status={}", session.getId(), status);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.error("WebSocket transport error: session={}, error={}", session.getId(), exception.getMessage());
        customerSessions.values().forEach(set -> set.remove(session));
        deliverySessions.values().forEach(set -> set.remove(session));
    }

    // ---- Internal helpers ----

    private void registerCustomer(WebSocketSession session, String orderId) {
        customerSessions.computeIfAbsent(orderId, k -> new CopyOnWriteArraySet<>()).add(session);
        log.info("Customer subscribed to order: {}", orderId);
    }

    private void registerDelivery(WebSocketSession session, String orderId) {
        deliverySessions.computeIfAbsent(orderId, k -> new CopyOnWriteArraySet<>()).add(session);
        log.info("Delivery partner subscribed to order: {}", orderId);
    }

    private void broadcastLocation(Map<String, Object> payload, WebSocketSession sender, String orderId) {
        Set<WebSocketSession> customers = customerSessions.get(orderId);
        if (customers == null || customers.isEmpty()) {
            log.debug("No customers watching order: {}", orderId);
            return;
        }

        try {
            // Add current timestamp if not present
            payload.putIfAbsent("timestamp", java.time.Instant.now().toString());
            String json = objectMapper.writeValueAsString(payload);

            for (WebSocketSession customer : customers) {
                if (customer.isOpen()) {
                    try {
                        customer.sendMessage(new TextMessage(json));
                    } catch (IOException e) {
                        log.warn("Failed to send to customer {}: {}", customer.getId(), e.getMessage());
                    }
                }
            }
        } catch (IOException e) {
            log.error("Error serializing location update: {}", e.getMessage());
        }
    }

    private String extractOrderId(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri == null) return null;
        String path = uri.getPath();
        // Path: /ws/delivery/location/{orderId}
        String[] segments = path.split("/");
        if (segments.length >= 5) {
            return segments[4];
        }
        return null;
    }

    /**
     * Programmatic method to broadcast a location update to customers.
     * Called from DeliveryService when a partner updates their location via REST.
     */
    public void broadcastLocationUpdate(String orderId, double latitude, double longitude) {
        try {
            Map<String, Object> payload = Map.of(
                "type", "LOCATION_UPDATE",
                "orderId", orderId,
                "latitude", latitude,
                "longitude", longitude,
                "timestamp", java.time.Instant.now().toString()
            );
            String json = objectMapper.writeValueAsString(payload);

            Set<WebSocketSession> customers = customerSessions.get(orderId);
            if (customers != null) {
                for (WebSocketSession customer : customers) {
                    if (customer.isOpen()) {
                        try {
                            customer.sendMessage(new TextMessage(json));
                        } catch (IOException e) {
                            log.warn("Failed to broadcast to customer {}: {}", customer.getId(), e.getMessage());
                        }
                    }
                }
            }
        } catch (IOException e) {
            log.error("Error broadcasting location update: {}", e.getMessage());
        }
    }
}
