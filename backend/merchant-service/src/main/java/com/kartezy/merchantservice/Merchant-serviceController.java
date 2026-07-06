package com.kartezy.merchant_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Merchant-serviceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to merchant-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "merchant-service is healthy";
    }
}
