package com.kartezy.recommendationservice.client;
import com.kartezy.catalogservice.dto.CategoryDto;
import com.kartezy.catalogservice.dto.ProductDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
@Component
public class CatalogServiceClient {
    private final WebClient webClient;
    @Autowired
    public CatalogServiceClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("http://catalog-service").build();
    }
    public Flux<CategoryDto> getAllCategories() {
        return webClient.get()
                .uri("/api/categories")
                .retrieve()
                .bodyToFlux(CategoryDto.class);
    }
    public Flux<ProductDto> getAllProducts() {
        return webClient.get()
                .uri("/api/products")
                .retrieve()
                .bodyToFlux(ProductDto.class);
    }
    public Flux<ProductDto> getProductsByCategory(Long categoryId) {
        return webClient.get()
                .uri("/api/products?categoryId={categoryId}", categoryId)
                .retrieve()
                .bodyToFlux(ProductDto.class);
    }
    public ProductDto getProductById(Long productId) {
        return webClient.get()
                .uri("/api/products/{id}", productId)
                .retrieve()
                .bodyToMono(ProductDto.class)
                .block();
    }
}