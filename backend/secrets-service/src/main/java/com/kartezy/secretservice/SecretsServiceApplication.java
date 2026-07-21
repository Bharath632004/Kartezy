package com.kartezy.secretservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the Secrets Service.
 */
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {"com.kartezy.secretservice", "com.kartezy.shared"})
@EnableDiscoveryClient
public class SecretsServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(SecretsServiceApplication.class, args);
    }
}