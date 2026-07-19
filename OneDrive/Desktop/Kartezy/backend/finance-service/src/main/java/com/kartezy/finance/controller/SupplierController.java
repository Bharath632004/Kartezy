package com.kartezy.finance.controller;

import com.kartezy.finance.entity.Supplier;
import com.kartezy.finance.service.SupplierService;
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
@RequestMapping("/api/finance/suppliers")
@RequiredArgsConstructor
@Tag(name = "Suppliers", description = "Supplier management")
public class SupplierController {

    private final SupplierService supplierService;

    @PostMapping
    @Operation(summary = "Create a new supplier")
    public ResponseEntity<Map<String, Object>> createSupplier(@RequestBody Supplier supplier) {
        Supplier created = supplierService.createSupplier(supplier);
        return ResponseEntity.ok(wrapResponse(created, "Supplier created"));
    }

    @GetMapping
    @Operation(summary = "Get all suppliers with pagination and status filter")
    public ResponseEntity<Map<String, Object>> getSuppliers(
        @RequestParam(required = false) String status,
        Pageable pageable) {
        Page<Supplier> suppliers = supplierService.getSuppliers(status, pageable);
        return ResponseEntity.ok(wrapResponse(suppliers, "Suppliers retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get supplier details")
    public ResponseEntity<Map<String, Object>> getSupplier(@PathVariable Long id) {
        Supplier supplier = supplierService.getSupplier(id);
        return ResponseEntity.ok(wrapResponse(supplier, "Supplier retrieved"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update supplier details")
    public ResponseEntity<Map<String, Object>> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        Supplier updated = supplierService.updateSupplier(id, supplier);
        return ResponseEntity.ok(wrapResponse(updated, "Supplier updated"));
    }

    @GetMapping("/preferred")
    @Operation(summary = "Get preferred suppliers")
    public ResponseEntity<Map<String, Object>> getPreferredSuppliers() {
        List<Supplier> suppliers = supplierService.getPreferredSuppliers();
        return ResponseEntity.ok(wrapResponse(suppliers, "Preferred suppliers retrieved"));
    }

    @GetMapping("/expiring-contracts")
    @Operation(summary = "Get suppliers with expiring contracts")
    public ResponseEntity<Map<String, Object>> getExpiringContracts() {
        List<Supplier> suppliers = supplierService.getExpiringContracts();
        return ResponseEntity.ok(wrapResponse(suppliers, "Expiring contracts retrieved"));
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
