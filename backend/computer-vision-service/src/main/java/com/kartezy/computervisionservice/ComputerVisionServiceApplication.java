package com.kartezy.computervisionservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Main application class for the computer vision service.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class ComputerVisionServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComputerVisionServiceApplication.class, args);
    }
}