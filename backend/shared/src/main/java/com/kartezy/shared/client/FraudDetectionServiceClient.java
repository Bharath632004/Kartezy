package com.kartezy.shared.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

/**
 * Feign client for the Fraud Detection Service.
 */
@FeignClient(name = "fraud-detection-service", path = "/fraud")
public interface FraudDetectionServiceClient {

    @PostMapping("/check/order")
    Map<String, Object> checkOrderForFraud(@RequestBody Map<String, Object> orderDetails);

    @PostMapping("/check/account")
    Map<String, Object> checkAccountForFraud(@RequestBody Map<String, Object> accountDetails);

    @PostMapping("/check/payment")
    Map<String, Object> checkPaymentForFraud(@RequestBody Map<String, Object> paymentDetails);

    @PostMapping("/check/promotion")
    Map<String, Object> checkPromotionAbuse(@RequestBody Map<String, Object> promoUsage);

    @PostMapping("/check/login")
    Map<String, Object> checkLoginForFraud(@RequestBody Map<String, Object> loginAttempt);

    @PostMapping("/check/return")
    Map<String, Object> checkReturnForFraud(@RequestBody Map<String, Object> returnRequest);

    @PostMapping("/model/retrain")
    Map<String, String> retrainFraudModels(@RequestBody Map<String, Object> request);

    @GetMapping("/alerts/recent")
    List<Map<String, Object>> getRecentFraudAlerts(@RequestParam int limit);
}