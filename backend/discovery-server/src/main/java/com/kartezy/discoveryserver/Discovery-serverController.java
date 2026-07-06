package com.kartezy.discoveryserver;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DiscoveryServerController {

    @GetMapping("/")
    public String home() {
        return "Welcome to discovery-server service";
    }

    @GetMapping("/health")
    public String health() {
        return "discovery-server is healthy";
    }
}
