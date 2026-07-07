package com.kartezy.orderservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OrderServiceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to order-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "order-service is healthy";
    }
}
