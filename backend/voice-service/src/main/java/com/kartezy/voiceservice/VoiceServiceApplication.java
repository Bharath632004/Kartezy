package com.kartezy.voiceservice;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
/**
 * Main application class for the voice service.
 */
@SpringBootApplication(scanBasePackages = {"com.kartezy.voiceservice", "com.kartezy.shared"})
@EnableDiscoveryClient
@EnableFeignClients
public class VoiceServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(VoiceServiceApplication.class, args);
    }
}