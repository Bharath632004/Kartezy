package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.service.AIServiceFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/chatbot")
public class ChatbotController {

    @Autowired
    private AIServiceFacade aiServiceFacade;

    @PostMapping("/converse")
    public Map<String, Object> converse(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String message = request.get("message");
        String context = request.get("context");

        // Use NLP service to understand intent
        Map<String, Object> intentResult = aiServiceFacade.recognizeIntent(message);
        String intent = (String) intentResult.getOrDefault("intent", "GENERAL_QUERY");
        double confidence = (double) intentResult.getOrDefault("confidence", 0.0);

        Map<String, Object> sentimentResult = aiServiceFacade.analyzeSentiment(message);
        List<Map<String, Object>> entities = aiServiceFacade.extractEntities(message);

        String response = generateResponse(intent, message, entities);
        List<String> suggestions = getSuggestions(intent);

        return Map.of(
                "response", response,
                "intent", intent,
                "intentConfidence", confidence,
                "sentiment", sentimentResult.getOrDefault("sentiment", "neutral"),
                "entities", entities,
                "suggestedResponses", suggestions,
                "conversationId", UUID.randomUUID().toString(),
                "timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    @PostMapping("/train")
    public Map<String, String> trainModel(@RequestBody Map<String, Object> request) {
        return Map.of(
                "status", "TRAINING_STARTED",
                "jobId", UUID.randomUUID().toString(),
                "modelType", request.getOrDefault("modelType", "chatbot"),
                "estimatedCompletion", LocalDateTime.now().plusHours(2).format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    @GetMapping("/suggestions/{userId}")
    public List<String> getSuggestions(@PathVariable String userId) {
        return List.of(
                "Check my order status",
                "Search for products",
                "Track delivery",
                "Return a product",
                "Get help with payment"
        );
    }

    @PostMapping("/feedback")
    public Map<String, String> submitFeedback(@RequestBody Map<String, Object> request) {
        String conversationId = (String) request.get("conversationId");
        String feedback = (String) request.getOrDefault("feedback", "");
        int rating = (int) request.getOrDefault("rating", 0);
        return Map.of(
                "status", "feedback recorded",
                "conversationId", conversationId,
                "thankYou", true,
                "recordedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    private String generateResponse(String intent, String message, List<Map<String, Object>> entities) {
        switch (intent) {
            case "ORDER_INQUIRY":
                return "I'd be happy to help you with your order. Could you please provide your order ID so I can look up the details?";
            case "RETURN_REQUEST":
                return "I understand you'd like to return a product. Our return policy allows returns within 7 days of delivery. Could you share your order ID?";
            case "PRODUCT_SEARCH":
                return "I can help you find products! What type of products are you looking for? You can search by name, category, or brand.";
            case "PAYMENT_QUERY":
                return "I can help with payment queries. Kartezy accepts UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. What would you like to know?";
            case "HELP_REQUEST":
                return "I'm here to help! You can ask me about orders, deliveries, returns, payments, or any other queries. How can I assist you today?";
            case "OFFER_INQUIRY":
                return "We have great offers available! You can find active deals and coupons in the Offers section of the app. Would you like personalized recommendations?";
            case "FEEDBACK":
                return "Thank you for your feedback! We really appreciate it and will use it to improve our service.";
            case "GREETING":
                return "Hello! Welcome to Kartezy. How can I help you today? You can ask about orders, products, delivery, or anything else.";
            default:
                return "I'm not quite sure I understand. Could you please rephrase? You can ask me about orders, products, delivery, returns, or payments.";
        }
    }
}
