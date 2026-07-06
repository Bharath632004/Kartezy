package com.kartezy.reviewservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReviewServiceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to review-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "review-service is healthy";
    }
}
