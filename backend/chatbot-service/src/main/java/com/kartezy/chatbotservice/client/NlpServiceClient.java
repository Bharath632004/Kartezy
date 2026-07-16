package com.kartezy.chatbotservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "nlp-service", path = "/nlp")
public interface NlpServiceClient {

    @PostMapping("/intent/recognize")
    Map<String, Object> recognizeIntent(@RequestBody Map<String, String> request);

    @PostMapping("/analyze/sentiment")
    Map<String, Object> analyzeSentiment(@RequestBody Map<String, String> request);

    @PostMapping("/extract/entities")
    Map<String, Object> extractEntities(@RequestBody Map<String, String> request);
}
