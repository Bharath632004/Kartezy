package com.kartezy.frauddetectionservice.controller;

import com.kartezy.frauddetectionservice.service.FraudDetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/fraud")
public class FraudDetectionController {

    @Autowired
    private FraudDetectionService fraudDetectionService;

    @PostMapping("/check/order")
    public ResponseEntity<Map<String, Object>> checkOrderFraud(@RequestBody Map<String, Object> orderDetails) {
        return ResponseEntity.ok(fraudDetectionService.checkOrderFraud(orderDetails));
    }

    @PostMapping("/check/account")
    public ResponseEntity<Map<String, Object>> checkAccountFraud(@RequestBody Map<String, Object> accountDetails) {
        return ResponseEntity.ok(fraudDetectionService.checkAccountFraud(accountDetails));
    }

    @PostMapping("/check/payment")
    public ResponseEntity<Map<String, Object>> checkPaymentFraud(@RequestBody Map<String, Object> paymentDetails) {
        return ResponseEntity.ok(fraudDetectionService.checkPaymentFraud(paymentDetails));
    }

    @PostMapping("/check/promotion")
    public ResponseEntity<Map<String, Object>> checkPromotionAbuse(@RequestBody Map<String, Object> promoUsage) {
        return ResponseEntity.ok(fraudDetectionService.checkPromotionAbuse(promoUsage));
    }

    @PostMapping("/check/login")
    public ResponseEntity<Map<String, Object>> checkLoginFraud(@RequestBody Map<String, Object> loginAttempt) {
        return ResponseEntity.ok(fraudDetectionService.checkLoginFraud(loginAttempt));
    }

    @PostMapping("/check/return")
    public ResponseEntity<Map<String, Object>> checkReturnFraud(@RequestBody Map<String, Object> returnRequest) {
        return ResponseEntity.ok(fraudDetectionService.checkReturnFraud(returnRequest));
    }

    @PostMapping("/model/retrain")
    public ResponseEntity<Map<String, String>> retrainModels(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(fraudDetectionService.retrainModels(request));
    }

    @GetMapping("/alerts/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentAlerts(@RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(fraudDetectionService.getRecentAlerts(limit));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "fraud-detection-service"));
    }
}
