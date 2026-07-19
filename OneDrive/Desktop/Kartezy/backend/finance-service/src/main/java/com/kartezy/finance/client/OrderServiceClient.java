package com.kartezy.finance.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "order-service", path = "/api/orders")
public interface OrderServiceClient {

    @GetMapping("/{orderId}")
    Map<String, Object> getOrder(@PathVariable("orderId") Long orderId);

    @GetMapping("/merchant/{merchantId}")
    java.util.List<Map<String, Object>> getMerchantOrders(
        @PathVariable("merchantId") Long merchantId,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "20") int size);
}
