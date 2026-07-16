package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.service.AIServiceFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/v1/fraud")
public class FraudDetectionController {

    @Autowired
    private AIServiceFacade aiServiceFacade;

    @PostMapping("/check/order")
    public Map<String, Object> checkOrderForFraud(@RequestBody Map<String, Object> orderDetails) {
        Map<String, Object> result = aiServiceFacade.checkOrderFraud(orderDetails);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @PostMapping("/check/account")
    public Map<String, Object> checkAccountForFraud(@RequestBody Map<String, Object> accountDetails) {
        Map<String, Object> result = aiServiceFacade.checkAccountFraud(accountDetails);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @PostMapping("/check/payment")
    public Map<String, Object> checkPaymentForFraud(@RequestBody Map<String, Object> paymentDetails) {
        Map<String, Object> result = aiServiceFacade.checkPaymentFraud(paymentDetails);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @PostMapping("/check/promotion")
    public Map<String, Object> checkPromotionAbuse(@RequestBody Map<String, Object> promoUsage) {
        Map<String, Object> result = aiServiceFacade.checkPromotionAbuse(promoUsage);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @PostMapping("/check/login")
    public Map<String, Object> checkLoginForFraud(@RequestBody Map<String, Object> loginAttempt) {
        Map<String, Object> result = aiServiceFacade.checkLoginFraud(loginAttempt);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @PostMapping("/check/return")
    public Map<String, Object> checkReturnForFraud(@RequestBody Map<String, Object> returnRequest) {
        Map<String, Object> result = aiServiceFacade.checkReturnFraud(returnRequest);
        result.put("checkedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @PostMapping("/model/retrain")
    public Map<String, String> retrainFraudModels(@RequestBody Map<String, Object> request) {
        return aiServiceFacade.retrainFraudModels(request);
    }

    @GetMapping("/alerts/recent")
    public List<Map<String, Object>> getRecentFraudAlerts(@RequestParam(defaultValue = "20") int limit) {
        return aiServiceFacade.getRecentFraudAlerts(limit);
    }
}
