package com.kartezy.catalogservice.controller;

import com.kartezy.catalogservice.dto.*;
import com.kartezy.catalogservice.service.CatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final CatalogService catalogService;

    @GetMapping
    public ResponseEntity<List<ProductEnhancedDto>> getAllProducts() {
        return ResponseEntity.ok(catalogService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductEnhancedDto> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(catalogService.getProduct(id));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductEnhancedDto>> getByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(catalogService.getProductsByCategory(categoryId));
    }

    @GetMapping("/merchant/{merchantId}")
    public ResponseEntity<List<ProductEnhancedDto>> getByMerchant(@PathVariable Long merchantId) {
        return ResponseEntity.ok(catalogService.getProductsByMerchant(merchantId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ProductEnhancedDto>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(catalogService.getProductsByStatus(status));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductSearchDto>> search(@RequestParam String q) {
        return ResponseEntity.ok(catalogService.searchProducts(q));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductEnhancedDto> createProduct(@Valid @RequestBody ProductEnhancedDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.createProduct(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductEnhancedDto> updateProduct(@PathVariable Long id,
                                                             @Valid @RequestBody ProductEnhancedDto dto) {
        return ResponseEntity.ok(catalogService.updateProduct(id, dto));
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductEnhancedDto> updateStock(@PathVariable Long id,
                                                           @RequestBody Map<String, Integer> body) {
        return ResponseEntity.ok(catalogService.updateStock(id, body.get("quantity")));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        catalogService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // Brand endpoints
    @GetMapping("/brands")
    public ResponseEntity<List<BrandDto>> getBrands() {
        return ResponseEntity.ok(catalogService.getBrands());
    }

    @PostMapping("/brands")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandDto> createBrand(@Valid @RequestBody BrandDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.createBrand(dto));
    }
}
