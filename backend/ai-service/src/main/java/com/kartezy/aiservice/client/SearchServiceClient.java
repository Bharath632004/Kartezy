package com.kartezy.aiservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@FeignClient(name = "search-service", path = "/api/search")
public interface SearchServiceClient {

    @GetMapping("/suggest")
    Map<String, Object> getSuggestions(@RequestParam("query") String query, @RequestParam("limit") int limit);

    @GetMapping("/search")
    Map<String, Object> search(@RequestParam("query") String query,
                               @RequestParam(value = "category", required = false) String category,
                               @RequestParam(value = "minPrice", required = false) Double minPrice,
                               @RequestParam(value = "maxPrice", required = false) Double maxPrice,
                               @RequestParam("page") int page,
                               @RequestParam("size") int size);

    @GetMapping("/autocomplete")
    List<String> autocomplete(@RequestParam("prefix") String prefix, @RequestParam("limit") int limit);

    @PostMapping("/feedback")
    Map<String, Object> recordSearchFeedback(@RequestBody Map<String, Object> feedback);
}
