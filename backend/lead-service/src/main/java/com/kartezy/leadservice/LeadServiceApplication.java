package com.kartezy.leadservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {"com.kartezy.leadservice", "com.kartezy.shared"})
@EnableDiscoveryClient
public class LeadServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(LeadServiceApplication.class, args);
    }
}