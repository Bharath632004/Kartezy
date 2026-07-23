package com.kartezy.recommendationservice.service;

import com.kartezy.recommendationservice.dto.RecommendationDto;
import com.kartezy.recommendationservice.entity.UserProductAction;
import com.kartezy.recommendationservice.repository.UserProductActionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserProductActionRepository actionRepository;

    public List<RecommendationDto> getProductRecommendations(UUID userId, int limit) {
        List<UUID> viewedProducts = actionRepository.findDistinctProductIdsByUserId(userId);
        if (viewedProducts.isEmpty()) {
            return getPopularProducts(limit);
        }
        // In production, this would use ML-based collaborative filtering
        return getPopularProducts(limit);
    }

    public List<RecommendationDto> getStoreRecommendations(UUID userId, int limit) {
        return getPopularProducts(limit); // Placeholder for ML-based store recommendations
    }

    public List<RecommendationDto> getPopularProducts(int limit) {
        List<Object[]> popular = actionRepository.findPopularProductIds();
        return popular.stream()
            .limit(limit)
            .map(row -> RecommendationDto.builder()
                .productId((UUID) row[0])
                .score(((Number) row[1]).doubleValue())
                .reason("Popular product")
                .build())
            .collect(Collectors.toList());
    }

    public void trackUserAction(UUID userId, UUID productId, String action) {
        UserProductAction userAction = UserProductAction.builder()
            .userId(userId).productId(productId).actionType(action).build();
        actionRepository.save(userAction);
        log.debug("User action tracked: userId={} productId={} action={}", userId, productId, action);
    }
}
