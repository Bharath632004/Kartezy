package com.kartezy.config_server;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Config-serverController {

    @GetMapping("/")
    public String home() {
        return "Welcome to config-server service";
    }

    @GetMapping("/health")
    public String health() {
        return "config-server is healthy";
    }
}
