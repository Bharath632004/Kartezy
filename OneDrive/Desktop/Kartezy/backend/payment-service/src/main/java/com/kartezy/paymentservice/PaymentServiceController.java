package com.kartezy.paymentservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
public class PaymentServiceController {

    @GetMapping("")
    public String home() {
        return "Welcome to payment-service";
    }

    @GetMapping("/health")
    public String health() {
        return "payment-service is healthy";
    }
}
