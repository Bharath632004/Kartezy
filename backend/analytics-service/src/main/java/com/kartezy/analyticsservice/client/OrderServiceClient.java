package com.kartezy.analyticsservice.client;

import com.kartezy.orderservice.dto.OrderDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class OrderServiceClient {

    private final WebClient webClient;

    @Autowired
    public OrderServiceClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://order-service").build();
    }

    public Flux<OrderDto> getOrdersByUserId(String userId) {
        return webClient.get()
                .uri("/api/users/{userId}/orders", userId)
                .retrieve()
                .bodyToFlux(OrderDto.class);
    }

    public Flux<OrderDto> getAllOrders() {
        return webClient.get()
                .uri("/api/orders")
                .retrieve()
                .bodyToFlux(OrderDto.class);
    }

    public Mono<OrderDto> getOrderById(String orderId) {
        return webClient.get()
                .uri("/api/orders/{id}", orderId)
                .retrieve()
                .bodyToMono(OrderDto.class);
    }
}