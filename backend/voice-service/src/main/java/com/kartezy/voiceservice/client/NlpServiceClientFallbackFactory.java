package com.kartezy.voiceservice.client;

import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class NlpServiceClientFallbackFactory implements FallbackFactory<NlpServiceClient> {

    @Override
    public NlpServiceClient create(Throwable cause) {
        return new NlpServiceClient() {
            @Override
            public Map<String, Object> analyzeSentiment(Map<String, String> request) {
                Map<String, Object> fallback = new HashMap<>();
                fallback.put("sentiment", "NEUTRAL");
                fallback.put("score", 0.0);
                fallback.put("error", cause.getMessage());
                return fallback;
            }

            @Override
            public Map<String, Object> extractEntities(Map<String, String> request) {
                Map<String, Object> fallback = new HashMap<>();
                fallback.put("entities", java.util.Collections.emptyList());
                fallback.put("error", cause.getMessage());
                return fallback;
            }

            @Override
            public Map<String, Object> recognizeIntent(Map<String, String> request) {
                Map<String, Object> fallback = new HashMap<>();
                fallback.put("intent", "GENERAL_QUERY");
                fallback.put("confidence", 0.0);
                fallback.put("error", cause.getMessage());
                return fallback;
            }
        };
    }
}
