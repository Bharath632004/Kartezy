package com.kartezy.shared.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "recommendation-service", path = "/recommendations")
public interface RecommendationServiceClient {

    @GetMapping("/personalized/{userId}")
    List<String> getPersonalizedRecommendations(@PathVariable String userId,
                                                @RequestParam(defaultValue = "10") int limit);

    @GetMapping("/similar/{productId}")
    List<String> getSimilarProducts(@PathVariable String productId,
                                    @RequestParam(defaultValue = "10") int limit);

    @GetMapping("/fbt/{productId}")
    List<String> getFrequentlyBoughtTogether(@PathVariable String productId,
                                             @RequestParam(defaultValue = "10") int limit);

    @GetMapping("/trending")
    List<String> getTrendingProducts(@RequestParam(defaultValue = "10") int limit);

    @GetMapping("/contextual/{userId}")
    List<String> getContextualRecommendations(@PathVariable String userId,
                                              @RequestParam(defaultValue = "10") int limit);
}