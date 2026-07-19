package com.kartezy.shared.client;

import com.kartezy.shared.dto.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@FeignClient(name = "payment-service", path = "/payments")
public interface PaymentServiceClient {

    @GetMapping("/order/{orderId}")
    ApiResponse<?> getPaymentByOrderId(@PathVariable("orderId") UUID orderId);

    @PostMapping("/{paymentId}/refund")
    ApiResponse<?> processRefund(
        @PathVariable("paymentId") UUID paymentId,
        @RequestBody java.util.Map<String, Object> request);
}
