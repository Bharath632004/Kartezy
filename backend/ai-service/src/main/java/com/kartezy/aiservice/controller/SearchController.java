package com.kartezy.aiservice.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/search")
public class SearchController {

    @GetMapping("/suggest")
    public Map<String, Object> getSuggestions(@RequestParam String query, @RequestParam int limit) {
        return Map.of("suggestions", List.of(), "query", query);
    }

    @GetMapping("/search")
    public Map<String, Object> search(@RequestParam String query,
                                      @RequestParam(required = false) String category,
                                      @RequestParam(required = false) Double minPrice,
                                      @RequestParam(required = false) Double maxPrice,
                                      @RequestParam int page,
                                      @RequestParam int size) {
        return Map.of("results", List.of(), "total", 0, "page", page, "size", size, "query", query);
    }

    @GetMapping("/autocomplete")
    public List<String> autocomplete(@RequestParam String prefix, @RequestParam int limit) {
        return List.of();
    }

    @PostMapping("/feedback")
    public Map<String, Object> recordSearchFeedback(@RequestBody Map<String, Object> feedback) {
        return Map.of("status", "recorded", "feedbackId", java.util.UUID.randomUUID().toString());
    }
}
