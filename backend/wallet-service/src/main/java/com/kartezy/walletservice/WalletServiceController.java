package com.kartezy.walletservice;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class WalletServiceController {
    @GetMapping("/")
    public String home() {
        return "Welcome to wallet-service service";
    }
    @GetMapping("/health")
    public String health() {
        return "wallet-service is healthy";
    }
}
