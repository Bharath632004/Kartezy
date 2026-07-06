package com.kartezy.notificationservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationServiceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to notification-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "notification-service is healthy";
    }
}
