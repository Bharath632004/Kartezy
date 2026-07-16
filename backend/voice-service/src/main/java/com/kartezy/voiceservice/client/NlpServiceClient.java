package com.kartezy.voiceservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "nlp-service", path = "/nlp", fallbackFactory = NlpServiceClientFallbackFactory.class)
public interface NlpServiceClient {

    @PostMapping("/analyze-sentiment")
    Map<String, Object> analyzeSentiment(@RequestBody Map<String, String> request);

    @PostMapping("/extract-entities")
    Map<String, Object> extractEntities(@RequestBody Map<String, String> request);

    @PostMapping("/recognize-intent")
    Map<String, Object> recognizeIntent(@RequestBody Map<String, String> request);
}
