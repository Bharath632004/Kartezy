package com.kartezy.pricingservice.service;

import com.kartezy.pricingservice.dto.*;
import com.kartezy.pricingservice.entity.PriceRule;
import com.kartezy.pricingservice.entity.ProductPrice;
import com.kartezy.pricingservice.repository.PriceRuleRepository;
import com.kartezy.pricingservice.repository.ProductPriceRepository;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PricingService {

    private final ProductPriceRepository productPriceRepository;
    private final PriceRuleRepository priceRuleRepository;

    @Transactional
    public ProductPriceDto setProductPrice(ProductPriceDto request) {
        log.info("Setting price for product: {}", request.getProductId());

        ProductPrice price = productPriceRepository
            .findByProductIdAndMerchantIdAndActiveTrue(request.getProductId(), request.getMerchantId())
            .orElseGet(() -> ProductPrice.builder()
                .productId(request.getProductId())
                .merchantId(request.getMerchantId())
                .build());

        price.setBasePrice(request.getBasePrice());
        price.setSalePrice(request.getSalePrice() != null ? request.getSalePrice() : request.getBasePrice());
        price.setWholesalePrice(request.getWholesalePrice());
        price.setCostPrice(request.getCostPrice());
        price.setMrp(request.getMrp());
        price.setCurrency(request.getCurrency() != null ? request.getCurrency() : "INR");
        price.setActive(true);
        price.setNotes(request.getNotes());

        if (request.getBasePrice() != null && request.getCostPrice() != null
                && request.getCostPrice().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal margin = request.getBasePrice().subtract(request.getCostPrice())
                .multiply(BigDecimal.valueOf(100))
                .divide(request.getCostPrice(), 2, RoundingMode.HALF_UP);
            price.setMarginPercent(margin);
        }

        price = productPriceRepository.save(price);
        log.info("Price set for product: {} with basePrice: {}", request.getProductId(), request.getBasePrice());
        return toProductPriceDto(price);
    }

    public PriceCalculationResponse calculatePrice(PriceCalculationRequest request) {
        log.info("Calculating price for product: {}, quantity: {}", request.getProductId(), request.getQuantity());

        ProductPrice price = productPriceRepository
            .findByProductIdAndMerchantIdAndActiveTrue(request.getProductId(), request.getMerchantId())
            .orElseThrow(() -> new ResourceNotFoundException("Price not found for product: " + request.getProductId()));

        BigDecimal unitPrice = price.getSalePrice() != null ? price.getSalePrice() : price.getBasePrice();
        BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(request.getQuantity()));

        // Apply price rules
        String appliedRule = null;
        BigDecimal discount = BigDecimal.ZERO;

        List<PriceRule> activeRules = priceRuleRepository.findByProductIdAndActiveTrue(request.getProductId());
        if (activeRules.isEmpty()) {
            activeRules = priceRuleRepository.findByCategoryIdAndActiveTrue(price.getProductId());
        }

        if (!activeRules.isEmpty()) {
            PriceRule rule = activeRules.stream()
                .max(Comparator.comparingInt(r -> r.getPriority() != null ? r.getPriority() : 0))
                .orElse(null);

            if (rule != null) {
                if ("PERCENTAGE".equals(rule.getPriceType())) {
                    discount = totalPrice.multiply(rule.getPriceValue())
                        .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                } else if ("FIXED".equals(rule.getPriceType())) {
                    discount = rule.getPriceValue().min(totalPrice);
                }
                appliedRule = rule.getRuleName();
            }
        }

        BigDecimal finalPrice = totalPrice.subtract(discount);
        finalPrice = finalPrice.max(BigDecimal.ZERO);

        return PriceCalculationResponse.builder()
            .productId(request.getProductId())
            .merchantId(request.getMerchantId())
            .basePrice(price.getBasePrice())
            .unitPrice(unitPrice)
            .totalPrice(totalPrice)
            .discount(discount)
            .finalPrice(finalPrice)
            .currency(price.getCurrency())
            .appliedRule(appliedRule)
            .message("Price calculated successfully")
            .build();
    }

    public ProductPriceDto getProductPrice(UUID productId, UUID merchantId) {
        ProductPrice price = productPriceRepository
            .findByProductIdAndMerchantIdAndActiveTrue(productId, merchantId)
            .orElseThrow(() -> new ResourceNotFoundException("Price not found for product: " + productId));
        return toProductPriceDto(price);
    }

    public List<PriceRuleDto> getActiveRules() {
        LocalDateTime now = LocalDateTime.now();
        return priceRuleRepository
            .findActiveRules(now)
            .stream()
            .map(this::toPriceRuleDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public PriceRuleDto createPriceRule(PriceRuleDto request) {
        PriceRule rule = PriceRule.builder()
            .productId(request.getProductId())
            .merchantId(request.getMerchantId())
            .categoryId(request.getCategoryId())
            .ruleType(request.getRuleType())
            .ruleName(request.getRuleName())
            .description(request.getDescription())
            .priceType(request.getPriceType())
            .priceValue(request.getPriceValue())
            .minPrice(request.getMinPrice())
            .maxPrice(request.getMaxPrice())
            .active(request.isActive())
            .priority(request.getPriority())
            .effectiveFrom(request.getEffectiveFrom())
            .effectiveTo(request.getEffectiveTo())
            .build();
        rule = priceRuleRepository.save(rule);
        return toPriceRuleDto(rule);
    }

    private ProductPriceDto toProductPriceDto(ProductPrice price) {
        return ProductPriceDto.builder()
            .id(price.getId())
            .productId(price.getProductId())
            .merchantId(price.getMerchantId())
            .basePrice(price.getBasePrice())
            .salePrice(price.getSalePrice())
            .wholesalePrice(price.getWholesalePrice())
            .costPrice(price.getCostPrice())
            .mrp(price.getMrp())
            .currency(price.getCurrency())
            .marginPercent(price.getMarginPercent())
            .active(price.isActive())
            .notes(price.getNotes())
            .createdAt(price.getCreatedAt())
            .updatedAt(price.getUpdatedAt())
            .build();
    }

    private PriceRuleDto toPriceRuleDto(PriceRule rule) {
        return PriceRuleDto.builder()
            .id(rule.getId())
            .productId(rule.getProductId())
            .merchantId(rule.getMerchantId())
            .categoryId(rule.getCategoryId())
            .ruleType(rule.getRuleType())
            .ruleName(rule.getRuleName())
            .description(rule.getDescription())
            .priceType(rule.getPriceType())
            .priceValue(rule.getPriceValue())
            .minPrice(rule.getMinPrice())
            .maxPrice(rule.getMaxPrice())
            .active(rule.isActive())
            .priority(rule.getPriority())
            .effectiveFrom(rule.getEffectiveFrom())
            .effectiveTo(rule.getEffectiveTo())
            .createdAt(rule.getCreatedAt())
            .build();
    }
}
