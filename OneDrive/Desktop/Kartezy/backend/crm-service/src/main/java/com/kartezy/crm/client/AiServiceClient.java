package com.kartezy.crm.client;

import com.kartezy.crm.entity.BehaviorEvent;
import com.kartezy.crm.entity.CustomerProfile;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "ai-service", path = "/api/ai")
public interface AiServiceClient {

    @PostMapping("/recommendations/personalized/{customerId}")
    Map<String, Object> getPersonalizedRecommendations(@PathVariable("customerId") Long customerId);

    @PostMapping("/scoring/lead")
    Map<String, Object> scoreLead(@RequestBody Map<String, Object> leadData);

    @PostMapping("/segmentation/suggest")
    List<Map<String, Object>> suggestSegments(@RequestBody List<CustomerProfile> customers);

    @PostMapping("/campaign/optimize")
    Map<String, Object> optimizeCampaign(@RequestBody Map<String, Object> campaignData);

    @PostMapping("/predict/churn")
    Map<String, Object> predictChurn(@RequestParam("customerId") Long customerId);

    @PostMapping("/predict/lifetime-value")
    Map<String, Object> predictLifetimeValue(@RequestParam("customerId") Long customerId);

    @PostMapping("/content/generate")
    Map<String, Object> generateContent(@RequestBody Map<String, Object> contentRequest);

    @PostMapping("/analytics/campaign-performance")
    Map<String, Object> analyzeCampaignPerformance(@RequestBody Map<String, Object> campaignData);

    @PostMapping("/behavior/analyze")
    Map<String, Object> analyzeBehavior(@RequestBody BehaviorEvent event);

    @PostMapping("/personalization/targeting")
    Map<String, Object> getTargetingSuggestions(@RequestBody Map<String, Object> context);
}
