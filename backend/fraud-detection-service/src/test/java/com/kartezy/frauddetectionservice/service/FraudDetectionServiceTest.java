package com.kartezy.frauddetectionservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class FraudDetectionServiceTest {

    private FraudDetectionService fraudDetectionService;

    @BeforeEach
    void setUp() {
        fraudDetectionService = new FraudDetectionService();
    }

    @Test
    void testCheckOrderFraud_LowAmountApproved() {
        Map<String, Object> order = Map.of(
                "orderId", "ORD-001", "userId", "USR-001", "amount", 500.0,
                "paymentMethod", "UPI", "ipAddress", "192.168.1.1"
        );
        Map<String, Object> result = fraudDetectionService.checkOrderFraud(order);
        assertNotNull(result);
        assertFalse((boolean) result.get("isFraudulent"));
        assertEquals("APPROVE", result.get("recommendedAction"));
    }

    @Test
    void testCheckOrderFraud_HighAmountTriggersReview() {
        Map<String, Object> order = Map.of(
                "orderId", "ORD-002", "userId", "USR-002", "amount", 50000.0,
                "paymentMethod", "COD", "ipAddress", "10.0.0.1"
        );
        Map<String, Object> result = fraudDetectionService.checkOrderFraud(order);
        assertNotNull(result);
        assertTrue((double) result.get("fraudScore") > 0);
    }

    @Test
    void testCheckOrderFraud_VelocityCheck() {
        // Simulate multiple rapid orders
        for (int i = 0; i < 7; i++) {
            fraudDetectionService.checkOrderFraud(Map.of(
                    "orderId", "ORD-RAPID-" + i, "userId", "USR-RAPID",
                    "amount", 100.0, "paymentMethod", "UPI"
            ));
        }
        Map<String, Object> result = fraudDetectionService.checkOrderFraud(Map.of(
                "orderId", "ORD-RAPID-7", "userId", "USR-RAPID",
                "amount", 100.0, "paymentMethod", "UPI"
        ));
        assertNotNull(result);
        assertTrue((double) result.get("fraudScore") > 0);
    }

    @Test
    void testCheckAccountFraud_NewAccount() {
        Map<String, Object> account = Map.of(
                "userId", "USR-NEW", "email", "test12345@spam.com",
                "createdAt", java.time.LocalDateTime.now().minusHours(1).format(java.time.format.DateTimeFormatter.ISO_DATE_TIME)
        );
        Map<String, Object> result = fraudDetectionService.checkAccountFraud(account);
        assertNotNull(result);
        assertTrue((double) result.get("fraudScore") > 0);
    }

    @Test
    void testCheckPaymentFraud_HighRiskMethod() {
        Map<String, Object> payment = Map.of(
                "transactionId", "TXN-001", "paymentMethod", "CRYPTO",
                "amount", 1000.0, "currency", "INR"
        );
        Map<String, Object> result = fraudDetectionService.checkPaymentFraud(payment);
        assertNotNull(result);
        assertTrue((double) result.get("fraudScore") > 0.2);
    }

    @Test
    void testCheckPromotionAbuse_NormalUsage() {
        Map<String, Object> promo = Map.of(
                "userId", "USR-NORMAL", "couponCode", "WELCOME10", "promoType", "WELCOME"
        );
        Map<String, Object> result = fraudDetectionService.checkPromotionAbuse(promo);
        assertNotNull(result);
        assertNotNull(result.get("abuseScore"));
        assertNotNull(result.get("recommendedAction"));
    }

    @Test
    void testCheckLoginFraud_NormalLogin() {
        Map<String, Object> login = Map.of(
                "userId", "USR-NORMAL", "ipAddress", "203.0.113.1",
                "deviceId", "DEVICE-001", "location", "Mumbai", "usualLocation", "Mumbai"
        );
        Map<String, Object> result = fraudDetectionService.checkLoginFraud(login);
        assertNotNull(result);
        assertNotNull(result.get("riskScore"));
        assertNotNull(result.get("recommendedAction"));
    }

    @Test
    void testCheckReturnFraud_ReturnsResult() {
        Map<String, Object> returnReq = Map.of(
                "returnId", "RET-001", "userId", "USR-001",
                "returnAmount", 500.0, "orderAmount", 1000.0, "reason", "Defective product"
        );
        Map<String, Object> result = fraudDetectionService.checkReturnFraud(returnReq);
        assertNotNull(result);
        assertNotNull(result.get("fraudScore"));
        assertNotNull(result.get("recommendedAction"));
    }

    @Test
    void testRetrainModels_ReturnsSuccess() {
        Map<String, Object> result = fraudDetectionService.retrainModels(Map.of("modelType", "FRAUD"));
        assertNotNull(result);
        assertEquals("RETRAINING_COMPLETED", result.get("status"));
    }

    @Test
    void testGetRecentAlerts_ReturnsList() {
        // Generate some alerts first
        fraudDetectionService.checkOrderFraud(Map.of(
                "orderId", "ORD-ALERT", "userId", "USR-ALERT",
                "amount", 100000.0, "paymentMethod", "COD"
        ));
        List<Map<String, Object>> alerts = fraudDetectionService.getRecentAlerts(10);
        assertNotNull(alerts);
    }
}
