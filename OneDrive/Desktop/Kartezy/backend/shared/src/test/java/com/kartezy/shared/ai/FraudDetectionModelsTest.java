package com.kartezy.shared.ai;

import com.kartezy.shared.ai.FraudDetectionModels.*;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

class FraudDetectionModelsTest {

    @Test
    void testFraudCheckRequest() {
        FraudCheckRequest request = new FraudCheckRequest();
        request.setTransactionId("txn1");
        request.setUserId("user1");
        request.setAmount(25000.0);
        request.setPaymentMethod("UPI");
        request.setIpAddress("192.168.1.1");
        request.setDeviceId("device1");
        request.setTimestamp(System.currentTimeMillis());

        assertEquals("txn1", request.getTransactionId());
        assertEquals("user1", request.getUserId());
        assertEquals(25000.0, request.getAmount());
        assertEquals("UPI", request.getPaymentMethod());
    }

    @Test
    void testFraudCheckResult() {
        FraudCheckResult result = new FraudCheckResult("txn1");
        result.setFraudScore(0.85);
        result.setFraudulent(true);
        result.setRecommendedAction("REVIEW");
        result.setSeverity("HIGH");
        result.addReason("Amount exceeds threshold");
        result.addFactor("amount", 0.8);

        assertTrue(result.isFraudulent());
        assertEquals(0.85, result.getFraudScore());
        assertEquals("REVIEW", result.getRecommendedAction());
        assertEquals("HIGH", result.getSeverity());
        assertEquals(1, result.getReasons().size());
        assertEquals(0.8, result.getFactorScores().get("amount"));
    }

    @Test
    void testFraudIndicator() {
        FraudIndicator indicator = new FraudIndicator("VELOCITY", "High order frequency", 0.6, 0.8);
        indicator.setEvidence(Map.of("ordersLastHour", 15));
        assertEquals("VELOCITY", indicator.getType());
        assertEquals(0.6, indicator.getWeight());
        assertEquals(0.8, indicator.getScore());
        assertEquals(15, indicator.getEvidence().get("ordersLastHour"));
    }

    @Test
    void testFraudAlert() {
        FraudAlert alert = new FraudAlert("alert1", "txn1", "user1", "ORDER_FRAUD", "HIGH", "Suspicious order pattern", 0.85);
        assertEquals("alert1", alert.getAlertId());
        assertEquals("txn1", alert.getTransactionId());
        assertEquals("user1", alert.getUserId());
        assertEquals("OPEN", alert.getStatus());
        assertEquals(0.85, alert.getScore());
        assertTrue(alert.getTimestamp() > 0);
    }

    @Test
    void testUserBehaviorProfile() {
        UserBehaviorProfile profile = new UserBehaviorProfile("user1");
        profile.setAverageOrderValue(450.0);
        profile.setOrderFrequency(3.5);
        profile.setTypicalLocation("Mumbai");
        profile.getTypicalDevices().add("device1");
        profile.getTypicalPaymentMethods().add("UPI");
        profile.addBehavioralFeature("eveningShopper", 0.7);

        assertEquals("user1", profile.getUserId());
        assertEquals(450.0, profile.getAverageOrderValue());
        assertEquals(3.5, profile.getOrderFrequency());
        assertEquals(1, profile.getTypicalDevices().size());
        assertEquals(0.7, profile.getBehavioralFeatures().get("eveningShopper"));
    }
}
