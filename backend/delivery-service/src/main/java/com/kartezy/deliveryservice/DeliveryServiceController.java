package com.kartezy.deliveryservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/delivery")
public class DeliveryServiceController {

    @GetMapping("")
    public String home() {
        return "Welcome to delivery-service";
    }

    @GetMapping("/health")
    public String health() {
        return "delivery-service is healthy";
    }
}
