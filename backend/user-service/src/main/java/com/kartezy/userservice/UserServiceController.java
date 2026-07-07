package com.kartezy.userservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserServiceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to user-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "user-service is healthy";
    }
}
