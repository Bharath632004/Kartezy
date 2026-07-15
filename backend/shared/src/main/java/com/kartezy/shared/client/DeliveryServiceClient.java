package com.kartezy.shared.client;

import com.kartezy.shared.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@FeignClient(name = "delivery-service", path = "/delivery")
public interface DeliveryServiceClient {

    @GetMapping("/assignments/order/{orderId}")
    ApiResponse<?> getOrderAssignment(@PathVariable("orderId") UUID orderId);

    @PostMapping("/assignments")
    ApiResponse<?> assignOrder(@RequestBody java.util.Map<String, Object> request);

    @GetMapping("/partners/{partnerId}/performance")
    ApiResponse<?> getPartnerPerformance(@PathVariable("partnerId") UUID partnerId);
}
