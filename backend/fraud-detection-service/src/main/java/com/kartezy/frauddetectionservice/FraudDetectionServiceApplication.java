package com.kartezy.frauddetectionservice;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
/**
 * Main application class for the fraud detection service.
 */
@SpringBootApplication(scanBasePackages = {"com.kartezy.frauddetectionservice", "com.kartezy.shared"})
@EnableDiscoveryClient
public class FraudDetectionServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FraudDetectionServiceApplication.class, args);
    }
}