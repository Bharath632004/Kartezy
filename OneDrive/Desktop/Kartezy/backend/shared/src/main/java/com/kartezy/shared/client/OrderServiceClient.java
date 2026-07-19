package com.kartezy.shared.client;

import com.kartezy.shared.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@FeignClient(name = "order-service", path = "/orders")
public interface OrderServiceClient {

    @GetMapping("/{id}")
    ApiResponse<?> getOrder(@PathVariable("id") UUID id);

    @PutMapping("/{orderId}/status")
    ApiResponse<?> updateOrderStatus(
        @PathVariable("orderId") UUID orderId,
        @RequestBody java.util.Map<String, String> update);

    @PutMapping("/{orderId}/cancel")
    ApiResponse<?> cancelOrder(
        @PathVariable("orderId") UUID orderId,
        @RequestParam("reason") String reason);
}
