package com.kartezy.chatbotservice.controller;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.kartezy.chatbotservice.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
/**
 * REST controller for chatbot service.
 * Provides an endpoint for interacting with the chatbot.
 */
@RestController
@RequestMapping("/chatbot")
public class ChatbotController {
    @Autowired
    private ChatbotService chatbotService;
    /**
     * Sends a message to the chatbot and returns the response.
     * @param message the user's message
     * @param context optional context (e.g., user ID, session ID) as JSON string
     * @return the chatbot's response
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(
            @RequestParam String message,
            @RequestParam(required = false) String context) {
        Map<String, Object> ctx = new HashMap<>();
        if (context != null && !context.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                ctx = objectMapper.readValue(context, new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON context"));
            }
        }
        return ResponseEntity.ok(chatbotService.getResponse(message, ctx));
    }
    /**
     * Health check endpoint.
     * @return a simple status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Chatbot service is healthy");
    }
}