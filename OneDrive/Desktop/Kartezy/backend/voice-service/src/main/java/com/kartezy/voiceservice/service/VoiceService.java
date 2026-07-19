package com.kartezy.voiceservice.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class VoiceService {

    private static final Map<String, String> LANGUAGE_CODES = Map.of(
            "en", "English", "hi", "Hindi", "ta", "Tamil", "te", "Telugu",
            "kn", "Kannada", "ml", "Malayalam", "bn", "Bengali", "gu", "Gujarati", "mr", "Marathi", "pa", "Punjabi");

    private static final Map<String, List<Pattern>> VOICE_COMMANDS = Map.of(
            "search_product", List.of(
                    Pattern.compile("(?:search|find|look for|show me)\\s+(.+?)(?:please|now|$)", Pattern.CASE_INSENSITIVE),
                    Pattern.compile("(?:I want|I need|I'm looking for)\\s+(.+?)(?:please|now|$)", Pattern.CASE_INSENSITIVE)),
            "place_order", List.of(
                    Pattern.compile("(?:order|buy|purchase|get)\\s+(.+?)(?:please|now|$)", Pattern.CASE_INSENSITIVE)),
            "track_order", List.of(
                    Pattern.compile("(?:track|where is|status of)\\s+(?:my\\s+)?(?:order|delivery)", Pattern.CASE_INSENSITIVE)),
            "cancel_order", List.of(
                    Pattern.compile("(?:cancel|stop|abort)\\s+(?:my\\s+)?order", Pattern.CASE_INSENSITIVE)),
            "call_support", List.of(
                    Pattern.compile("(?:call|contact|talk to|speak to)\\s+(?:support|customer care|help)", Pattern.CASE_INSENSITIVE)),
            "add_to_cart", List.of(
                    Pattern.compile("(?:add|put|keep)\\s+(.+?)\\s+(?:to|in)\\s+(?:my\\s+)?cart", Pattern.CASE_INSENSITIVE)),
            "check_offers", List.of(
                    Pattern.compile("(?:offers|deals|discounts|coupons|promotions)", Pattern.CASE_INSENSITIVE)),
            "help", List.of(
                    Pattern.compile("(?:help|what can you do|commands)", Pattern.CASE_INSENSITIVE)));

    public Map<String, Object> transcribeSpeech(byte[] audioData, String language) {
        if (audioData == null || audioData.length == 0) {
            return Map.of("text", "", "confidence", 0.0, "language", language != null ? language : "en");
        }
        String text = simulateTranscription(audioData);
        String lang = language != null ? language : detectAudioLanguage(audioData);
        return Map.of("text", text, "confidence", 0.85 + new Random(audioData.length).nextDouble() * 0.1,
                "language", lang, "languageName", LANGUAGE_CODES.getOrDefault(lang, "Unknown"),
                "processingTimeMs", audioData.length / 10, "words", List.of(text.split("\\s+")));
    }

    public byte[] synthesizeSpeech(String text, String language, String voice) {
        if (text == null || text.isEmpty()) return new byte[0];
        return text.getBytes();
    }

    public Map<String, Object> processVoiceCommand(String commandText, String userId) {
        if (commandText == null || commandText.trim().isEmpty()) {
            return Map.of("action", "unknown", "parameters", Map.of(),
                    "responseText", "I didn't hear anything. Could you please repeat that?", "confidence", 0.0);
        }
        for (Map.Entry<String, List<Pattern>> command : VOICE_COMMANDS.entrySet()) {
            for (Pattern pattern : command.getValue()) {
                java.util.regex.Matcher matcher = pattern.matcher(commandText);
                if (matcher.find()) {
                    Map<String, Object> params = new HashMap<>();
                    if (matcher.groupCount() >= 1 && matcher.group(1) != null)
                        params.put("query", matcher.group(1).trim());
                    params.put("userId", userId);
                    return Map.of("action", command.getKey(), "parameters", params,
                            "responseText", generateCommandResponse(command.getKey(), params),
                            "confidence", 0.75 + new Random(commandText.length()).nextDouble() * 0.2,
                            "rawInput", commandText);
                }
            }
        }
        return Map.of("action", "unknown", "parameters", Map.of("query", commandText, "userId", userId),
                "responseText", "I'm sorry, I didn't understand that command.",
                "confidence", 0.3, "suggestedActions", List.of("search", "track_order", "call_support", "help"));
    }

    public Map<String, Object> identifyLanguage(byte[] audioData) {
        if (audioData == null || audioData.length == 0)
            return Map.of("language", "en", "languageName", "English", "confidence", 0.5);
        String lang = detectAudioLanguage(audioData);
        return Map.of("language", lang, "languageName", LANGUAGE_CODES.getOrDefault(lang, "Unknown"),
                "confidence", 0.7 + new Random(audioData.length).nextDouble() * 0.2, "allLanguages", LANGUAGE_CODES);
    }

    public List<Map<String, String>> getAvailableVoices() {
        return List.of(
                Map.of("id", "voice-en-1", "name", "Priya", "language", "en", "gender", "FEMALE", "accent", "Indian"),
                Map.of("id", "voice-en-2", "name", "Arjun", "language", "en", "gender", "MALE", "accent", "Indian"),
                Map.of("id", "voice-hi-1", "name", "Kavita", "language", "hi", "gender", "FEMALE", "accent", "Hindi"),
                Map.of("id", "voice-hi-2", "name", "Rahul", "language", "hi", "gender", "MALE", "accent", "Hindi"),
                Map.of("id", "voice-ta-1", "name", "Lakshmi", "language", "ta", "gender", "FEMALE", "accent", "Tamil"),
                Map.of("id", "voice-te-1", "name", "Padma", "language", "te", "gender", "FEMALE", "accent", "Telugu"),
                Map.of("id", "voice-bn-1", "name", "Ananya", "language", "bn", "gender", "FEMALE", "accent", "Bengali"));
    }

    private String simulateTranscription(byte[] audioData) {
        Random random = new Random(Arrays.hashCode(audioData));
        String[] templates = {"search for %s", "I want to order %s", "track my order", "where is my delivery",
                "show me offers on %s", "add %s to cart", "call customer support", "help me find %s", "cancel my order"};
        String[] products = {"milk", "bread", "eggs", "rice", "vegetables", "fruits", "chicken", "fish",
                "soap", "shampoo", "oil", "sugar", "salt", "butter", "cheese", "yogurt"};
        String template = templates[random.nextInt(templates.length)];
        return template.contains("%s") ? String.format(template, products[random.nextInt(products.length)]) : template;
    }

    private String detectAudioLanguage(byte[] audioData) {
        String[] langs = LANGUAGE_CODES.keySet().toArray(new String[0]);
        return langs[new Random(audioData.length).nextInt(langs.length)];
    }

    private String generateCommandResponse(String action, Map<String, Object> params) {
        return switch (action) {
            case "search_product" -> "Searching for " + params.getOrDefault("query", "products") + ". Please wait.";
            case "place_order" -> "I'll help you order " + params.getOrDefault("query", "") + ".";
            case "track_order" -> "Checking your order status. Your delivery is on its way!";
            case "cancel_order" -> "I'll help you cancel your order.";
            case "call_support" -> "Connecting you to customer support. Please hold.";
            case "add_to_cart" -> "Adding " + params.getOrDefault("query", "") + " to your cart.";
            case "check_offers" -> "Here are the latest deals and offers for you.";
            case "help" -> "You can say: search for [product], order [product], track my order, or call support.";
            default -> "How can I help you?";
        };
    }
}
