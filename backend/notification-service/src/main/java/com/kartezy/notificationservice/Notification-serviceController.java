package com.kartezy.notification_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Notification-serviceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to notification-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "notification-service is healthy";
    }
}
