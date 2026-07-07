package com.kartezy.catalogservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CatalogServiceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to catalog-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "catalog-service is healthy";
    }
}