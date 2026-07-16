package com.kartezy.catalogservice.service;

import com.kartezy.catalogservice.dto.*;
import com.kartezy.catalogservice.entity.*;
import com.kartezy.catalogservice.entity.Product.ProductStatus;
import com.kartezy.catalogservice.repository.*;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CatalogService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductVariantRepository variantRepository;

    public ProductEnhancedDto getProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        return toEnhancedDto(product);
    }

    public List<ProductEnhancedDto> getAllProducts() {
        return productRepository.findAll().stream()
            .map(this::toEnhancedDto).collect(Collectors.toList());
    }

    public List<ProductEnhancedDto> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
            .map(this::toEnhancedDto).collect(Collectors.toList());
    }

    public List<ProductEnhancedDto> getProductsByMerchant(Long merchantId) {
        return productRepository.findByMerchantId(merchantId).stream()
            .map(this::toEnhancedDto).collect(Collectors.toList());
    }

    public List<ProductEnhancedDto> getProductsByStatus(String statusStr) {
        ProductStatus status = ProductStatus.valueOf(statusStr.toUpperCase());
        return productRepository.findByStatus(status).stream()
            .map(this::toEnhancedDto).collect(Collectors.toList());
    }

    public List<ProductEnhancedDto.ProductSearchDto> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query).stream()
            .map(this::toSearchDto).collect(Collectors.toList());
    }

    @Transactional
    public ProductEnhancedDto createProduct(ProductEnhancedDto dto) {
        if (productRepository.findBySku(dto.getSku()).isPresent()) {
            throw new BadRequestException("SKU already exists: " + dto.getSku());
        }

        ProductStatus status;
        try {
            status = ProductStatus.valueOf(dto.getStatus() != null ? dto.getStatus().toUpperCase() : "ACTIVE");
        } catch (IllegalArgumentException e) {
            status = ProductStatus.ACTIVE;
        }

        Product product = Product.builder()
            .name(dto.getName()).description(dto.getDescription())
            .shortDescription(dto.getShortDescription()).sku(dto.getSku())
            .barcode(dto.getBarcode()).categoryId(dto.getCategoryId())
            .merchantId(dto.getMerchantId()).brandId(dto.getBrandId())
            .price(dto.getPrice()).compareAtPrice(dto.getCompareAtPrice())
            .costPrice(dto.getCostPrice()).taxRate(dto.getTaxRate() != null ? dto.getTaxRate() : 0.0)
            .weight(dto.getWeight()).weightUnit(dto.getWeightUnit())
            .unit(dto.getUnit()).stock(dto.getStock() != null ? dto.getStock() : 0)
            .status(status).images(dto.getImages()).videoUrl(dto.getVideoUrl())
            .seoTitle(dto.getSeoTitle()).seoDescription(dto.getSeoDescription())
            .metaKeywords(dto.getMetaKeywords()).hasVariants(false)
            .isReturnable(dto.isReturnable()).isCancellable(dto.isCancellable())
            .tags(dto.getTags()).sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
            .build();

        product = productRepository.save(product);

        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            product.setHasVariants(true);
            for (ProductEnhancedDto.ProductVariantDto vDto : dto.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                    .productId(product.getId()).sku(vDto.getSku()).name(vDto.getName())
                    .price(vDto.getPrice()).compareAtPrice(vDto.getCompareAtPrice() != null ? vDto.getCompareAtPrice() : BigDecimal.ZERO)
                    .option1Name(vDto.getOption1Name()).option1Value(vDto.getOption1Value())
                    .option2Name(vDto.getOption2Name()).option2Value(vDto.getOption2Value())
                    .option3Name(vDto.getOption3Name()).option3Value(vDto.getOption3Value())
                    .stock(vDto.getStock() != null ? vDto.getStock() : 0)
                    .imageUrl(vDto.getImageUrl()).build();
                variantRepository.save(variant);
            }
            productRepository.save(product);
        }

        log.info("Product created: {} with SKU: {}", product.getId(), product.getSku());
        return toEnhancedDto(product);
    }

    @Transactional
    public ProductEnhancedDto updateProduct(Long id, ProductEnhancedDto dto) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setShortDescription(dto.getShortDescription());
        product.setPrice(dto.getPrice());
        product.setCompareAtPrice(dto.getCompareAtPrice());
        product.setCostPrice(dto.getCostPrice());
        product.setTaxRate(dto.getTaxRate() != null ? dto.getTaxRate() : product.getTaxRate());
        product.setWeight(dto.getWeight());
        product.setWeightUnit(dto.getWeightUnit());
        product.setUnit(dto.getUnit());
        product.setImages(dto.getImages());
        product.setVideoUrl(dto.getVideoUrl());
        product.setSeoTitle(dto.getSeoTitle());
        product.setSeoDescription(dto.getSeoDescription());
        product.setMetaKeywords(dto.getMetaKeywords());
        product.setTags(dto.getTags());
        product.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : product.getSortOrder());
        product.setReturnable(dto.isReturnable());
        product.setCancellable(dto.isCancellable());

        if (dto.getStatus() != null) {
            product.setStatus(ProductStatus.valueOf(dto.getStatus().toUpperCase()));
        }

        product = productRepository.save(product);
        return toEnhancedDto(product);
    }

    @Transactional
    public ProductEnhancedDto updateStock(Long id, Integer quantity) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setStock(quantity);
        productRepository.save(product);
        return toEnhancedDto(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Brand operations
    public List<ProductEnhancedDto.BrandDto> getBrands() {
        return brandRepository.findByIsActiveTrue().stream()
            .map(this::toBrandDto).collect(Collectors.toList());
    }

    @Transactional
    public ProductEnhancedDto.BrandDto createBrand(ProductEnhancedDto.BrandDto dto) {
        Brand brand = Brand.builder()
            .name(dto.getName()).description(dto.getDescription())
            .logoUrl(dto.getLogoUrl()).website(dto.getWebsite()).build();
        brand = brandRepository.save(brand);
        return toBrandDto(brand);
    }

    // Category operations
    public List<CategoryDto> getCategories() {
        return categoryRepository.findAll().stream()
            .map(this::toCategoryDto).collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        Category category = Category.builder()
            .name(dto.getName()).description(dto.getDescription())
            .imageUrl(dto.getImageUrl()).parentId(dto.getParentId())
            .sortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0)
            .build();
        category = categoryRepository.save(category);
        return toCategoryDto(category);
    }

    private ProductEnhancedDto toEnhancedDto(Product p) {
        List<ProductVariant> variants = variantRepository.findByProductId(p.getId());

        return ProductEnhancedDto.builder()
            .id(p.getId()).name(p.getName()).description(p.getDescription())
            .shortDescription(p.getShortDescription()).sku(p.getSku())
            .barcode(p.getBarcode()).categoryId(p.getCategoryId())
            .merchantId(p.getMerchantId()).brandId(p.getBrandId())
            .price(p.getPrice()).compareAtPrice(p.getCompareAtPrice())
            .costPrice(p.getCostPrice()).taxRate(p.getTaxRate())
            .weight(p.getWeight()).weightUnit(p.getWeightUnit())
            .unit(p.getUnit()).stock(p.getStock()).minStockLevel(p.getMinStockLevel())
            .status(p.getStatus().name()).images(p.getImages()).videoUrl(p.getVideoUrl())
            .seoTitle(p.getSeoTitle()).seoDescription(p.getSeoDescription())
            .metaKeywords(p.getMetaKeywords()).hasVariants(p.isHasVariants())
            .isReturnable(p.isReturnable()).isCancellable(p.isCancellable())
            .tags(p.getTags()).sortOrder(p.getSortOrder())
            .variants(variants.stream().map(this::toVariantDto).collect(Collectors.toList()))
            .createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt())
            .build();
    }

    private ProductEnhancedDto.ProductVariantDto toVariantDto(ProductVariant v) {
        return ProductEnhancedDto.ProductVariantDto.builder()
            .id(v.getId()).sku(v.getSku()).name(v.getName())
            .price(v.getPrice()).compareAtPrice(v.getCompareAtPrice())
            .option1Name(v.getOption1Name()).option1Value(v.getOption1Value())
            .option2Name(v.getOption2Name()).option2Value(v.getOption2Value())
            .option3Name(v.getOption3Name()).option3Value(v.getOption3Value())
            .stock(v.getStock()).isActive(v.isActive()).imageUrl(v.getImageUrl()).build();
    }

    private ProductEnhancedDto.BrandDto toBrandDto(Brand b) {
        return ProductEnhancedDto.BrandDto.builder()
            .id(b.getId()).name(b.getName()).description(b.getDescription())
            .logoUrl(b.getLogoUrl()).website(b.getWebsite())
            .isActive(b.isActive()).createdAt(b.getCreatedAt()).build();
    }

    private CategoryDto toCategoryDto(Category c) {
        return CategoryDto.builder()
            .id(c.getId()).name(c.getName()).description(c.getDescription())
            .imageUrl(c.getImageUrl()).parentId(c.getParentId())
            .sortOrder(c.getSortOrder()).isActive(c.isActive()).build();
    }

    private ProductEnhancedDto.ProductSearchDto toSearchDto(Product p) {
        return ProductEnhancedDto.ProductSearchDto.builder()
            .id(p.getId()).name(p.getName()).sku(p.getSku())
            .price(p.getPrice()).compareAtPrice(p.getCompareAtPrice())
            .stock(p.getStock()).status(p.getStatus().name())
            .imageUrl(p.getImages() != null ? p.getImages().split(",")[0] : null)
            .unit(p.getUnit()).hasVariants(p.isHasVariants()).build();
    }
}
