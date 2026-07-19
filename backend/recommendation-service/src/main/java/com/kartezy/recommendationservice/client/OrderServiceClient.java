package com.kartezy.recommendationservice.client;

import com.kartezy.recommendationservice.dto.OrderDto;
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
                .uri("/orders/user/{userId}", userId)
                .retrieve()
                .bodyToFlux(OrderDto.class);
    }

    public Flux<OrderDto> getOrdersByProductId(Long productId) {
        return webClient.get()
                .uri("/orders/status/{status}", "DELIVERED")
                .retrieve()
                .bodyToFlux(OrderDto.class);
    }

    public Flux<OrderDto> getAllOrders() {
        return webClient.get()
                .uri("/orders")
                .retrieve()
                .bodyToFlux(OrderDto.class);
    }
}
