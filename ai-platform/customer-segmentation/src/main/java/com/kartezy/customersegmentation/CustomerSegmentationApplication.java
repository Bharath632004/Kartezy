package com.kartezy.customersegmentation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class CustomerSegmentationApplication {
    public static void main(String[] args) {
        SpringApplication.run(CustomerSegmentationApplication.class, args);
    }
}
