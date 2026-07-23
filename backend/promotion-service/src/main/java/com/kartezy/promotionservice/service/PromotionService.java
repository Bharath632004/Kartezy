package com.kartezy.promotionservice.service;

import com.kartezy.promotionservice.dto.*;
import com.kartezy.promotionservice.entity.Promotion;
import com.kartezy.promotionservice.entity.PromotionUsage;
import com.kartezy.promotionservice.repository.PromotionRepository;
import com.kartezy.promotionservice.repository.PromotionUsageRepository;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionUsageRepository usageRepository;

    public PromotionResponse validateAndApply(ApplyPromotionRequest request) {
        log.info("Validating promotion code: {} for user: {}", request.getCode(), request.getUserId());

        Promotion promotion = promotionRepository.findByCode(request.getCode().toUpperCase())
            .orElseThrow(() -> new BadRequestException("Invalid promotion code: " + request.getCode()));

        // Check if promotion is active
        if (!promotion.isActive()) {
            return PromotionResponse.builder()
                .valid(false).code(request.getCode())
                .message("This promotion is no longer active").build();
        }

        // Check date range
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(promotion.getStartDate()) || now.isAfter(promotion.getEndDate())) {
            return PromotionResponse.builder()
                .valid(false).code(request.getCode())
                .message("This promotion has expired or not yet started").build();
        }

        // Check global usage limit
        if (promotion.getMaxUsageCount() > 0) {
            long currentUsage = usageRepository.countByPromotionId(promotion.getId());
            if (currentUsage >= promotion.getMaxUsageCount()) {
                return PromotionResponse.builder()
                    .valid(false).code(request.getCode())
                    .message("Promotion usage limit reached").build();
            }
        }

        // Check per-user usage limit
        if (promotion.getMaxUsagePerUser() > 0) {
            long userUsage = usageRepository.countByPromotionIdAndUserId(promotion.getId(), request.getUserId());
            if (userUsage >= promotion.getMaxUsagePerUser()) {
                return PromotionResponse.builder()
                    .valid(false).code(request.getCode())
                    .message("You have already used this promotion").build();
            }
        }

        // Check minimum order amount
        if (promotion.getMinOrderAmount() != null
                && request.getOrderAmount().compareTo(promotion.getMinOrderAmount()) < 0) {
            return PromotionResponse.builder()
                .valid(false).code(request.getCode())
                .message("Minimum order amount of " + promotion.getMinOrderAmount() + " required").build();
        }

        // Calculate discount
        BigDecimal discountAmount = calculateDiscount(promotion, request.getOrderAmount());

        return PromotionResponse.builder()
            .valid(true)
            .code(promotion.getCode())
            .title(promotion.getTitle())
            .description(promotion.getDescription())
            .discountAmount(discountAmount)
            .discountType(promotion.getDiscountType())
            .discountedAmount(request.getOrderAmount().subtract(discountAmount))
            .message("Promotion applied successfully!")
            .build();
    }

    @Transactional
    public PromotionResponse applyPromotion(ApplyPromotionRequest request) {
        PromotionResponse validation = validateAndApply(request);
        if (!validation.isValid()) {
            return validation;
        }

        Promotion promotion = promotionRepository.findByCode(request.getCode().toUpperCase()).orElseThrow();

        // Record usage
        PromotionUsage usage = PromotionUsage.builder()
            .promotionId(promotion.getId())
            .userId(request.getUserId())
            .orderId(request.getOrderId())
            .discountApplied(validation.getDiscountAmount())
            .build();
        usageRepository.save(usage);

        // Increment usage count
        promotion.setUsedCount(promotion.getUsedCount() + 1);
        promotionRepository.save(promotion);

        log.info("Promotion {} applied for user {} on order {}. Discount: {}",
            request.getCode(), request.getUserId(), request.getOrderId(), validation.getDiscountAmount());

        return validation;
    }

    @Transactional
    public PromotionDto createPromotion(CreatePromotionRequest request) {
        log.info("Creating promotion: {}", request.getCode());

        if (promotionRepository.existsByCode(request.getCode().toUpperCase())) {
            throw new BadRequestException("Promotion code already exists: " + request.getCode());
        }

        Promotion promotion = Promotion.builder()
            .code(request.getCode().toUpperCase())
            .title(request.getTitle())
            .description(request.getDescription())
            .type(request.getType())
            .discountType(request.getDiscountType())
            .discountValue(request.getDiscountValue())
            .minOrderAmount(request.getMinOrderAmount())
            .maxDiscountAmount(request.getMaxDiscountAmount())
            .maxUsageCount(request.getMaxUsageCount())
            .maxUsagePerUser(request.getMaxUsagePerUser())
            .merchantId(request.getMerchantId())
            .applicableProductIds(request.getApplicableProductIds())
            .applicableCategoryIds(request.getApplicableCategoryIds())
            .active(true)
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .build();

        promotion = promotionRepository.save(promotion);
        log.info("Promotion created: {} with id: {}", promotion.getCode(), promotion.getId());
        return toPromotionDto(promotion);
    }

    public List<PromotionDto> getActivePromotions() {
        LocalDateTime now = LocalDateTime.now();
        return promotionRepository.findByActiveTrueAndStartDateBeforeAndEndDateAfter(now, now)
            .stream().map(this::toPromotionDto).collect(Collectors.toList());
    }

    public PromotionDto getPromotionByCode(String code) {
        Promotion promotion = promotionRepository.findByCode(code.toUpperCase())
            .orElseThrow(() -> new ResourceNotFoundException("Promotion not found: " + code));
        return toPromotionDto(promotion);
    }

    @Transactional
    public void deactivatePromotion(String code) {
        Promotion promotion = promotionRepository.findByCode(code.toUpperCase())
            .orElseThrow(() -> new ResourceNotFoundException("Promotion not found: " + code));
        promotion.setActive(false);
        promotionRepository.save(promotion);
        log.info("Promotion deactivated: {}", code);
    }

    private BigDecimal calculateDiscount(Promotion promotion, BigDecimal orderAmount) {
        BigDecimal discount;

        if ("PERCENTAGE".equals(promotion.getDiscountType())) {
            discount = orderAmount.multiply(promotion.getDiscountValue())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else if ("FIXED".equals(promotion.getDiscountType())) {
            discount = promotion.getDiscountValue();
        } else {
            discount = BigDecimal.ZERO;
        }

        // Apply max discount cap
        if (promotion.getMaxDiscountAmount() != null
                && discount.compareTo(promotion.getMaxDiscountAmount()) > 0) {
            discount = promotion.getMaxDiscountAmount();
        }

        // Ensure discount doesn't exceed order amount
        return discount.min(orderAmount);
    }

    private PromotionDto toPromotionDto(Promotion promotion) {
        return PromotionDto.builder()
            .id(promotion.getId())
            .code(promotion.getCode())
            .title(promotion.getTitle())
            .description(promotion.getDescription())
            .type(promotion.getType())
            .discountType(promotion.getDiscountType())
            .discountValue(promotion.getDiscountValue())
            .minOrderAmount(promotion.getMinOrderAmount())
            .maxDiscountAmount(promotion.getMaxDiscountAmount())
            .maxUsageCount(promotion.getMaxUsageCount())
            .maxUsagePerUser(promotion.getMaxUsagePerUser())
            .usedCount(promotion.getUsedCount())
            .merchantId(promotion.getMerchantId())
            .applicableProductIds(promotion.getApplicableProductIds())
            .applicableCategoryIds(promotion.getApplicableCategoryIds())
            .active(promotion.isActive())
            .startDate(promotion.getStartDate())
            .endDate(promotion.getEndDate())
            .createdAt(promotion.getCreatedAt())
            .updatedAt(promotion.getUpdatedAt())
            .build();
    }
}
