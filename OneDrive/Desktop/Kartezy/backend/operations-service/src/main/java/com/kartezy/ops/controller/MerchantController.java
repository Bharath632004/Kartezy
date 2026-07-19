package com.kartezy.ops.controller;

import com.kartezy.ops.entity.MerchantOperation;
import com.kartezy.ops.service.MerchantOpsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ops/merchants")
@RequiredArgsConstructor
public class MerchantController {

    private final MerchantOpsService merchantOpsService;

    @GetMapping("/{merchantId}")
    public ResponseEntity<MerchantOperation> getMerchantOperation(@PathVariable Long merchantId) {
        return ResponseEntity.ok(merchantOpsService.getMerchantOperation(merchantId));
    }

    @GetMapping("/verification/{status}")
    public ResponseEntity<List<MerchantOperation>> getByVerificationStatus(@PathVariable String status) {
        return ResponseEntity.ok(merchantOpsService.getMerchantsByVerificationStatus(status));
    }

    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<MerchantOperation>> getByCity(@PathVariable Long cityId) {
        return ResponseEntity.ok(merchantOpsService.getMerchantsByCity(cityId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<MerchantOperation>> getPendingVerifications() {
        return ResponseEntity.ok(merchantOpsService.getPendingVerifications());
    }

    @PostMapping
    public ResponseEntity<MerchantOperation> createMerchantOperation(@RequestBody MerchantOperation mo) {
        return ResponseEntity.ok(merchantOpsService.createMerchantOperation(mo));
    }

    @PostMapping("/{merchantId}/verify")
    public ResponseEntity<MerchantOperation> verifyMerchant(@PathVariable Long merchantId, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(merchantOpsService.verifyMerchant(merchantId, body.get("verifiedBy")));
    }

    @PostMapping("/{merchantId}/suspend")
    public ResponseEntity<MerchantOperation> suspendMerchant(@PathVariable Long merchantId, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(merchantOpsService.suspendMerchant(merchantId, body.get("reason")));
    }

    @GetMapping("/stats/by-verification")
    public ResponseEntity<List<Object[]>> getVerificationStats() {
        return ResponseEntity.ok(merchantOpsService.getMerchantCountByVerificationStatus());
    }

    @GetMapping("/stats/by-type")
    public ResponseEntity<List<Object[]>> getBusinessTypeStats() {
        return ResponseEntity.ok(merchantOpsService.getMerchantCountByBusinessType());
    }
}
