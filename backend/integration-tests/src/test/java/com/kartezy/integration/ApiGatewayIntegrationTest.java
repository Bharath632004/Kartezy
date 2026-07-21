package com.kartezy.integration;

import com.kartezy.paymentservice.PaymentServiceApplication;
import com.kartezy.deliveryservice.DeliveryServiceApplication;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for Payment and Delivery services.
 * Validates HTTP endpoints for payment processing and delivery management.
 */
@SpringBootTest(
        classes = {
                PaymentServiceApplication.class,
                DeliveryServiceApplication.class
        },
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@DisplayName("Payment & Delivery Integration Tests")
public class ApiGatewayIntegrationTest extends IntegrationTestBase {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String baseUrl;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port;
    }

    @Test
    @DisplayName("Payment endpoints should be reachable")
    void testPaymentEndpoints() {
        String authToken = generateTestToken("customer@test.com", "CUSTOMER");

        // Verify payment endpoint exists
        Map<String, Object> paymentRequest = new HashMap<>();
        paymentRequest.put("orderId", UUID.randomUUID().toString());
        paymentRequest.put("amount", 100.00);
        paymentRequest.put("paymentMethod", "WALLET");

        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/payments",
                HttpMethod.POST,
                authEntity(paymentRequest, authToken),
                String.class
        );
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode(),
                "Payment endpoint should exist (POST /payments)");
    }

    @Test
    @DisplayName("Delivery endpoints should be reachable")
    void testDeliveryEndpoints() {
        String authToken = generateTestToken("customer@test.com", "CUSTOMER");

        // Verify delivery assignment endpoint
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/delivery/assignments/order/" + UUID.randomUUID(),
                HttpMethod.GET,
                authEntity(authToken),
                String.class
        );
        assertNotEquals(HttpStatus.NOT_FOUND, response.getStatusCode(),
                "Delivery assignment endpoint should exist");
    }

    @Test
    @DisplayName("Health endpoints should respond")
    void testHealthEndpoints() {
        // Payment service health
        ResponseEntity<String> paymentHealth = restTemplate.getForEntity(
                baseUrl + "/actuator/health",
                String.class
        );
        assertNotNull(paymentHealth.getBody(), "Health check should return response body");
    }
}
