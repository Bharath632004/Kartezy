package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/suggest")
    public Map<String, Object> getSuggestions(@RequestParam String query, @RequestParam(defaultValue = "5") int limit) {
        return searchService.getSuggestions(query, limit);
    }

    @GetMapping("/search")
    public Map<String, Object> search(@RequestParam String query,
                                      @RequestParam(required = false) String category,
                                      @RequestParam(required = false) Double minPrice,
                                      @RequestParam(required = false) Double maxPrice,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "20") int size) {
        return searchService.search(query, category, minPrice, maxPrice, page, size);
    }

    @GetMapping("/autocomplete")
    public List<String> autocomplete(@RequestParam String prefix, @RequestParam(defaultValue = "10") int limit) {
        return searchService.autocomplete(prefix, limit);
    }

    @PostMapping("/feedback")
    public Map<String, Object> recordSearchFeedback(@RequestBody Map<String, Object> feedback) {
        return searchService.recordSearchFeedback(feedback);
    }
}
