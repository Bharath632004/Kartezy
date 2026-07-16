package com.kartezy.voiceservice.service;

import com.kartezy.voiceservice.client.NlpServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Voice service for shopping assistant.
 * Provides text-to-speech, speech-to-text, and voice command processing.
 */
@Service
public class VoiceService {

    private static final Logger log = LoggerFactory.getLogger(VoiceService.class);

    private final NlpServiceClient nlpServiceClient;

    public VoiceService(NlpServiceClient nlpServiceClient) {
        this.nlpServiceClient = nlpServiceClient;
    }

    /**
     * Process a voice command and return the action to take.
     */
    public Map<String, Object> processVoiceCommand(String audioText, String userId) {
        log.info("Processing voice command for user {}: {}", userId, audioText);
        
        // Normalize and parse the command
        String command = audioText.toLowerCase().trim();
        Map<String, Object> result = new HashMap<>();
        result.put("originalCommand", audioText);
        result.put("userId", userId);
        result.put("timestamp", new Date().toString());

        // Parse intent from voice command
        String intent = extractIntent(command);
        result.put("intent", intent);

        // Extract entities (products, quantities, etc.)
        Map<String, String> entities = extractEntities(command);
        result.put("entities", entities);

        // Generate response text
        String response = generateResponse(intent, entities);
        result.put("response", response);

        // Generate audio metadata for TTS
        Map<String, Object> audioMetadata = generateAudioMetadata(response);
        result.put("audio", audioMetadata);

        log.info("Voice command processed: intent={}, entities={}", intent, entities);
        return result;
    }

    /**
     * Convert text response to speech audio bytes.
     */
    public byte[] textToSpeech(Map<String, String> request) {
        String text = request.getOrDefault("text", "");
        String voice = request.getOrDefault("voice", "default");
        String language = request.getOrDefault("language", "en-IN");
        log.info("Converting text to speech: voice={}, lang={}", voice, language);
        // In production, this would call a TTS API. Return empty audio for now.
        return new byte[0];
    }

    /**
     * Recognize speech from audio file.
     */
    public Map<String, Object> speechToText(org.springframework.web.multipart.MultipartFile audioFile, String language) {
        log.info("Processing speech recognition: file={}, lang={}", 
                 audioFile != null ? audioFile.getOriginalFilename() : "null", language);
        
        Map<String, Object> result = new HashMap<>();
        result.put("language", language != null ? language : "en-IN");
        result.put("confidence", 0.0);
        result.put("text", "");
        result.put("words", Collections.emptyList());
        result.put("durationMs", 0);

        return result;
    }

    /**
     * Identify language from audio.
     */
    public Map<String, Object> identifyLanguage(org.springframework.web.multipart.MultipartFile audioFile) {
        log.info("Identifying language from audio: {}", audioFile != null ? audioFile.getOriginalFilename() : "null");
        Map<String, Object> result = new HashMap<>();
        result.put("language", "en-IN");
        result.put("confidence", 0.0);
        return result;
    }

    /**
     * Get available voice options.
     */
    public List<Map<String, String>> getAvailableVoices() {
        List<Map<String, String>> voices = new ArrayList<>();
        
        Map<String, String> enIN = new HashMap<>();
        enIN.put("id", "en-IN");
        enIN.put("name", "Hindi (India)");
        enIN.put("language", "hi-IN");
        enIN.put("gender", "female");
        voices.add(enIN);

        Map<String, String> enUS = new HashMap<>();
        enUS.put("id", "en-US");
        enUS.put("name", "English (US)");
        enUS.put("language", "en-US");
        enUS.put("gender", "female");
        voices.add(enUS);

        return voices;
    }

    /**
     * Extract intent from voice command text.
     */
    private String extractIntent(String command) {
        if (command.contains("search") || command.contains("find") || command.contains("look for")) {
            return "SEARCH_PRODUCT";
        } else if (command.contains("order") || command.contains("buy") || command.contains("purchase")) {
            return "PLACE_ORDER";
        } else if (command.contains("track") || command.contains("where is")) {
            return "TRACK_ORDER";
        } else if (command.contains("cancel")) {
            return "CANCEL_ORDER";
        } else if (command.contains("add") || command.contains("cart")) {
            return "ADD_TO_CART";
        } else if (command.contains("help") || command.contains("what can")) {
            return "HELP";
        } else if (command.contains("repeat") || command.contains("again")) {
            return "REPEAT";
        } else {
            return "GENERAL_QUERY";
        }
    }

    /**
     * Extract entities from voice command.
     */
    private Map<String, String> extractEntities(String command) {
        Map<String, String> entities = new HashMap<>();
        
        // Extract product names (words after search/find/buy)
        String[] keywords = {"search for ", "find ", "look for ", "order ", "buy ", "add "};
        for (String keyword : keywords) {
            int idx = command.indexOf(keyword);
            if (idx >= 0) {
                String product = command.substring(idx + keyword.length()).trim();
                if (!product.isEmpty()) {
                    entities.put("product", product);
                    break;
                }
            }
        }

        // Extract quantities
        String[] words = command.split("\\s+");
        for (int i = 0; i < words.length; i++) {
            if (words[i].matches("\\d+")) {
                entities.put("quantity", words[i]);
                break;
            }
        }

        return entities;
    }

    /**
     * Generate a response text based on intent and entities.
     */
    private String generateResponse(String intent, Map<String, String> entities) {
        switch (intent) {
            case "SEARCH_PRODUCT": {
                String product = entities.getOrDefault("product", "products");
                return "I'll search for " + product + " for you right away.";
            }
            case "PLACE_ORDER": {
                String product = entities.getOrDefault("product", "items");
                String qty = entities.getOrDefault("quantity", "some");
                return "I'll help you order " + qty + " " + product + ". Please confirm your delivery address.";
            }
            case "ADD_TO_CART":
                return "Item added to your cart. You have items in your cart. Would you like to checkout?";
            case "TRACK_ORDER":
                return "Let me check the status of your most recent order.";
            case "CANCEL_ORDER":
                return "I'll help you cancel your order. Please provide the order ID.";
            case "HELP":
                return "You can ask me to search for products, place orders, track deliveries, or add items to your cart. How can I help you?";
            default:
                return "I understand you said: \"" + entities.getOrDefault("product", "") + "\". How can I assist you with your shopping?";
        }
    }

    /**
     * Estimate TTS duration in milliseconds.
     */
    private int estimateDuration(String text) {
        if (text == null || text.isEmpty()) return 0;
        // Average speaking rate: ~150 words per minute, ~5 chars per word
        int charCount = text.length();
        return (int) ((charCount / 5.0) / 150.0 * 60.0 * 1000.0);
    }

    /**
     * Generate audio metadata for TTS response.
     */
    private Map<String, Object> generateAudioMetadata(String text) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("text", text);
        metadata.put("format", "audio/wav");
        metadata.put("sampleRate", 16000);
        metadata.put("channels", 1);
        metadata.put("bitsPerSample", 16);
        metadata.put("estimatedDurationMs", estimateDuration(text));
        return metadata;
    }
}
