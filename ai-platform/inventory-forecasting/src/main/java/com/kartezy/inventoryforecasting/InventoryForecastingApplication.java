package com.kartezy.inventoryforecasting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class InventoryForecastingApplication {
    public static void main(String[] args) {
        SpringApplication.run(InventoryForecastingApplication.class, args);
    }
}
