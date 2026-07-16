package com.kartezy.shared.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

/**
 * Feign client for the NLP Service.
 */
@FeignClient(name = "nlp-service", path = "/nlp")
public interface NlpServiceClient {

    @PostMapping("/analyze/sentiment")
    Map<String, Object> analyzeSentiment(@RequestBody Map<String, String> request);

    @PostMapping("/extract/entities")
    List<Map<String, Object>> extractEntities(@RequestBody Map<String, String> request);

    @PostMapping("/detect/language")
    Map<String, Object> detectLanguage(@RequestBody Map<String, String> request);

    @PostMapping("/translate")
    Map<String, Object> translateText(@RequestBody Map<String, String> request);

    @PostMapping("/summarize")
    Map<String, Object> summarizeText(@RequestBody Map<String, String> request);

    @PostMapping("/similarity")
    Map<String, Object> textSimilarity(@RequestBody Map<String, String> request);

    @PostMapping("/intent/recognize")
    Map<String, Object> recognizeIntent(@RequestBody Map<String, String> request);

    @PostMapping("/entities/extract-structured")
    List<Map<String, Object>> extractEntitiesStructured(@RequestBody Map<String, Object> request);
}