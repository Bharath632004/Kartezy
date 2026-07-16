package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.service.AIServiceFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/nlp")
public class NLPController {

    @Autowired
    private AIServiceFacade aiServiceFacade;

    @PostMapping("/analyze/sentiment")
    public Map<String, Object> analyzeSentiment(@RequestBody Map<String, String> request) {
        return aiServiceFacade.analyzeSentiment(request.get("text"));
    }

    @PostMapping("/extract/entities")
    public List<Map<String, Object>> extractEntities(@RequestBody Map<String, String> request) {
        return aiServiceFacade.extractEntities(request.get("text"));
    }

    @PostMapping("/detect/language")
    public Map<String, Object> detectLanguage(@RequestBody Map<String, String> request) {
        return aiServiceFacade.detectLanguage(request.get("text"));
    }

    @PostMapping("/translate")
    public Map<String, Object> translateText(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        String targetLanguage = request.get("targetLanguage");
        return aiServiceFacade.translateText(text, targetLanguage);
    }

    @PostMapping("/summarize")
    public Map<String, Object> summarizeText(@RequestBody Map<String, String> request) {
        return aiServiceFacade.summarizeText(request.get("text"));
    }

    @PostMapping("/similarity")
    public Map<String, Object> textSimilarity(@RequestBody Map<String, String> request) {
        String text1 = request.get("text1");
        String text2 = request.get("text2");
        return Map.of("similarityScore", computeJaccardSimilarity(text1, text2), "processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
    }

    @PostMapping("/intent/recognize")
    public Map<String, Object> recognizeIntent(@RequestBody Map<String, String> request) {
        return aiServiceFacade.recognizeIntent(request.get("text"));
    }

    @PostMapping("/entities/extract-structured")
    public List<Map<String, Object>> extractEntitiesStructured(@RequestBody Map<String, Object> request) {
        String text = (String) request.get("text");
        return aiServiceFacade.extractEntities(text);
    }

    private double computeJaccardSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null) return 0.0;
        String[] words1 = text1.toLowerCase().split("\\s+");
        String[] words2 = text2.toLowerCase().split("\\s+");
        java.util.Set<String> set1 = new java.util.HashSet<>(java.util.Arrays.asList(words1));
        java.util.Set<String> set2 = new java.util.HashSet<>(java.util.Arrays.asList(words2));
        java.util.Set<String> intersection = new java.util.HashSet<>(set1);
        intersection.retainAll(set2);
        java.util.Set<String> union = new java.util.HashSet<>(set1);
        union.addAll(set2);
        return union.isEmpty() ? 0.0 : Math.round(((double) intersection.size() / union.size()) * 100.0) / 100.0;
    }
}
