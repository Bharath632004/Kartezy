package com.kartezy.imagerecognition;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ImageRecognitionApplication {
    public static void main(String[] args) {
        SpringApplication.run(ImageRecognitionApplication.class, args);
    }
}
