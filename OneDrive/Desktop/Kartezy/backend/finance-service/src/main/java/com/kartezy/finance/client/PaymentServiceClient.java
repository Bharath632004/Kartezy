package com.kartezy.finance.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "payment-service", path = "/api/payments")
public interface PaymentServiceClient {

    @GetMapping("/{paymentId}")
    Map<String, Object> getPayment(@PathVariable("paymentId") Long paymentId);

    @GetMapping("/order/{orderId}")
    Map<String, Object> getPaymentByOrder(@PathVariable("orderId") Long orderId);

    @GetMapping("/merchant/{merchantId}")
    java.util.List<Map<String, Object>> getMerchantPayments(
        @PathVariable("merchantId") Long merchantId,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "20") int size);
}
