package com.kartezy.securitydashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the Security Dashboard service.
 */
@SpringBootApplication(scanBasePackages = {"com.kartezy.securitydashboard", "com.kartezy.shared"})
@EnableDiscoveryClient
public class SecurityDashboardApplication {

    public static void main(String[] args) {
        SpringApplication.run(SecurityDashboardApplication.class, args);
    }
}