package com.kartezy.nlpservice;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
/**
 * Main application class for the NLP service.
 */
@SpringBootApplication
@EnableDiscoveryClient
public class NlpServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(NlpServiceApplication.class, args);
    }
}