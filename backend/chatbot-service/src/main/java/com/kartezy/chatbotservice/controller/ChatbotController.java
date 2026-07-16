package com.kartezy.chatbotservice.controller;

import com.kartezy.chatbotservice.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(
            @RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String message = request.get("message");
        String context = request.getOrDefault("context", null);
        return ResponseEntity.ok(chatbotService.getResponse(userId, message, context));
    }

    @GetMapping("/suggestions/{userId}")
    public ResponseEntity<List<String>> getSuggestions(@PathVariable String userId) {
        return ResponseEntity.ok(chatbotService.getSuggestions(userId));
    }

    @PostMapping("/train")
    public ResponseEntity<Map<String, String>> trainModel(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(chatbotService.trainModel(request));
    }

    @PostMapping("/feedback")
    public ResponseEntity<Map<String, String>> submitFeedback(@RequestBody Map<String, Object> request) {
        String conversationId = (String) request.get("conversationId");
        String feedback = (String) request.getOrDefault("feedback", "");
        int rating = (int) request.getOrDefault("rating", 0);
        return ResponseEntity.ok(chatbotService.submitFeedback(conversationId, feedback, rating));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getConversationHistory(@PathVariable String userId) {
        return ResponseEntity.ok(chatbotService.getConversationHistory(userId));
    }

    @GetMapping("/analytics/{userId}")
    public ResponseEntity<Map<String, Object>> getConversationAnalytics(@PathVariable String userId) {
        return ResponseEntity.ok(chatbotService.getConversationAnalytics(userId));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "chatbot-service"));
    }
}
