package com.kartezy.wallet_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Wallet-serviceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to wallet-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "wallet-service is healthy";
    }
}
