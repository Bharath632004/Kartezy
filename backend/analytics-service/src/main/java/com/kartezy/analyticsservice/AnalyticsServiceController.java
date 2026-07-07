package com.kartezy.analyticsservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AnalyticsServiceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to analytics-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "analytics-service is healthy";
    }
}