package com.kartezy.demandforecasting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DemandForecastingApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemandForecastingApplication.class, args);
    }
}
