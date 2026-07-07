package com.kartezy.merchantservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MerchantServiceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to merchant-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "merchant-service is healthy";
    }
}