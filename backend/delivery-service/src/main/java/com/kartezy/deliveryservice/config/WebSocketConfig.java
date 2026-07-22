package com.kartezy.deliveryservice.config;

import com.kartezy.deliveryservice.websocket.LocationWebSocketHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * Registers the raw WebSocket endpoint for real-time delivery location streaming.
 *
 * Delivery partners connect to /ws/delivery/location/{orderId} and send their GPS coordinates.
 * Customers watching the same order receive the live location updates.
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final LocationWebSocketHandler locationHandler;

    public WebSocketConfig(LocationWebSocketHandler locationHandler) {
        this.locationHandler = locationHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(locationHandler, "/ws/delivery/location/**")
                .setAllowedOrigins("*");
    }
}
