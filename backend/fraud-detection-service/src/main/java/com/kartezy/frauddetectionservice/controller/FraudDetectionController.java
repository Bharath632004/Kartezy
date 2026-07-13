package com.kartezy.frauddetectionservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for fraud detection service.
 * Provides endpoints for fraud detection operations.
 */
@RestController
@RequestMapping("/api/fraud-detection")
public class FraudDetectionController {

    /**
     * Health check endpoint.
     * @return a simple status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Fraud detection service is healthy");
    }

    // TODO: Add fraud detection endpoints here
    // Example endpoints could include:
    // - POST /analyze-transaction - to analyze a transaction for fraud
    // - GET /alerts/{userId} - to get fraud alerts for a user
    // - etc.

}