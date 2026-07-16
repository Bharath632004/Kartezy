package com.kartezy.voiceservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class VoiceService {

    private static final List<String> SUPPORTED_LANGUAGES = Arrays.asList("en", "hi", "ta", "te", "kn", "ml", "bn", "gu", "mr", "pa");
    private static final Map<String, String> LANGUAGE_NAMES = Map.ofEntries(
            Map.entry("en", "English"), Map.entry("hi", "Hindi"), Map.entry("ta", "Tamil"),
            Map.entry("te", "Telugu"), Map.entry("kn", "Kannada"), Map.entry("ml", "Malayalam"),
            Map.entry("bn", "Bengali"), Map.entry("gu", "Gujarati"), Map.entry("mr", "Marathi"),
            Map.entry("pa", "Punjabi")
    );

    public Map<String, Object> speechToText(MultipartFile audioFile, String language) throws Exception {
        log.info("Processing speech-to-text for file: {}, language: {}", audioFile.getOriginalFilename(), language);
        String detectedLanguage = language != null ? language : detectLanguageFromAudio(audioFile);
        String transcribedText = transcribeAudio(audioFile, detectedLanguage);

        Map<String, Object> result = new HashMap<>();
        result.put("text", transcribedText);
        result.put("confidence", calculateTranscriptionConfidence(transcribedText));
        result.put("detectedLanguage", detectedLanguage);
        result.put("languageName", LANGUAGE_NAMES.getOrDefault(detectedLanguage, "Unknown"));
        result.put("wordCount", transcribedText.split("\\s+").length);
        result.put("durationMs", 1000 + new Random().nextInt(4000));
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    public byte[] textToSpeech(Map<String, String> request) throws Exception {
        String text = request.get("text");
        String language = request.getOrDefault("language", "en");
        String voice = request.getOrDefault("voice", "default");
        log.info("Processing text-to-speech for text length: {}, language: {}, voice: {}", text.length(), language, voice);

        return synthesizeSpeech(text, language, voice);
    }

    public Map<String, Object> processVoiceCommand(String commandText, String userId) {
        log.info("Processing voice command for user {}: {}", userId, commandText);
        String intent = detectCommandIntent(commandText);
        Map<String, String> parameters = extractCommandParameters(commandText, intent);
        String responseText = generateCommandResponse(intent, parameters);

        Map<String, Object> result = new HashMap<>();
        result.put("action", intent);
        result.put("parameters", parameters);
        result.put("responseText", responseText);
        result.put("confidence", calculateIntentConfidence(commandText, intent));
        result.put("requiresConfirmation", isHighRiskAction(intent));
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    public Map<String, Object> identifyLanguage(MultipartFile audioFile) throws Exception {
        log.info("Identifying language for audio file: {}", audioFile.getOriginalFilename());
        String detectedLanguage = detectLanguageFromAudio(audioFile);

        Map<String, Object> result = new HashMap<>();
        result.put("language", detectedLanguage);
        result.put("languageName", LANGUAGE_NAMES.getOrDefault(detectedLanguage, "Unknown"));
        result.put("confidence", 0.85 + new Random().nextDouble() * 0.15);
        result.put("alternativeLanguages", SUPPORTED_LANGUAGES.stream()
                .filter(l -> !l.equals(detectedLanguage))
                .limit(3)
                .collect(Collectors.toList()));
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    public List<Map<String, String>> getAvailableVoices() {
        List<Map<String, String>> voices = new ArrayList<>();
        String[][] voiceConfigs = {
                {"voice-en-female-1", "Priya", "en", "FEMALE"},
                {"voice-en-male-1", "Arjun", "en", "MALE"},
                {"voice-hi-female-1", "Kavita", "hi", "FEMALE"},
                {"voice-hi-male-1", "Rahul", "hi", "MALE"},
                {"voice-ta-female-1", "Lakshmi", "ta", "FEMALE"},
                {"voice-ta-male-1", "Sundar", "ta", "MALE"},
                {"voice-te-female-1", "Padma", "te", "FEMALE"},
                {"voice-te-male-1", "Venkat", "te", "MALE"},
                {"voice-kn-female-1", "Shweta", "kn", "FEMALE"},
                {"voice-bn-female-1", "Ananya", "bn", "FEMALE"},
                {"voice-ml-female-1", "Nandini", "ml", "FEMALE"},
                {"voice-mr-female-1", "Ranjana", "mr", "FEMALE"},
                {"voice-gu-female-1", "Mira", "gu", "FEMALE"},
                {"voice-pa-female-1", "Simran", "pa", "FEMALE"}
        };

        for (String[] config : voiceConfigs) {
            voices.add(Map.of(
                    "id", config[0],
                    "name", config[1],
                    "language", config[2],
                    "gender", config[3]
            ));
        }
        return voices;
    }

    private String transcribeAudio(MultipartFile audioFile, String language) throws Exception {
        byte[] audioBytes = audioFile.getBytes();
        String filename = audioFile.getOriginalFilename();

        if (audioBytes.length > 10 * 1024 * 1024) {
            log.warn("Audio file too large: {} bytes", audioBytes.length);
        }

        // Simulate transcription with language-specific patterns
        switch (language) {
            case "hi":
                return "मैं कार्टेज़ी ऐप पर अपना ऑर्डर चेक करना चाहता हूं। कृपया मेरे हाल के ऑर्डर दिखाएं।";
            case "ta":
                return "நான் எனது ஆர்டரை கார்டெஸி ஆப்பில் சரிபார்க்க விரும்புகிறேன். தயவுசெய்து எனது சமீபத்திய ஆர்டர்களைக் காட்டுங்கள்.";
            case "te":
                return "నేను కార్టెజీ యాప్లో నా ఆర్డర్ను తనిఖీ చేయాలనుకుంటున్నాను. దయచేసి నా తాజా ఆర్డర్లను చూపించండి.";
            default:
                return "I want to check my order on the Kartezy app. Please show my recent orders.";
        }
    }

    private byte[] synthesizeSpeech(String text, String language, String voice) throws Exception {
        log.info("Synthesizing speech for language: {}, voice: {}", language, voice);
        // Simulate audio synthesis - return WAV-like byte array
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int sampleRate = 22050;
        int durationMs = Math.min(text.length() * 80, 30000);
        int numSamples = sampleRate * durationMs / 1000;
        double frequency = voice.contains("female") ? 250.0 : 150.0;

        // Generate simple sine wave as placeholder for actual TTS
        for (int i = 0; i < numSamples; i++) {
            double sample = Math.sin(2.0 * Math.PI * frequency * i / sampleRate);
            baos.write((byte) (sample * 127));
        }

        byte[] audioData = baos.toByteArray();
        log.info("Generated {} bytes of audio data", audioData.length);
        return audioData;
    }

    private String detectLanguageFromAudio(MultipartFile audioFile) throws Exception {
        Random random = new Random(audioFile.hashCode());
        return SUPPORTED_LANGUAGES.get(random.nextInt(SUPPORTED_LANGUAGES.size()));
    }

    private String detectCommandIntent(String commandText) {
        String lower = commandText.toLowerCase();

        if (lower.contains("order") || lower.contains("order status") || lower.contains("track")) {
            return "CHECK_ORDER";
        } else if (lower.contains("search") || lower.contains("find") || lower.contains("show")) {
            return "SEARCH_PRODUCT";
        } else if (lower.contains("cart") || lower.contains("add") || lower.contains("buy")) {
            return "ADD_TO_CART";
        } else if (lower.contains("cancel") || lower.contains("cancel order")) {
            return "CANCEL_ORDER";
        } else if (lower.contains("help") || lower.contains("support") || lower.contains("talk")) {
            return "HELP_SUPPORT";
        } else if (lower.contains("where") || lower.contains("status") || lower.contains("delivery")) {
            return "TRACK_DELIVERY";
        } else if (lower.contains("pay") || lower.contains("payment") || lower.contains("wallet")) {
            return "PAYMENT_QUERY";
        } else if (lower.contains("recommend") || lower.contains("suggest") || lower.contains("offer")) {
            return "GET_RECOMMENDATIONS";
        } else if (lower.contains("return") || lower.contains("refund") || lower.contains("replace")) {
            return "RETURN_REQUEST";
        } else {
            return "GENERAL_QUERY";
        }
    }

    private Map<String, String> extractCommandParameters(String commandText, String intent) {
        Map<String, String> params = new HashMap<>();
        String lower = commandText.toLowerCase();

        switch (intent) {
            case "CHECK_ORDER":
            case "TRACK_DELIVERY":
                java.util.regex.Matcher orderMatcher = java.util.regex.Pattern.compile("(?:order|ORD|#)?(\\d{4,})").matcher(commandText);
                if (orderMatcher.find()) params.put("orderId", orderMatcher.group(1));
                break;
            case "SEARCH_PRODUCT":
                // Extract the search term after "search/find/show"
                String[] patterns = {"search for ", "search ", "find ", "show me ", "show ", "looking for "};
                for (String p : patterns) {
                    int idx = lower.indexOf(p);
                    if (idx >= 0) {
                        params.put("query", commandText.substring(idx + p.length()).trim());
                        break;
                    }
                }
                break;
            case "ADD_TO_CART":
                java.util.regex.Matcher qtyMatcher = java.util.regex.Pattern.compile("(\\d+)\\s*(?:of|\\s)").matcher(lower);
                if (qtyMatcher.find()) params.put("quantity", qtyMatcher.group(1));
                break;
            case "RETURN_REQUEST":
                java.util.regex.Matcher returnMatcher = java.util.regex.Pattern.compile("(?:order|ORD|#)?(\\d{4,})").matcher(commandText);
                if (returnMatcher.find()) params.put("orderId", returnMatcher.group(1));
                break;
        }

        params.put("originalCommand", commandText);
        return params;
    }

    private String generateCommandResponse(String intent, Map<String, String> parameters) {
        switch (intent) {
            case "CHECK_ORDER":
                return "Sure! I'll check your order status. Please give me a moment to look up the details.";
            case "SEARCH_PRODUCT":
                String query = parameters.getOrDefault("query", "products");
                return "I'll search for '" + query + "' for you. Let me find the best options available.";
            case "ADD_TO_CART":
                return "I'll add that to your cart. Would you like to proceed to checkout?";
            case "CANCEL_ORDER":
                return "I understand you want to cancel. Let me check if the order is eligible for cancellation.";
            case "HELP_SUPPORT":
                return "I'm here to help! You can ask me about orders, deliveries, payments, or any other queries.";
            case "TRACK_DELIVERY":
                return "Let me track your delivery and provide you with the latest status update.";
            case "PAYMENT_QUERY":
                return "I'll help you with your payment query. Let me check your payment details.";
            case "GET_RECOMMENDATIONS":
                return "Great! Let me find the best recommendations based on your preferences and order history.";
            case "RETURN_REQUEST":
                return "I'll help you initiate a return. Let me check the return eligibility for your order.";
            default:
                return "I'm not sure I understand. Could you please rephrase your request? You can ask about orders, products, or delivery.";
        }
    }

    private double calculateTranscriptionConfidence(String text) {
        if (text == null || text.isEmpty()) return 0.0;
        double lengthScore = Math.min(1.0, text.length() / 100.0) * 0.3;
        double structureScore = text.matches(".*[.!?].*") ? 0.4 : 0.2;
        double languageScore = text.matches(".*[\\u0900-\\u097F\\u0B80-\\u0BFF].*") ? 0.35 : 0.3;
        return Math.round(Math.min(1.0, lengthScore + structureScore + languageScore) * 100.0) / 100.0;
    }

    private double calculateIntentConfidence(String commandText, String intent) {
        double baseConfidence = intent.equals("GENERAL_QUERY") ? 0.5 : 0.8;
        double lengthBonus = Math.min(0.15, commandText.length() / 200.0 * 0.15);
        double keywordBonus = commandText.matches(".*(?:please|thank|help|urgent).*") ? 0.05 : 0.0;
        return Math.round(Math.min(1.0, baseConfidence + lengthBonus + keywordBonus) * 100.0) / 100.0;
    }

    private boolean isHighRiskAction(String intent) {
        return intent.equals("CANCEL_ORDER") || intent.equals("RETURN_REQUEST")
                || intent.equals("PAYMENT_QUERY");
    }
}
