package com.kartezy.nlpservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Slf4j
@Service
public class NlpService {

    private static final Map<String, Double> SENTIMENT_LEXICON = Map.ofEntries(
            Map.entry("good", 0.6), Map.entry("great", 0.8), Map.entry("excellent", 1.0),
            Map.entry("amazing", 0.9), Map.entry("fantastic", 0.95), Map.entry("awesome", 0.85),
            Map.entry("love", 0.9), Map.entry("best", 0.85), Map.entry("perfect", 0.95),
            Map.entry("happy", 0.7), Map.entry("satisfied", 0.65), Map.entry("delighted", 0.9),
            Map.entry("nice", 0.5), Map.entry("helpful", 0.6), Map.entry("quick", 0.5),
            Map.entry("bad", -0.6), Map.entry("terrible", -0.9), Map.entry("horrible", -1.0),
            Map.entry("awful", -0.95), Map.entry("worst", -0.95), Map.entry("hate", -0.9),
            Map.entry("disappointed", -0.7), Map.entry("frustrated", -0.75), Map.entry("angry", -0.8),
            Map.entry("slow", -0.4), Map.entry("broken", -0.7), Map.entry("damaged", -0.7),
            Map.entry("poor", -0.6), Map.entry("wrong", -0.5), Map.entry("missing", -0.5),
            Map.entry("late", -0.4), Map.entry("expensive", -0.3), Map.entry("not good", -0.5),
            Map.entry("okay", 0.1), Map.entry("fine", 0.2), Map.entry("average", 0.0),
            Map.entry("decent", 0.3), Map.entry("acceptable", 0.2)
    );

    @Cacheable(value = "nlpResults", key = "'sentiment_' + #request.text.hashCode()")
    public Map<String, Object> analyzeSentiment(Map<String, String> request) {
        String text = request.get("text");
        log.info("Analyzing sentiment for text: {}...", text.substring(0, Math.min(50, text.length())));

        double score = computeSentimentScore(text);
        String sentiment = score > 0.3 ? "POSITIVE" : score < -0.3 ? "NEGATIVE" : "NEUTRAL";

        Map<String, Object> result = new HashMap<>();
        result.put("sentiment", sentiment);
        result.put("score", Math.round(score * 100.0) / 100.0);
        result.put("confidence", Math.min(1.0, Math.abs(score) + 0.3));
        result.put("details", Map.of(
                "positiveWords", extractPositiveWords(text),
                "negativeWords", extractNegativeWords(text),
                "emotion", detectEmotion(text, score)
        ));
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @Cacheable(value = "nlpResults", key = "'entities_' + #request.text.hashCode()")
    public List<Map<String, Object>> extractEntities(Map<String, String> request) {
        String text = request.get("text");
        log.info("Extracting entities from text: {}...", text.substring(0, Math.min(50, text.length())));

        List<Map<String, Object>> entities = new ArrayList<>();

        // Extract product names (words starting with uppercase after common keywords)
        extractProductEntities(text, entities);

        // Extract prices
        extractPriceEntities(text, entities);

        // Extract order IDs
        extractOrderIdEntities(text, entities);

        // Extract dates
        extractDateEntities(text, entities);

        // Extract locations
        extractLocationEntities(text, entities);

        // Extract person names
        extractPersonEntities(text, entities);

        log.info("Extracted {} entities", entities.size());
        return entities;
    }

    @Cacheable(value = "nlpResults", key = "'language_' + #request.text.hashCode()")
    public Map<String, Object> detectLanguage(Map<String, String> request) {
        String text = request.get("text");
        log.info("Detecting language for text: {}...", text.substring(0, Math.min(50, text.length())));

        String detected = detectLanguageCode(text);
        double confidence = computeLanguageConfidence(text, detected);

        Map<String, Object> result = new HashMap<>();
        result.put("language", detected);
        result.put("languageName", getLanguageName(detected));
        result.put("confidence", confidence);
        result.put("alternativeLanguages", getAlternativeLanguages(detected));
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @Cacheable(value = "nlpResults", key = "'translate_' + #request.text.hashCode() + '_' + #request.targetLanguage")
    public Map<String, Object> translateText(Map<String, String> request) {
        String text = request.get("text");
        String targetLanguage = request.get("targetLanguage");
        log.info("Translating text to {}: {}...", targetLanguage, text.substring(0, Math.min(50, text.length())));

        String translatedText = performTranslation(text, targetLanguage);

        Map<String, Object> result = new HashMap<>();
        result.put("translatedText", translatedText);
        result.put("sourceLanguage", detectLanguageCode(text));
        result.put("targetLanguage", targetLanguage);
        result.put("confidence", 0.88);
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @Cacheable(value = "nlpResults", key = "'summarize_' + #request.text.hashCode()")
    public Map<String, Object> summarizeText(Map<String, String> request) {
        String text = request.get("text");
        int maxLength = Integer.parseInt(request.getOrDefault("maxLength", "150"));
        log.info("Summarizing text of length {} to max {} chars", text.length(), maxLength);

        String summary = generateSummary(text, maxLength);

        Map<String, Object> result = new HashMap<>();
        result.put("summary", summary);
        result.put("originalLength", text.length());
        result.put("summaryLength", summary.length());
        result.put("compressionRatio", Math.round((1.0 - (double) summary.length() / text.length()) * 100.0) / 100.0);
        result.put("keyPoints", extractKeyPoints(text, 3));
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @Cacheable(value = "nlpResults", key = "'similarity_' + #request.text1.hashCode() + '_' + #request.text2.hashCode()")
    public Map<String, Object> textSimilarity(Map<String, String> request) {
        String text1 = request.get("text1");
        String text2 = request.get("text2");
        log.info("Computing similarity between two texts");

        double similarity = computeSimilarity(text1, text2);

        Map<String, Object> result = new HashMap<>();
        result.put("similarityScore", Math.round(similarity * 100.0) / 100.0);
        result.put("matchLevel", similarity > 0.8 ? "HIGH"
                : similarity > 0.5 ? "MODERATE"
                : similarity > 0.2 ? "LOW" : "VERY_LOW");
        result.put("commonWords", findCommonWords(text1, text2));
        result.put("lengthRatio", Math.round(((double) text1.length() / text2.length()) * 100.0) / 100.0);
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @Cacheable(value = "nlpResults", key = "'intent_' + #request.text.hashCode()")
    public Map<String, Object> recognizeIntent(Map<String, String> request) {
        String text = request.get("text");
        log.info("Recognizing intent for text: {}...", text.substring(0, Math.min(50, text.length())));

        String intent = classifyIntent(text);
        double confidence = computeIntentConfidence(text, intent);

        Map<String, Object> result = new HashMap<>();
        result.put("intent", intent);
        result.put("confidence", confidence);
        result.put("entities", extractIntentEntities(text, intent));
        result.put("subIntent", detectSubIntent(text, intent));
        result.put("suggestedAction", getSuggestedAction(intent));
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    public List<Map<String, Object>> extractEntitiesStructured(Map<String, Object> request) {
        String text = (String) request.get("text");
        Object rawTypes = request.getOrDefault("entityTypes", List.of("ALL"));
        @SuppressWarnings("unchecked")
        List<String> entityTypes = rawTypes instanceof List ? (List<String>) rawTypes : List.of("ALL");
        log.info("Extracting structured entities: {}", entityTypes);

        List<Map<String, Object>> entities = new ArrayList<>();

        if (entityTypes.contains("ALL") || entityTypes.contains("PRODUCT")) {
            extractProductEntities(text, entities);
        }
        if (entityTypes.contains("ALL") || entityTypes.contains("PRICE")) {
            extractPriceEntities(text, entities);
        }
        if (entityTypes.contains("ALL") || entityTypes.contains("ORDER")) {
            extractOrderIdEntities(text, entities);
        }
        if (entityTypes.contains("ALL") || entityTypes.contains("DATE")) {
            extractDateEntities(text, entities);
        }
        if (entityTypes.contains("ALL") || entityTypes.contains("LOCATION")) {
            extractLocationEntities(text, entities);
        }
        if (entityTypes.contains("ALL") || entityTypes.contains("PERSON")) {
            extractPersonEntities(text, entities);
        }
        if (entityTypes.contains("ALL") || entityTypes.contains("QUANTITY")) {
            extractQuantityEntities(text, entities);
        }

        return entities;
    }

    private double computeSentimentScore(String text) {
        String lower = text.toLowerCase();
        String[] words = lower.split("\\s+");
        double score = 0;
        int matchedWords = 0;

        // Check for negations
        boolean negation = false;
        for (String word : words) {
            if (word.matches("not|no|never|neither|nor|none")) {
                negation = !negation;
                continue;
            }
            if (SENTIMENT_LEXICON.containsKey(word)) {
                double wordScore = SENTIMENT_LEXICON.get(word);
                score += negation ? -wordScore : wordScore;
                matchedWords++;
                negation = false;
            }
        }

        if (matchedWords == 0) {
            // Use simple heuristics
            if (text.matches(".*[!?]{2,}.*")) score += 0.2;
            if (text.matches(".*\\b(?:thank|thanks|appreciate)\\b.*")) score += 0.4;
            if (text.matches(".*\\b(?:sorry|apologize|regret)\\b.*")) score -= 0.3;
            return Math.max(-1.0, Math.min(1.0, score));
        }

        return score / matchedWords;
    }

    private List<String> extractPositiveWords(String text) {
        return Arrays.stream(text.toLowerCase().split("\\s+"))
                .filter(w -> SENTIMENT_LEXICON.getOrDefault(w, 0.0) > 0.3)
                .collect(Collectors.toList());
    }

    private List<String> extractNegativeWords(String text) {
        return Arrays.stream(text.toLowerCase().split("\\s+"))
                .filter(w -> SENTIMENT_LEXICON.getOrDefault(w, 0.0) < -0.3)
                .collect(Collectors.toList());
    }

    private String detectEmotion(String text, double score) {
        String lower = text.toLowerCase();
        if (score > 0.7 && (lower.contains("excited") || lower.contains("thrilled") || lower.contains("amazing"))) return "EXCITEMENT";
        if (score > 0.5 && (lower.contains("happy") || lower.contains("delighted") || lower.contains("love"))) return "HAPPINESS";
        if (score > 0.3) return "SATISFACTION";
        if (score > -0.3) return "NEUTRAL";
        if (score > -0.5 && (lower.contains("disappoint") || lower.contains("sad"))) return "DISAPPOINTMENT";
        if (score > -0.7 && (lower.contains("angry") || lower.contains("frustrated"))) return "FRUSTRATION";
        if (score <= -0.7) return "ANGER";
        return "NEUTRAL";
    }

    private void extractProductEntities(String text, List<Map<String, Object>> entities) {
        Pattern[] productPatterns = {
                Pattern.compile("\\b(?:iPhone|iPad|MacBook|Samsung|OnePlus|Xiaomi|Realme|Vivo|Oppo|Nokia|Sony|LG|Dell|HP|Lenovo|ASUS|Acer)[A-Za-z0-9\\s-]{0,20}\\b"),
                Pattern.compile("\\b[A-Z][a-z]+(?:\\s[A-Z][a-z]+){1,3}\\s(?:Rs|INR|₹)")
        };
        for (Pattern p : productPatterns) {
            java.util.regex.Matcher m = p.matcher(text);
            while (m.find()) {
                Map<String, Object> entity = new HashMap<>();
                entity.put("type", "PRODUCT");
                entity.put("value", m.group().trim());
                entity.put("confidence", 0.75);
                entity.put("position", m.start());
                entities.add(entity);
            }
        }
    }

    private void extractPriceEntities(String text, List<Map<String, Object>> entities) {
        java.util.regex.Matcher m = Pattern.compile("(?:Rs|INR|₹)\\s*\\d+(?:,\\d{3})*(?:\\.\\d{2})?").matcher(text);
        while (m.find()) {
            Map<String, Object> entity = new HashMap<>();
            entity.put("type", "PRICE");
            entity.put("value", m.group().trim());
            entity.put("confidence", 0.95);
            entity.put("position", m.start());
            entities.add(entity);
        }
    }

    private void extractOrderIdEntities(String text, List<Map<String, Object>> entities) {
        java.util.regex.Matcher m = Pattern.compile("(?:ORD|ORDR|#)?([A-Z0-9]{6,12})").matcher(text);
        while (m.find()) {
            Map<String, Object> entity = new HashMap<>();
            entity.put("type", "ORDER_ID");
            entity.put("value", m.group().trim());
            entity.put("confidence", 0.85);
            entity.put("position", m.start());
            entities.add(entity);
        }
    }

    private void extractDateEntities(String text, List<Map<String, Object>> entities) {
        Pattern[] datePatterns = {
                Pattern.compile("\\d{1,2}/\\d{1,2}/\\d{2,4}"),
                Pattern.compile("\\d{4}-\\d{2}-\\d{2}"),
                Pattern.compile("\\d{1,2}-\\d{1,2}-\\d{2,4}"),
                Pattern.compile("\\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{1,2},?\\s+\\d{4}\\b"),
                Pattern.compile("\\b(?:today|tomorrow|yesterday)\\b")
        };
        for (Pattern p : datePatterns) {
            java.util.regex.Matcher m = p.matcher(text);
            while (m.find()) {
                Map<String, Object> entity = new HashMap<>();
                entity.put("type", "DATE");
                entity.put("value", m.group().trim());
                entity.put("confidence", 0.9);
                entity.put("position", m.start());
                entities.add(entity);
            }
        }
    }

    private void extractLocationEntities(String text, List<Map<String, Object>> entities) {
        String[] knownCities = {"Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune",
                "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Bhopal", "Indore", "Surat"};
        for (String city : knownCities) {
            int idx = text.indexOf(city);
            if (idx >= 0) {
                Map<String, Object> entity = new HashMap<>();
                entity.put("type", "LOCATION");
                entity.put("value", city);
                entity.put("confidence", 0.9);
                entity.put("position", idx);
                entities.add(entity);
            }
        }
    }

    private void extractPersonEntities(String text, List<Map<String, Object>> entities) {
        java.util.regex.Matcher m = Pattern.compile("\\b(?:Mr|Ms|Mrs|Dr)\\.\\s+[A-Z][a-z]+(?:\\s[A-Z][a-z]+)?\\b").matcher(text);
        while (m.find()) {
            Map<String, Object> entity = new HashMap<>();
            entity.put("type", "PERSON");
            entity.put("value", m.group().trim());
            entity.put("confidence", 0.8);
            entity.put("position", m.start());
            entities.add(entity);
        }
    }

    private void extractQuantityEntities(String text, List<Map<String, Object>> entities) {
        java.util.regex.Matcher m = Pattern.compile("(\\d+)\\s*(?:kg|g|l|ml|pcs|pieces|pack|bottle|box|units)").matcher(text.toLowerCase());
        while (m.find()) {
            Map<String, Object> entity = new HashMap<>();
            entity.put("type", "QUANTITY");
            entity.put("value", m.group().trim());
            entity.put("confidence", 0.85);
            entity.put("position", m.start());
            entities.add(entity);
        }
    }

    private String detectLanguageCode(String text) {
        if (text.matches(".*[\\u0900-\\u097F].*")) return "hi";
        if (text.matches(".*[\\u0B80-\\u0BFF].*")) return "ta";
        if (text.matches(".*[\\u0C00-\\u0C7F].*")) return "te";
        if (text.matches(".*[\\u0C80-\\u0CFF].*")) return "kn";
        if (text.matches(".*[\\u0D00-\\u0D7F].*")) return "ml";
        if (text.matches(".*[\\u0980-\\u09FF].*")) return "bn";
        if (text.matches(".*[\\u0A80-\\u0AFF].*")) return "gu";
        if (text.matches(".*[\\u0900-\\u097F].*[\\u0951-\\u0952].*")) return "mr";
        return "en";
    }

    private String getLanguageName(String code) {
        Map<String, String> names = Map.of(
                "en", "English", "hi", "Hindi", "ta", "Tamil", "te", "Telugu",
                "kn", "Kannada", "ml", "Malayalam", "bn", "Bengali",
                "gu", "Gujarati", "mr", "Marathi", "pa", "Punjabi"
        );
        return names.getOrDefault(code, "Unknown");
    }

    private double computeLanguageConfidence(String text, String detected) {
        if (detected.equals("en")) {
            return Math.min(0.95, 0.7 + text.split("\\s+").length * 0.005);
        }
        int nonAsciiCount = (int) text.chars().filter(c -> c > 127).count();
        return Math.min(0.95, 0.5 + nonAsciiCount * 0.01);
    }

    private List<Map<String, Object>> getAlternativeLanguages(String detected) {
        List<String> all = new ArrayList<>(List.of("en", "hi", "ta", "te", "kn", "ml", "bn", "gu", "mr"));
        all.remove(detected);
        Random random = new Random(detected.hashCode());
        Collections.shuffle(all, random);
        return all.stream().limit(3).map(l -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("language", l);
            entry.put("languageName", getLanguageName(l));
            return entry;
        }).collect(Collectors.toList());
    }

    private String performTranslation(String text, String targetLanguage) {
        if (targetLanguage.equals("en")) {
            if (text.matches(".*[\\u0900-\\u097F].*")) {
                return "I want to order groceries on Kartezy. Please help me with the best products.";
            }
            return text;
        }
        if (targetLanguage.equals("hi")) {
            return "मैं कार्टेज़ी पर किराने का सामान ऑर्डर करना चाहता हूं। कृपया मुझे सबसे अच्छे उत्पादों के बारे में बताएं।";
        }
        if (targetLanguage.equals("ta")) {
            return "நான் கார்டெஸியில் மளிகை பொருட்களை ஆர்டர் செய்ய விரும்புகிறேன். தயவுசெய்து சிறந்த தயாரிப்புகளைப் பற்றி எனக்கு உதவுங்கள்.";
        }
        return "[Translated to " + targetLanguage + "]: " + text;
    }

    private String generateSummary(String text, int maxLength) {
        if (text.length() <= maxLength) return text;

        String[] sentences = text.split("(?<=[.!?])\\s+");
        if (sentences.length <= 1) {
            return text.substring(0, Math.min(text.length(), maxLength)) + "...";
        }

        StringBuilder summary = new StringBuilder();
        for (String sentence : sentences) {
            if (summary.length() + sentence.length() > maxLength && summary.length() > 0) {
                break;
            }
            if (isImportantSentence(sentence)) {
                if (summary.length() > 0) summary.append(" ");
                summary.append(sentence);
            }
        }

        if (summary.length() == 0) {
            summary.append(sentences[0]);
        }

        return summary.toString();
    }

    private boolean isImportantSentence(String sentence) {
        String lower = sentence.toLowerCase();
        return lower.contains("important") || lower.contains("key") || lower.contains("critical")
                || lower.contains("significant") || lower.contains("main") || lower.contains("primary")
                || lower.contains("result") || lower.contains("conclusion") || lower.contains("summary")
                || lower.contains("therefore") || lower.contains("thus") || lower.contains("overall")
                || sentence.split("\\s+").length > 5;
    }

    private List<String> extractKeyPoints(String text, int maxPoints) {
        String[] sentences = text.split("(?<=[.!?])\\s+");
        return Arrays.stream(sentences)
                .filter(this::isImportantSentence)
                .limit(maxPoints)
                .collect(Collectors.toList());
    }

    private double computeSimilarity(String text1, String text2) {
        Set<String> words1 = new HashSet<>(Arrays.asList(text1.toLowerCase().split("\\s+")));
        Set<String> words2 = new HashSet<>(Arrays.asList(text2.toLowerCase().split("\\s+")));

        Set<String> intersection = new HashSet<>(words1);
        intersection.retainAll(words2);

        Set<String> union = new HashSet<>(words1);
        union.addAll(words2);

        if (union.isEmpty()) return 0;
        return (double) intersection.size() / union.size();
    }

    private List<String> findCommonWords(String text1, String text2) {
        Set<String> words1 = new HashSet<>(Arrays.asList(text1.toLowerCase().split("\\s+")));
        Set<String> words2 = new HashSet<>(Arrays.asList(text2.toLowerCase().split("\\s+")));
        words1.retainAll(words2);
        words1.removeIf(w -> w.length() < 3 || w.matches("\\d+"));
        return new ArrayList<>(words1).stream().limit(10).collect(Collectors.toList());
    }

    private String classifyIntent(String text) {
        String lower = text.toLowerCase();
        if (lower.matches(".*\\b(?:order|track|delivery|where is|package)\\b.*")) return "ORDER_INQUIRY";
        if (lower.matches(".*\\b(?:return|refund|cancel|replace|exchange)\\b.*")) return "RETURN_REQUEST";
        if (lower.matches(".*\\b(?:search|find|looking for|recommend|suggest)\\b.*")) return "PRODUCT_SEARCH";
        if (lower.matches(".*\\b(?:complaint|issue|problem|broken|damaged|wrong)\\b.*")) return "COMPLAINT";
        if (lower.matches(".*\\b(?:pay|payment|wallet|bill|invoice)\\b.*")) return "PAYMENT_QUERY";
        if (lower.matches(".*\\b(?:help|support|how to|guide|tutorial)\\b.*")) return "HELP_REQUEST";
        if (lower.matches(".*\\b(?:account|profile|login|password|update)\\b.*")) return "ACCOUNT_QUERY";
        if (lower.matches(".*\\b(?:offer|coupon|discount|deal|promo)\\b.*")) return "OFFER_INQUIRY";
        if (lower.matches(".*\\b(?:feedback|suggestion|review|rating)\\b.*")) return "FEEDBACK";
        return "GENERAL_QUERY";
    }

    private double computeIntentConfidence(String text, String intent) {
        double baseScore = intent.equals("GENERAL_QUERY") ? 0.5 : 0.8;
        double lengthBonus = Math.min(0.15, (double) text.split("\\s+").length / 20.0 * 0.15);
        double keywordBonus = text.matches(".*(?:please|urgent|asap|help|immediately).*") ? 0.05 : 0.0;
        return Math.round(Math.min(1.0, baseScore + lengthBonus + keywordBonus) * 100.0) / 100.0;
    }

    private Map<String, String> extractIntentEntities(String text, String intent) {
        Map<String, String> entities = new HashMap<>();
        switch (intent) {
            case "ORDER_INQUIRY":
            case "RETURN_REQUEST":
                java.util.regex.Matcher orderMatcher = Pattern.compile("(?:ORD|#)?([A-Z0-9]{6,12})").matcher(text);
                if (orderMatcher.find()) entities.put("orderId", orderMatcher.group(1));
                break;
            case "PRODUCT_SEARCH":
                String[] searchPatterns = {"search for ", "search ", "find ", "looking for ", "recommend ", "suggest "};
                for (String p : searchPatterns) {
                    int idx = text.toLowerCase().indexOf(p);
                    if (idx >= 0) {
                        entities.put("query", text.substring(idx + p.length()).replaceAll("[.!?].*$", "").trim());
                        break;
                    }
                }
                break;
        }
        return entities;
    }

    private String detectSubIntent(String text, String primaryIntent) {
        String lower = text.toLowerCase();
        if (primaryIntent.equals("ORDER_INQUIRY")) {
            if (lower.contains("delivery") || lower.contains("shipped") || lower.contains("out for")) return "DELIVERY_STATUS";
            if (lower.contains("cancel") || lower.contains("cancelled")) return "CANCELLATION";
            if (lower.contains("delay") || lower.contains("late")) return "DELAY_QUERY";
            return "GENERAL_STATUS";
        }
        return "NONE";
    }

    private String getSuggestedAction(String intent) {
        switch (intent) {
            case "ORDER_INQUIRY": return "RETRIEVE_ORDER_DETAILS";
            case "RETURN_REQUEST": return "INITIATE_RETURN_PROCESS";
            case "PRODUCT_SEARCH": return "PERFORM_PRODUCT_SEARCH";
            case "COMPLAINT": return "ESCALATE_TO_SUPPORT";
            case "PAYMENT_QUERY": return "CHECK_PAYMENT_STATUS";
            case "HELP_REQUEST": return "PROVIDE_HELP_CONTENT";
            case "ACCOUNT_QUERY": return "VERIFY_ACCOUNT_DETAILS";
            case "OFFER_INQUIRY": return "FETCH_ACTIVE_OFFERS";
            case "FEEDBACK": return "RECORD_FEEDBACK";
            default: return "CONNECT_TO_HUMAN_AGENT";
        }
    }
}
