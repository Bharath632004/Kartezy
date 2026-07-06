package com.kartezy.authservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthServiceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to auth-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "auth-service is healthy";
    }
}
