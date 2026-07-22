package com.kartezy.orderservice.config;

import com.kartezy.orderservice.websocket.OrderStatusWebSocketHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * Registers the raw WebSocket endpoint for real-time order status updates.
 *
 * Customers connect to /ws/orders/status/{orderId} to receive order status changes.
 * Merchants and delivery partners can also subscribe.
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final OrderStatusWebSocketHandler statusHandler;

    public WebSocketConfig(OrderStatusWebSocketHandler statusHandler) {
        this.statusHandler = statusHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(statusHandler, "/ws/orders/status/**")
                .setAllowedOrigins("*");
    }
}
