package com.kartezy.merchantservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/merchants")
public class MerchantServiceController {

    @GetMapping("")
    public String home() {
        return "Welcome to merchant-service";
    }

    @GetMapping("/health")
    public String health() {
        return "merchant-service is healthy";
    }
}
