package com.kartezy.analytics_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Analytics-serviceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to analytics-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "analytics-service is healthy";
    }
}
