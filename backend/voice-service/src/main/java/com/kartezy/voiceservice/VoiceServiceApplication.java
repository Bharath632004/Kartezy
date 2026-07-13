package com.kartezy.voiceservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Main application class for the voice service.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class VoiceServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(VoiceServiceApplication.class, args);
    }
}