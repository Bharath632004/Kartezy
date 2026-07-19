package com.kartezy.ocrservice;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
/**
 * Main application class for the OCR service.
 */
@SpringBootApplication(scanBasePackages = {"com.kartezy.ocrservice", "com.kartezy.shared"})
@EnableDiscoveryClient
public class OcrServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OcrServiceApplication.class, args);
    }
}