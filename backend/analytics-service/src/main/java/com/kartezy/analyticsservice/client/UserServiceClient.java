package com.kartezy.analyticsservice.client;

import com.kartezy.analyticsservice.dto.CustomerProfileDto;
import com.kartezy.analyticsservice.dto.FavoriteProductDto;
import com.kartezy.analyticsservice.dto.OrderDto;
import com.kartezy.analyticsservice.dto.SearchHistoryDto;
import com.kartezy.analyticsservice.dto.WishlistItemDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class UserServiceClient {
    private final WebClient webClient;

    @Autowired
    public UserServiceClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://user-service").build();
    }

    public Mono<CustomerProfileDto> getCustomerProfileByUserId(UUID userId) {
        return webClient.get()
                .uri("/users/{userId}/customer-profile", userId)
                .retrieve()
                .bodyToMono(CustomerProfileDto.class);
    }

    public Flux<CustomerProfileDto> getAllCustomers() {
        return webClient.get()
                .uri("/users")
                .retrieve()
                .bodyToFlux(CustomerProfileDto.class);
    }

    public Flux<WishlistItemDto> getWishlistItems(String userId) {
        return webClient.get()
                .uri("/users/{userId}/wishlist", userId)
                .retrieve()
                .bodyToFlux(WishlistItemDto.class);
    }

    public Flux<FavoriteProductDto> getFavoriteProducts(String userId) {
        return webClient.get()
                .uri("/users/{userId}/favorite-products", userId)
                .retrieve()
                .bodyToFlux(FavoriteProductDto.class);
    }

    public Flux<SearchHistoryDto> getSearchHistory(String userId) {
        return webClient.get()
                .uri("/users/{userId}/search-history", userId)
                .retrieve()
                .bodyToFlux(SearchHistoryDto.class);
    }

    public Flux<OrderDto> getOrders(String userId) {
        return webClient.get()
                .uri("/users/{userId}/orders", userId)
                .retrieve()
                .bodyToFlux(OrderDto.class);
    }
}
