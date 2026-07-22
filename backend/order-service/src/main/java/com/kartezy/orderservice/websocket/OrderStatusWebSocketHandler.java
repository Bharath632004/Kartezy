package com.kartezy.orderservice.websocket;

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
 * WebSocket handler for real-time order status updates.
 *
 * URL pattern: /ws/orders/status/{orderId}
 *
 * Message format:
 *   Subscribe:  { "type": "SUBSCRIBE", "orderId": "..." }
 *   Broadcast:  { "type": "STATUS_UPDATE", "orderId": "...", "status": "CONFIRMED",
 *                  "description": "...", "timestamp": "..." }
 */
@Slf4j
@Component
public class OrderStatusWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Map of orderId -> Set of WebSocket sessions subscribed to that order
    private final Map<String, Set<WebSocketSession>> orderSubscribers = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("Order status WebSocket connected: session={}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> payload = objectMapper.readValue(message.getPayload(), Map.class);
            String type = (String) payload.getOrDefault("type", "");

            switch (type) {
                case "SUBSCRIBE": {
                    String orderId = (String) payload.get("orderId");
                    if (orderId == null || orderId.isBlank()) {
                        session.sendMessage(new TextMessage("{\"error\":\"Missing orderId\"}"));
                        return;
                    }
                    orderSubscribers.computeIfAbsent(orderId, k -> new CopyOnWriteArraySet<>()).add(session);
                    session.sendMessage(new TextMessage(
                        "{\"type\":\"SUBSCRIBED\",\"orderId\":\"" + orderId + "\"}"));
                    log.info("Client subscribed to order status: {}", orderId);
                    break;
                }
                default:
                    session.sendMessage(new TextMessage("{\"error\":\"Unknown type: " + type + "\"}"));
            }
        } catch (Exception e) {
            log.error("Error processing order status message: {}", e.getMessage(), e);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        orderSubscribers.values().forEach(set -> set.remove(session));
        log.info("Order status WebSocket disconnected: session={}", session.getId());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.error("Order status transport error: session={}, error={}", session.getId(), exception.getMessage());
        orderSubscribers.values().forEach(set -> set.remove(session));
    }

    /**
     * Programmatic broadcast of a status update to all subscribers of an order.
     * Called from OrderService when an order status changes.
     */
    public void broadcastStatusUpdate(String orderId, String status, String description) {
        Set<WebSocketSession> subscribers = orderSubscribers.get(orderId);
        if (subscribers == null || subscribers.isEmpty()) {
            log.debug("No subscribers for order status: {}", orderId);
            return;
        }

        try {
            Map<String, Object> payload = Map.of(
                "type", "STATUS_UPDATE",
                "orderId", orderId,
                "status", status,
                "description", description != null ? description : "",
                "timestamp", java.time.Instant.now().toString()
            );
            String json = objectMapper.writeValueAsString(payload);

            for (WebSocketSession session : subscribers) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(new TextMessage(json));
                    } catch (IOException e) {
                        log.warn("Failed to send status to session {}: {}", session.getId(), e.getMessage());
                    }
                }
            }
        } catch (IOException e) {
            log.error("Error broadcasting status update: {}", e.getMessage());
        }
    }
}
