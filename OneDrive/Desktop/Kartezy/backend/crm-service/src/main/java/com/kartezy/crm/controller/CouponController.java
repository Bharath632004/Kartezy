package com.kartezy.crm.controller;

import com.kartezy.crm.entity.Coupon;
import com.kartezy.crm.exception.CrmException;
import com.kartezy.crm.repository.CouponRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/crm/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons & Rewards", description = "Coupon creation, distribution, and redemption")
public class CouponController {

    private final CouponRepository couponRepository;

    @PostMapping
    @Operation(summary = "Create a coupon")
    public ResponseEntity<Map<String, Object>> createCoupon(@RequestBody Coupon coupon) {
        if (coupon.getCode() == null || coupon.getCode().isBlank()) {
            coupon.setCode("CPN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        coupon.setStatus("ACTIVE");
        coupon.setUsageCount(0);
        Coupon saved = couponRepository.save(coupon);
        return ResponseEntity.ok(wrapResponse(saved, "Coupon created"));
    }

    @GetMapping
    @Operation(summary = "Get all coupons")
    public ResponseEntity<Map<String, Object>> getAllCoupons(Pageable pageable) {
        Page<Coupon> coupons = couponRepository.findAll(pageable);
        return ResponseEntity.ok(wrapResponse(coupons, "Coupons retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get coupon details")
    public ResponseEntity<Map<String, Object>> getCoupon(@PathVariable Long id) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new CrmException("Coupon not found: " + id));
        return ResponseEntity.ok(wrapResponse(coupon, "Coupon retrieved"));
    }

    @GetMapping("/code/{code}")
    @Operation(summary = "Validate coupon code")
    public ResponseEntity<Map<String, Object>> validateCoupon(@PathVariable String code) {
        Coupon coupon = couponRepository.findByCode(code)
            .orElseThrow(() -> new CrmException("Invalid coupon code: " + code));

        if (!"ACTIVE".equals(coupon.getStatus())) {
            throw new CrmException("Coupon is not active");
        }
        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDate.now())) {
            throw new CrmException("Coupon has expired");
        }
        if (coupon.getUsageLimit() != null && coupon.getUsageCount() >= coupon.getUsageLimit()) {
            throw new CrmException("Coupon usage limit exhausted");
        }

        return ResponseEntity.ok(wrapResponse(coupon, "Coupon is valid"));
    }

    @PostMapping("/{id}/redeem")
    @Operation(summary = "Redeem a coupon")
    public ResponseEntity<Map<String, Object>> redeemCoupon(@PathVariable Long id, @RequestParam Long orderId) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new CrmException("Coupon not found: " + id));
        coupon.setStatus("USED");
        coupon.setUsageCount(coupon.getUsageCount() + 1);
        coupon.setUsedOrderId(orderId);
        coupon.setUsedAt(java.time.LocalDateTime.now());
        couponRepository.save(coupon);
        return ResponseEntity.ok(wrapResponse(coupon, "Coupon redeemed"));
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
