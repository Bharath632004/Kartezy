package com.kartezy.merchantinsights;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MerchantInsightsApplication {
    public static void main(String[] args) {
        SpringApplication.run(MerchantInsightsApplication.class, args);
    }
}
