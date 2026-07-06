package com.kartezy.discovery_server;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Discovery-serverController {

    @GetMapping("/")
    public String home() {
        return "Welcome to discovery-server service";
    }

    @GetMapping("/health")
    public String health() {
        return "discovery-server is healthy";
    }
}
