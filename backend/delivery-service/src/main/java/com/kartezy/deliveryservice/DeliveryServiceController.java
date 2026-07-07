package com.kartezy.deliveryservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DeliveryServiceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to delivery-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "delivery-service is healthy";
    }
}
