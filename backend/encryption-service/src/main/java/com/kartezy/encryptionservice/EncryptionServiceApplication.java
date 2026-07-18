package com.kartezy.encryptionservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

/**
 * Main application class for the Encryption Service.
 */
@SpringBootApplication
@ComponentScan(basePackages = {
    "com.kartezy.encryptionservice",
    "com.kartezy.shared.security.encryption"
})
public class EncryptionServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EncryptionServiceApplication.class, args);
    }
}