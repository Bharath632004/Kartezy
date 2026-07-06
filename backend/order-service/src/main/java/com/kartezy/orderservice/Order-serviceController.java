package com.kartezy.order_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Order-serviceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to order-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "order-service is healthy";
    }
}
