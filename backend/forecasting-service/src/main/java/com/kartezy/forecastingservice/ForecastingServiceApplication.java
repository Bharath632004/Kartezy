package com.kartezy.forecastingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication(scanBasePackages = {"com.kartezy.forecastingservice", "com.kartezy.shared"})
@EnableDiscoveryClient
public class ForecastingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ForecastingServiceApplication.class, args);
    }
}
