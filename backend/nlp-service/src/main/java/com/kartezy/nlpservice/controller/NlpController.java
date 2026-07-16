package com.kartezy.nlpservice.controller;

import com.kartezy.nlpservice.service.NlpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/nlp")
public class NlpController {

    @Autowired
    private NlpService nlpService;

    @PostMapping("/analyze/sentiment")
    public ResponseEntity<Map<String, Object>> analyzeSentiment(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(nlpService.analyzeSentiment(request));
    }

    @PostMapping("/extract/entities")
    public ResponseEntity<List<Map<String, Object>>> extractEntities(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(nlpService.extractEntities(request));
    }

    @PostMapping("/detect/language")
    public ResponseEntity<Map<String, Object>> detectLanguage(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(nlpService.detectLanguage(request));
    }

    @PostMapping("/translate")
    public ResponseEntity<Map<String, Object>> translateText(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(nlpService.translateText(request));
    }

    @PostMapping("/summarize")
    public ResponseEntity<Map<String, Object>> summarizeText(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(nlpService.summarizeText(request));
    }

    @PostMapping("/similarity")
    public ResponseEntity<Map<String, Object>> textSimilarity(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(nlpService.textSimilarity(request));
    }

    @PostMapping("/intent/recognize")
    public ResponseEntity<Map<String, Object>> recognizeIntent(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(nlpService.recognizeIntent(request));
    }

    @PostMapping("/entities/extract-structured")
    public ResponseEntity<List<Map<String, Object>>> extractEntitiesStructured(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(nlpService.extractEntitiesStructured(request));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "nlp-service"));
    }
}
