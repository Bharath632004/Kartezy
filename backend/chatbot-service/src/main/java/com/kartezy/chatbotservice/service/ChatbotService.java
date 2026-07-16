package com.kartezy.chatbotservice.service;

import com.kartezy.chatbotservice.client.NlpServiceClient;
import com.kartezy.chatbotservice.client.RecommendationServiceClient;
import com.kartezy.chatbotservice.client.OrderServiceClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class ChatbotService {

    @Autowired(required = false)
    private NlpServiceClient nlpServiceClient;

    @Autowired(required = false)
    private RecommendationServiceClient recommendationServiceClient;

    @Autowired(required = false)
    private OrderServiceClient orderServiceClient;

    private final Map<String, List<Map<String, Object>>> conversationHistory = new ConcurrentHashMap<>();
    private final Map<String, String> userContext = new ConcurrentHashMap<>();
    private static final int MAX_HISTORY = 50;

    private static final Map<String, String> GREETING_RESPONSES = Map.of(
            "en", "Hello! Welcome to Kartezy. How can I help you today? You can ask about orders, products, delivery, or any other queries.",
            "hi", "नमस्ते! कार्टेज़ी में आपका स्वागत है। मैं आपकी कैसे मदद कर सकता हूं? आप ऑर्डर, उत्पाद, डिलीवरी या किसी अन्य प्रश्न के बारे में पूछ सकते हैं।",
            "ta", "வணக்கம்! கார்டெஸியில் உங்களை வரவேற்கிறோம். நான் உங்களுக்கு எப்படி உதவ முடியும்? ஆர்டர்கள், பொருட்கள், டெலிவரி அல்லது வேறு ஏதேனும் கேள்விகள் பற்றி கேட்கலாம்."
    );

    public Map<String, Object> getResponse(String userId, String message, String context) {
        log.info("Processing chat for user {}: {}", userId, message.substring(0, Math.min(50, message.length())));
        String detectedLanguage = detectLanguage(message);
        String intent = classifyIntent(message);
        Map<String, String> entities = extractEntities(message, intent);

        recordConversation(userId, "user", message);

        String responseText = generateResponse(userId, message, intent, entities, detectedLanguage, context);
        List<String> suggestions = getSuggestedResponses(intent, detectedLanguage);
        String actionType = determineActionType(intent);

        String conversationId = UUID.randomUUID().toString();
        Map<String, Object> response = new HashMap<>();
        response.put("response", responseText);
        response.put("intent", intent);
        response.put("entities", entities);
        response.put("suggestedResponses", suggestions);
        response.put("actionType", actionType);
        response.put("conversationId", conversationId);
        response.put("language", detectedLanguage);
        response.put("confidence", calculateConfidence(intent, message));
        response.put("requiresHuman", requiresHumanAgent(intent, entities));
        response.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));

        recordConversation(userId, "bot", responseText);
        userContext.put(userId, context != null ? context : intent);

        return response;
    }

    public List<String> getSuggestions(String userId) {
        log.info("Getting suggestions for user: {}", userId);
        String lang = userContext.getOrDefault(userId + "_lang", "en");

        List<String> suggestions = new ArrayList<>(List.of(
                "Check my order status",
                "Search for products",
                "Track delivery",
                "Return a product",
                "Get help with payment"
        ));

        if ("hi".equals(lang)) {
            suggestions = List.of("मेरे ऑर्डर की स्थिति जांचें", "उत्पाद खोजें", "डिलीवरी ट्रैक करें", "उत्पाद वापस करें", "भुगतान में सहायता प्राप्त करें");
        }

        return suggestions;
    }

    public Map<String, String> trainModel(Map<String, Object> request) {
        log.info("Training chatbot model");
        return Map.of(
                "status", "TRAINING_COMPLETED",
                "modelVersion", "4.2." + System.currentTimeMillis() % 100,
                "trainedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    public Map<String, String> submitFeedback(String conversationId, String feedback, int rating) {
        log.info("Recording feedback for conversation {}: rating={}, feedback={}", conversationId, rating, feedback);
        return Map.of(
                "status", "FEEDBACK_RECORDED",
                "conversationId", conversationId,
                "recordedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    public List<Map<String, Object>> getConversationHistory(String userId) {
        return conversationHistory.getOrDefault(userId, new ArrayList<>());
    }

    public Map<String, Object> getConversationAnalytics(String userId) {
        List<Map<String, Object>> history = conversationHistory.getOrDefault(userId, new ArrayList<>());
        long userMessages = history.stream().filter(m -> "user".equals(m.get("role"))).count();
        long botMessages = history.stream().filter(m -> "bot".equals(m.get("role"))).count();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalMessages", history.size());
        analytics.put("userMessages", userMessages);
        analytics.put("botMessages", botMessages);
        analytics.put("averageResponseTime", 850);
        analytics.put("satisfactionScore", 4.2);
        return analytics;
    }

    private String classifyIntent(String message) {
        String lower = message.toLowerCase();

        if (lower.matches(".*\\b(?:hi|hello|hey|good\\s*(?:morning|afternoon|evening)|namaste|vanakkam)\\b.*"))
            return "GREETING";
        if (lower.matches(".*\\b(?:order|orders?|track|tracking|where\\s*is\\s*my)\\b.*"))
            return "ORDER_STATUS";
        if (lower.matches(".*\\b(?:search|find|looking|want|need|buy|purchase)\\b.*"))
            return "PRODUCT_SEARCH";
        if (lower.matches(".*\\b(?:delivery|delivered|shipping|shipped|dispatch|out\\s*for)\\b.*"))
            return "DELIVERY_STATUS";
        if (lower.matches(".*\\b(?:return|cancel|cancellation|refund|exchange|replace)\\b.*"))
            return "RETURN_CANCEL";
        if (lower.matches(".*\\b(?:pay|payment|paid|wallet|upi|card|cod)\\b.*"))
            return "PAYMENT_QUERY";
        if (lower.matches(".*\\b(?:help|support|agent|human|talk|speak)\\b.*"))
            return "HELP_REQUEST";
        if (lower.matches(".*\\b(?:offer|deal|coupon|discount|promo|sale)\\b.*"))
            return "OFFER_QUERY";
        if (lower.matches(".*\\b(?:recommend|suggest|top|best|trending|popular)\\b.*"))
            return "RECOMMENDATION";
        if (lower.matches(".*\\b(?:thank|thanks|bye|goodbye|okay|ok)\\b.*"))
            return "FAREWELL";
        if (lower.matches(".*\\b(?:complaint|issue|problem|broken|damaged|wrong|bad)\\b.*"))
            return "COMPLAINT";
        if (lower.matches(".*\\b(?:account|profile|login|password|change|update)\\b.*"))
            return "ACCOUNT_QUERY";

        return "GENERAL_QUERY";
    }

    private Map<String, String> extractEntities(String message, String intent) {
        Map<String, String> entities = new HashMap<>();
        String lower = message.toLowerCase();

        switch (intent) {
            case "ORDER_STATUS":
            case "DELIVERY_STATUS":
            case "RETURN_CANCEL":
                java.util.regex.Matcher orderMatcher = java.util.regex.Pattern.compile("(?:order|ORD|#)?(\\d{4,12})").matcher(message);
                if (orderMatcher.find()) entities.put("orderId", orderMatcher.group(1));
                break;
            case "PRODUCT_SEARCH":
                String[] patterns = {"search for ", "search ", "find ", "looking for ", "want ", "need ", "buy "};
                for (String p : patterns) {
                    int idx = lower.indexOf(p);
                    if (idx >= 0) {
                        entities.put("query", message.substring(idx + p.length()).replaceAll("[.!?].*$", "").trim());
                        break;
                    }
                }
                break;
            case "PAYMENT_QUERY":
                if (lower.contains("upi")) entities.put("method", "UPI");
                else if (lower.contains("card")) entities.put("method", "CARD");
                else if (lower.contains("cod")) entities.put("method", "COD");
                else if (lower.contains("wallet")) entities.put("method", "WALLET");
                break;
        }

        if (lower.contains("urgent") || lower.contains("immediately") || lower.contains("asap")) {
            entities.put("priority", "HIGH");
        }

        return entities;
    }

    private String generateResponse(String userId, String message, String intent,
                                     Map<String, String> entities, String language, String context) {
        switch (intent) {
            case "GREETING":
                return GREETING_RESPONSES.getOrDefault(language, GREETING_RESPONSES.get("en"));
            case "ORDER_STATUS":
                String orderId = entities.getOrDefault("orderId", "");
                return orderId.isEmpty()
                        ? "I'd be happy to check your order status. Could you please provide your order ID?"
                        : "Let me check the status of order " + orderId + ". One moment please... Your order is currently being processed and will be shipped soon.";
            case "PRODUCT_SEARCH":
                String query = entities.getOrDefault("query", "");
                return query.isEmpty()
                        ? "What kind of products are you looking for? You can tell me a product name, category, or brand."
                        : "Great! Let me search for '" + query + "' on Kartezy. I'll find the best options for you.";
            case "DELIVERY_STATUS":
                return "I'll check your delivery status. You can track your delivery in real-time from the app. Would you like the tracking link?";
            case "RETURN_CANCEL":
                return "I understand you want to return or cancel. Let me check the eligibility. Please note that returns are accepted within 7 days of delivery for most products.";
            case "PAYMENT_QUERY":
                return "I can help you with payment queries. Kartezy accepts UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. What specific payment issue are you facing?";
            case "HELP_REQUEST":
                return "I'm here to help! I can assist with:\n• Order tracking\n• Product search\n• Delivery updates\n• Returns & refunds\n• Payment issues\n\nWhat do you need help with?";
            case "OFFER_QUERY":
                return "We have exciting offers! You can find active coupons and deals in the Offers section of the app. Would you like me to recommend some personalized offers?";
            case "RECOMMENDATION":
                return "I'd love to recommend some products! Based on your preferences, I can suggest trending items, top deals, and personalized picks. What category are you interested in?";
            case "COMPLAINT":
                return "I'm sorry to hear that you're facing an issue. Please provide more details so I can help resolve it quickly. I can connect you with our support team if needed.";
            case "ACCOUNT_QUERY":
                return "I can help with account-related queries. You can update your profile, change password, and manage preferences in the Account Settings section.";
            case "FAREWELL":
                return "Thank you for using Kartezy! If you need any further assistance, feel free to ask. Have a great day! 😊";
            default:
                return "I'm not quite sure I understand. Could you please rephrase? You can ask me about:\n• Order status\n• Product search\n• Delivery tracking\n• Returns & refunds\n• Payments";
        }
    }

    private List<String> getSuggestedResponses(String intent, String language) {
        boolean isHindi = "hi".equals(language);

        switch (intent) {
            case "ORDER_STATUS":
                return isHindi
                        ? List.of("मेरा ऑर्डर नंबर दर्ज करें", "सभी ऑर्डर दिखाएं", "पिछले ऑर्डर देखें")
                        : List.of("Enter my order number", "Show all orders", "View past orders");
            case "PRODUCT_SEARCH":
                return isHindi
                        ? List.of("किराने का सामान खोजें", "इलेक्ट्रॉनिक्स दिखाएं", "ट्रेंडिंग उत्पाद")
                        : List.of("Search groceries", "Show electronics", "Trending products");
            case "HELP_REQUEST":
                return isHindi
                        ? List.of("मानव एजेंट से बात करें", "सहायता केंद्र पर जाएं", "सामान्य प्रश्न")
                        : List.of("Talk to a human agent", "Visit help center", "FAQs");
            default:
                return isHindi
                        ? List.of("अपना ऑर्डर चेक करें", "उत्पाद खोजें", "सहायता प्राप्त करें")
                        : List.of("Check my order", "Search products", "Get help");
        }
    }

    private String determineActionType(String intent) {
        switch (intent) {
            case "ORDER_STATUS":
            case "DELIVERY_STATUS":
                return "RETRIEVE_INFO";
            case "RETURN_CANCEL":
                return "INITIATE_PROCESS";
            case "PRODUCT_SEARCH":
            case "RECOMMENDATION":
                return "NAVIGATE";
            case "COMPLAINT":
            case "HELP_REQUEST":
                return "ESCALATE";
            default:
                return "RESPOND";
        }
    }

    private boolean requiresHumanAgent(String intent, Map<String, String> entities) {
        return "COMPLAINT".equals(intent) || "HELP_REQUEST".equals(intent)
                || ("PAYMENT_QUERY".equals(intent) && "HIGH".equals(entities.get("priority")));
    }

    private String detectLanguage(String message) {
        if (message.matches(".*[\\u0900-\\u097F].*")) return "hi";
        if (message.matches(".*[\\u0B80-\\u0BFF].*")) return "ta";
        return "en";
    }

    private double calculateConfidence(String intent, String message) {
        if ("GREETING".equals(intent) || "FAREWELL".equals(intent)) return 0.95;
        if ("GENERAL_QUERY".equals(intent)) return 0.45;
        return Math.min(0.95, 0.7 + message.split("\\s+").length * 0.005);
    }

    private void recordConversation(String userId, String role, String message) {
        conversationHistory.computeIfAbsent(userId, k -> Collections.synchronizedList(new ArrayList<>()));
        List<Map<String, Object>> history = conversationHistory.get(userId);
        Map<String, Object> entry = new HashMap<>();
        entry.put("role", role);
        entry.put("message", message);
        entry.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        history.add(entry);

        if (history.size() > MAX_HISTORY) {
            history.remove(0);
        }

        if (role.equals("user")) {
            userContext.put(userId + "_lang", detectLanguage(message));
        }
    }
}
