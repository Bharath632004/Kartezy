package com.kartezy.aiservice.controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/v1/search")
public class SearchController {
    @GetMapping("/suggest")
    public Object getSuggestions(@RequestParam String query, @RequestParam int limit) {
        return Map.of("suggestions", List.of());
    }
    @GetMapping("/search")
    public Object search(@RequestParam String query,
                         @RequestParam(required = false) String category,
                         @RequestParam(required = false) Double minPrice,
                         @RequestParam(required = false) Double maxPrice,
                         @RequestParam int page,
                                         @RequestParam int size) {
        return Map.of("results", List.of(), "total", 0, "page", page, "size", size);
    }
    @GetMapping("/autocomplete")
    public Object autocomplete(@RequestParam String prefix, @RequestParam int limit) {
        return List.of();
    }
    @PostMapping("/feedback")
    public Object recordSearchFeedback(@RequestBody Map<String, Object> feedback) {
        return Map.of("status", "recorded");
    }
}