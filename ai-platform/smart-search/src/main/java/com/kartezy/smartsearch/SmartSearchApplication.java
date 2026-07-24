package com.kartezy.smartsearch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class SmartSearchApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartSearchApplication.class, args);
    }
}
