package com.kartezy.aiservice.controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/v1/chatbot")
public class ChatbotController {
    @PostMapping("/converse")
    public Map<String, Object> converse(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String message = request.get("message");
        String context = request.get("context"); // Optional context
        return Map.of(
                "response", "I'm sorry, I didn't understand that.",
                "intent", "unknown",
                "entities", List.of(),
                "suggestedResponses", List.of("Can you rephrase?", "Tell me more about...")
        );
    }
    @PostMapping("/train")
    public Map<String, String> trainModel(@RequestBody Map<String, Object> request) {
        return Map.of("status", "training started");
    }
    @GetMapping("/suggestions/{userId}")
    public List<String> getSuggestions(@PathVariable String userId) {
        return List.of("Check your order status", "See recommended products");
    }
    @PostMapping("/feedback")
    public Map<String, String> submitFeedback(@RequestBody Map<String, Object> request) {
        String conversationId = (String) request.get("conversationId");
        String feedback = (String) request.get("feedback");
        int rating = (int) request.getOrDefault("rating", 0);
        return Map.of("status", "feedback recorded");
    }
}