package com.kartezy.recommendation_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Recommendation-serviceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to recommendation-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "recommendation-service is healthy";
    }
}
