package com.kartezy.chatbotservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@FeignClient(name = "order-service", path = "/orders")
public interface OrderServiceClient {

    @GetMapping("/{orderId}")
    Map<String, Object> getOrderById(@PathVariable String orderId);

    @GetMapping("/track/{orderId}")
    Map<String, Object> trackOrder(@PathVariable String orderId);
}
