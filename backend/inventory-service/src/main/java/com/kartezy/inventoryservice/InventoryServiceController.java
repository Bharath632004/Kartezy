package com.kartezy.inventoryservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InventoryServiceController {

    @GetMapping("/")
    public String home() {
        return "Welcome to inventory-service service";
    }

    @GetMapping("/health")
    public String health() {
        return "inventory-service is healthy";
    }
}