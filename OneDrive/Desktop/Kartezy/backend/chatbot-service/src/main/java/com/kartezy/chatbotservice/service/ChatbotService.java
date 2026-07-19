package com.kartezy.chatbotservice.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@Service
public class ChatbotService {

    private final Map<String, List<ConversationMessage>> conversations = new ConcurrentHashMap<>();

    private static final Map<String, List<Pattern>> INTENT_PATTERNS = new LinkedHashMap<>();
    static {
        INTENT_PATTERNS.put("order_status", List.of(
                Pattern.compile("(?:where|status|track|delivery)\\s+(?:is|of|my)?\\s*(?:order|delivery)?", Pattern.CASE_INSENSITIVE),
                Pattern.compile("(?:order|delivery)\\s+(?:status|tracking|update)", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("search_products", List.of(
                Pattern.compile("(?:search|find|look|show|get)\\s+(?:for|me)?\\s+(.+?)(?:please|now|$)", Pattern.CASE_INSENSITIVE),
                Pattern.compile("(?:I want|I need|I'm looking for)\\s+(.+?)(?:please|now|$)", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("place_order", List.of(
                Pattern.compile("(?:order|buy|purchase|get)\\s+(.+?)(?:please|now|$)", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("cancel_order", List.of(
                Pattern.compile("(?:cancel|stop|abort|cancel my)\\s+order", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("return_item", List.of(
                Pattern.compile("(?:return|refund|exchange|replace)\\s+(?:my|an|the)?\\s*(?:item|order|product)?", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("account_help", List.of(
                Pattern.compile("(?:account|profile|password|login|signup|register)", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("payment_help", List.of(
                Pattern.compile("(?:payment|pay|bill|invoice|receipt|charge)", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("coupon_help", List.of(
                Pattern.compile("(?:coupon|coupons|promo|promo code|discount|offer|deal)", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("complaint", List.of(
                Pattern.compile("(?:complain|issue|problem|wrong|mistake|defective|damaged)", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("recommendation", List.of(
                Pattern.compile("(?:recommend|suggest|what should I|what can I)", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("greeting", List.of(
                Pattern.compile("^(?:hi|hello|hey|namaste|good\\s+(?:morning|afternoon|evening))", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("thanks", List.of(
                Pattern.compile("(?:thanks|thank you|thankyou|thx)", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("help", List.of(
                Pattern.compile("^(?:help|what can you do|commands|capabilities)", Pattern.CASE_INSENSITIVE)));
        INTENT_PATTERNS.put("goodbye", List.of(
                Pattern.compile("(?:bye|goodbye|see you|talk to you later)", Pattern.CASE_INSENSITIVE)));
    }

    private static final Map<String, String> ROLE_SYSTEM_PROMPTS = Map.of(
            "customer", "You help customers with orders, products, delivery, and account issues.",
            "merchant", "You help merchants with store, inventory, sales, pricing, and insights.",
            "delivery", "You help delivery partners with orders, navigation, earnings, and support.",
            "admin", "You help admins with platform management, analytics, users, and system operations.",
            "support", "You are a senior support assistant handling escalated issues and complaints.",
            "operations", "You help operations teams with logistics, inventory, zones, and performance.");

    private static final String DEFAULT_HELP = "I can help with: order status, product search, placing/cancelling orders, returns, account/payment help, coupons, recommendations, and complaints.";

    public Map<String, Object> converse(String userId, String message, String role, String context) {
        String effectiveRole = role != null ? role : "customer";
        List<ConversationMessage> history = conversations.computeIfAbsent(userId, k -> new ArrayList<>());

        if (message != null && !message.isEmpty())
            history.add(new ConversationMessage("user", message, System.currentTimeMillis()));

        String intent = detectIntent(message);
        String response = generateResponse(message, intent, effectiveRole);

        history.add(new ConversationMessage("assistant", response, System.currentTimeMillis()));

        if (history.size() > 50) history.subList(0, history.size() - 50).clear();

        return Map.of("response", response, "intent", intent, "role", effectiveRole,
                "suggestedResponses", getSuggestions(intent, effectiveRole),
                "conversationLength", history.size(),
                "context", Map.of("currentRole", effectiveRole, "messageCount", history.size()));
    }

    public List<String> getSuggestions(String userId) {
        if (userId == null) return List.of("Track my order", "Search for products", "Check offers", "Contact support");
        List<ConversationMessage> history = conversations.get(userId);
        if (history == null || history.isEmpty()) return List.of("Track my order", "Search for products", "Check offers", "Contact support");
        String lastIntent = detectIntent(history.get(history.size() - 1).getContent());
        return getSuggestions(lastIntent, "customer");
    }

    public void clearConversation(String userId) { conversations.remove(userId); }

    private String detectIntent(String message) {
        if (message == null || message.trim().isEmpty()) return "unknown";
        for (Map.Entry<String, List<Pattern>> entry : INTENT_PATTERNS.entrySet())
            for (Pattern pattern : entry.getValue())
                if (pattern.matcher(message).find()) return entry.getKey();
        return "unknown";
    }

    private String generateResponse(String message, String intent, String role) {
        return switch (intent) {
            case "greeting" -> "Hello! Welcome to Kartezy. How can I help you today? \uD83D\uDE0A";
            case "order_status" -> "I can help you check your order status. Could you please provide your order number?";
            case "search_products" -> "What kind of items are you looking for? We have groceries, electronics, clothing, and more.";
            case "place_order" -> "Great! What would you like to order? Please tell me the product name and quantity.";
            case "cancel_order" -> "Please provide your order number so I can check the cancellation policy.";
            case "return_item" -> "I can help with returns. Please provide your order number and the item.";
            case "account_help" -> "Are you having trouble with login, password reset, or profile updates?";
            case "payment_help" -> "Do you need help with a specific payment method or facing a payment failure?";
            case "coupon_help" -> "Check the Offers section in the app for the latest deals! Would you like help finding specific offers?";
            case "complaint" -> "I'm sorry to hear about the issue. Please tell me more so I can help resolve it quickly.";
            case "recommendation" -> "What category are you interested in? We have groceries, dairy, snacks, beverages, and more.";
            case "thanks" -> "You're welcome! Is there anything else? \uD83D\uDE0A";
            case "goodbye" -> "Thank you for reaching out! Have a great day! \uD83C\uDF89";
            case "help" -> DEFAULT_HELP;
            default -> "I'm not sure I understand. " + DEFAULT_HELP;
        };
    }

    private List<String> getSuggestions(String intent, String role) {
        return switch (intent) {
            case "greeting" -> List.of("Track my order", "Search for products", "Check offers");
            case "order_status" -> List.of("Provide order number", "Cancel order", "Return item");
            case "search_products" -> List.of("Search for groceries", "Search for electronics", "Browse categories");
            case "place_order" -> List.of("Order milk", "Order vegetables", "View cart");
            case "cancel_order" -> List.of("Cancel order 123", "Return item", "Contact support");
            case "return_item" -> List.of("Return damaged item", "Exchange for different size", "Refund status");
            case "account_help" -> List.of("Reset password", "Update profile", "Login help");
            case "payment_help" -> List.of("Payment failed", "Add payment method", "Check refund status");
            case "coupon_help" -> List.of("Apply coupon", "Available offers", "Referral program");
            case "complaint" -> List.of("Report issue", "Talk to support agent", "Request callback");
            case "recommendation" -> List.of("Popular products", "Today's deals", "New arrivals");
            case "help" -> List.of("Track order", "Search products", "Contact support");
            default -> List.of("Track my order", "Search for products", "Get help");
        };
    }

    public static class ConversationMessage {
        private final String role;
        private final String content;
        private final long timestamp;

        public ConversationMessage(String role, String content, long timestamp) {
            this.role = role; this.content = content; this.timestamp = timestamp;
        }
        public String getRole() { return role; }
        public String getContent() { return content; }
        public long getTimestamp() { return timestamp; }
    }
}
