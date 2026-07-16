package com.kartezy.chatbotservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "recommendation-service", path = "/recommendations")
public interface RecommendationServiceClient {

    @GetMapping("/personalized/{userId}")
    List<String> getPersonalizedRecommendations(@PathVariable String userId,
                                                @RequestParam(defaultValue = "5") int limit);

    @GetMapping("/trending")
    List<String> getTrendingProducts(@RequestParam(defaultValue = "5") int limit);
}
