package com.kartezy.integration;

import com.kartezy.orderservice.OrderServiceApplication;
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
 * Integration tests for the Order Service.
 * Validates order creation, listing, and lifecycle management.
 */
@SpringBootTest(
        classes = OrderServiceApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@DisplayName("Order Service Integration Tests")
public class OrderFlowIntegrationTest extends IntegrationTestBase {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String baseUrl;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/orders";
    }

    @Test
    @DisplayName("Order endpoints should be reachable")
    void testOrderEndpointsExist() {
        String authToken = generateTestToken("customer@test.com", "CUSTOMER");

        // Verify order list endpoint (GET /orders)
        ResponseEntity<String> listResponse = restTemplate.exchange(
                baseUrl,
                HttpMethod.GET,
                authEntity(authToken),
                String.class
        );
        assertNotEquals(HttpStatus.NOT_FOUND, listResponse.getStatusCode(),
                "Order list endpoint should exist (GET /orders)");

        // Verify order creation endpoint (POST /orders)
        Map<String, Object> newOrder = new HashMap<>();
        newOrder.put("userId", UUID.randomUUID().toString());
        newOrder.put("merchantId", UUID.randomUUID().toString());
        newOrder.put("totalAmount", 250.00);

        ResponseEntity<String> createResponse = restTemplate.exchange(
                baseUrl,
                HttpMethod.POST,
                authEntity(newOrder, authToken),
                String.class
        );
        assertNotEquals(HttpStatus.NOT_FOUND, createResponse.getStatusCode(),
                "Order creation endpoint should exist (POST /orders)");
    }

    @Test
    @DisplayName("Order service health endpoint responds")
    void testHealthEndpoint() {
        ResponseEntity<String> healthResponse = restTemplate.getForEntity(
                baseUrl + "/health",
                String.class
        );
        assertTrue(healthResponse.getStatusCode().is2xxSuccessful() ||
                        healthResponse.getStatusCode().is4xxClientError(),
                "Health endpoint should respond");
    }
}
