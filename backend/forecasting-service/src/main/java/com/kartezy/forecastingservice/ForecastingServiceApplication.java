package com.kartezy.forecastingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = {"com.kartezy.forecastingservice", "com.kartezy.shared"})
@EnableDiscoveryClient
@EnableFeignClients
@EnableCaching
@EnableScheduling
public class ForecastingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ForecastingServiceApplication.class, args);
    }
}
