package com.kartezy.catalogservice.controller;
import com.kartezy.catalogservice.dto.ProductDto;
import com.kartezy.catalogservice.entity.Category;
import com.kartezy.catalogservice.entity.Product;
import com.kartezy.catalogservice.repository.CategoryRepository;
import com.kartezy.catalogservice.repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.*;
import java.util.List;
import java.util.stream.Collectors;
@PreAuthorize("isAuthenticated()")
@RestController
@RequestMapping("/api/products")
@AllArgsConstructor
public class ProductController {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    @GetMapping
    public ResponseEntity<List<ProductDto>> getList() {
        List<Product> products = productRepository.findAll();
        List<ProductDto> dtos = products.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getDetail(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<ProductDto> create(@RequestBody ProductDto dto) {
        Product product = toEntity(dto);
        product = productRepository.save(product);
        return ResponseEntity.ok(toDto(product));
    }
    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductDto> updateStock(@PathVariable Long id, @RequestParam Integer quantity) {
        return productRepository.findById(id)
                .map(p -> {
                    p.setStockQuantity(quantity);
                    p = productRepository.save(p);
                    return ResponseEntity.ok(toDto(p));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> update(@PathVariable Long id, @RequestBody ProductDto dto) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dto.setId(id);
        Product product = toEntity(dto);
        product = productRepository.save(product);
        return ResponseEntity.ok(toDto(product));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    private ProductDto toDto(Product entity) {
        return ProductDto.builder()
                .id(entity.getId())
                .sku(entity.getSku())
                .name(entity.getName())
                .description(entity.getDescription())
                .price(entity.getPrice() == null ? null : entity.getPrice().doubleValue())
                .stockQuantity(entity.getStockQuantity())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                .active(entity.isActive())
                .build();
    }
    private Product toEntity(ProductDto dto) {
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        }
        return Product.builder()
                .id(dto.getId())
                .sku(dto.getSku())
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice() == null ? null : java.math.BigDecimal.valueOf(dto.getPrice()))
                .stockQuantity(dto.getStockQuantity())
                .category(category)
                .active(dto.getActive())
                .build();
    }
}