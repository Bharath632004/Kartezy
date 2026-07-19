package com.kartezy.crm.controller;

import com.kartezy.crm.entity.CustomerProfile;
import com.kartezy.crm.service.CustomerCrmService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crm/customers")
@RequiredArgsConstructor
@Tag(name = "Customer CRM", description = "Customer profile management and CRM")
public class CustomerCrmController {

    private final CustomerCrmService customerService;

    @PostMapping
    @Operation(summary = "Create customer CRM profile")
    public ResponseEntity<Map<String, Object>> createProfile(@RequestBody CustomerProfile profile) {
        CustomerProfile created = customerService.createProfile(profile);
        return ResponseEntity.ok(wrapResponse(created, "Customer profile created"));
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get customer profile by user ID")
    public ResponseEntity<Map<String, Object>> getProfile(@PathVariable Long userId) {
        CustomerProfile profile = customerService.getByUserId(userId);
        return ResponseEntity.ok(wrapResponse(profile, "Customer profile retrieved"));
    }

    @GetMapping
    @Operation(summary = "Get all customer profiles")
    public ResponseEntity<Map<String, Object>> getAllProfiles(Pageable pageable) {
        Page<CustomerProfile> profiles = customerService.getAll(pageable);
        return ResponseEntity.ok(wrapResponse(profiles, "Customer profiles retrieved"));
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Update customer profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@PathVariable Long userId, @RequestBody CustomerProfile updates) {
        CustomerProfile updated = customerService.updateProfile(userId, updates);
        return ResponseEntity.ok(wrapResponse(updated, "Customer profile updated"));
    }

    @PostMapping("/{userId}/order")
    @Operation(summary = "Record an order for a customer")
    public ResponseEntity<Map<String, Object>> recordOrder(@PathVariable Long userId, @RequestParam java.math.BigDecimal amount) {
        CustomerProfile profile = customerService.recordOrder(userId, amount);
        return ResponseEntity.ok(wrapResponse(profile, "Order recorded"));
    }

    @GetMapping("/high-value")
    @Operation(summary = "Get high-value customers")
    public ResponseEntity<Map<String, Object>> getHighValueCustomers() {
        List<CustomerProfile> customers = customerService.findHighValueCustomers();
        return ResponseEntity.ok(wrapResponse(customers, "High-value customers retrieved"));
    }

    @GetMapping("/churned")
    @Operation(summary = "Get churned customers")
    public ResponseEntity<Map<String, Object>> getChurnedCustomers() {
        List<CustomerProfile> customers = customerService.findChurnedCustomers();
        return ResponseEntity.ok(wrapResponse(customers, "Churned customers retrieved"));
    }

    private Map<String, Object> wrapResponse(Object data, String message) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", data);
        response.put("message", message);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
