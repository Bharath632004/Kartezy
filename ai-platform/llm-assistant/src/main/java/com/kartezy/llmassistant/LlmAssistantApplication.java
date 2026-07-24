package com.kartezy.llmassistant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class LlmAssistantApplication {
    public static void main(String[] args) {
        SpringApplication.run(LlmAssistantApplication.class, args);
    }
}
