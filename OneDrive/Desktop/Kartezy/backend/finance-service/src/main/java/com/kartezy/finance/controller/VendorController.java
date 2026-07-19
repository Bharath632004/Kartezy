package com.kartezy.finance.controller;

import com.kartezy.finance.entity.Vendor;
import com.kartezy.finance.service.VendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/finance/vendors")
@RequiredArgsConstructor
@Tag(name = "Vendors", description = "Vendor management")
public class VendorController {

    private final VendorService vendorService;

    @PostMapping
    @Operation(summary = "Create a new vendor")
    public ResponseEntity<Map<String, Object>> createVendor(@RequestBody Vendor vendor) {
        Vendor created = vendorService.createVendor(vendor);
        return ResponseEntity.ok(wrapResponse(created, "Vendor created"));
    }

    @GetMapping
    @Operation(summary = "Get all vendors with pagination and filters")
    public ResponseEntity<Map<String, Object>> getVendors(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String search,
        Pageable pageable) {
        Page<Vendor> vendors = vendorService.getVendors(status, search, pageable);
        return ResponseEntity.ok(wrapResponse(vendors, "Vendors retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vendor details")
    public ResponseEntity<Map<String, Object>> getVendor(@PathVariable Long id) {
        Vendor vendor = vendorService.getVendor(id);
        return ResponseEntity.ok(wrapResponse(vendor, "Vendor retrieved"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vendor details")
    public ResponseEntity<Map<String, Object>> updateVendor(@PathVariable Long id, @RequestBody Vendor vendor) {
        Vendor updated = vendorService.updateVendor(id, vendor);
        return ResponseEntity.ok(wrapResponse(updated, "Vendor updated"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Soft delete a vendor")
    public ResponseEntity<Map<String, Object>> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.ok(wrapResponse(null, "Vendor deleted"));
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
