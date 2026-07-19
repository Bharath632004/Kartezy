package com.kartezy.ops.controller;

import com.kartezy.ops.entity.CustomerOperation;
import com.kartezy.ops.service.CustomerOpsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ops/customers")
@RequiredArgsConstructor
public class CustomerOpsController {

    private final CustomerOpsService customerOpsService;

    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerOperation> getCustomerOperation(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerOpsService.getCustomerOperation(customerId));
    }

    @GetMapping("/kyc-status/{status}")
    public ResponseEntity<List<CustomerOperation>> getByKycStatus(@PathVariable String status) {
        return ResponseEntity.ok(customerOpsService.getCustomersByKycStatus(status));
    }

    @GetMapping("/blacklisted")
    public ResponseEntity<List<CustomerOperation>> getBlacklisted() {
        return ResponseEntity.ok(customerOpsService.getBlacklistedCustomers());
    }

    @PostMapping
    public ResponseEntity<CustomerOperation> createCustomerOperation(@RequestBody CustomerOperation co) {
        return ResponseEntity.ok(customerOpsService.createCustomerOperation(co));
    }

    @PatchMapping("/{customerId}/kyc")
    public ResponseEntity<CustomerOperation> updateKycStatus(@PathVariable Long customerId, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(customerOpsService.updateKycStatus(customerId, body.get("kycStatus")));
    }

    @PostMapping("/{customerId}/blacklist")
    public ResponseEntity<CustomerOperation> blacklist(@PathVariable Long customerId, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(customerOpsService.blacklistCustomer(customerId, body.get("reason")));
    }

    @PostMapping("/{customerId}/unblacklist")
    public ResponseEntity<CustomerOperation> unblacklist(@PathVariable Long customerId) {
        return ResponseEntity.ok(customerOpsService.unblacklistCustomer(customerId));
    }

    @GetMapping("/stats/kyc")
    public ResponseEntity<List<Object[]>> getKycStats() {
        return ResponseEntity.ok(customerOpsService.getKycStatusCounts());
    }
}
