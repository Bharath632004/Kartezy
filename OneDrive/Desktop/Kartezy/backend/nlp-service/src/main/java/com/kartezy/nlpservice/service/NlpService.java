package com.kartezy.nlpservice.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class NlpService {

    private static final Set<String> POSITIVE_WORDS = Set.of("good", "great", "excellent", "amazing", "wonderful",
            "fantastic", "superb", "love", "loved", "best", "awesome", "perfect", "beautiful", "delicious",
            "fresh", "fast", "quick", "happy", "satisfied", "recommend", "outstanding", "brilliant");
    private static final Set<String> NEGATIVE_WORDS = Set.of("bad", "terrible", "awful", "horrible", "worst",
            "poor", "disappointed", "hate", "hated", "broken", "damaged", "stale", "rotten", "slow",
            "late", "rude", "angry", "frustrated", "disgusting");
    private static final Set<String> INTENSIFIERS = Set.of("very", "extremely", "incredibly", "absolutely",
            "totally", "completely", "highly", "really", "so", "too", "super");

    private static final Map<String, List<String>> INTENT_PATTERNS = Map.of(
            "place_order", List.of("order", "buy", "purchase", "get", "want"),
            "track_order", List.of("track", "where is my order", "order status", "delivery status"),
            "cancel_order", List.of("cancel", "cancel order"),
            "return_order", List.of("return", "refund", "exchange", "replace"),
            "support", List.of("help", "support", "problem", "issue", "complaint"),
            "search_product", List.of("search", "find", "looking for", "need"),
            "checkout", List.of("checkout", "pay", "payment", "bill"),
            "account", List.of("account", "profile", "password", "login", "signup"),
            "feedback", List.of("feedback", "review", "rate", "rating", "suggestion"),
            "greeting", List.of("hi", "hello", "hey", "namaste", "good morning"));

    public Map<String, Object> analyzeSentiment(String text) {
        if (text == null || text.trim().isEmpty())
            return Map.of("sentiment", "neutral", "score", 0.0, "confidence", 0.0);

        String[] words = text.toLowerCase().split("\\W+");
        double score = 0;
        int count = 0, intensifierCount = 0;

        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            double wordScore = 0;
            if (POSITIVE_WORDS.contains(word)) { wordScore = 1.0; count++; }
            else if (NEGATIVE_WORDS.contains(word)) { wordScore = -1.0; count++; }
            if (wordScore != 0 && i > 0 && INTENSIFIERS.contains(words[i - 1])) { wordScore *= 1.5; intensifierCount++; }
            if (wordScore != 0 && i < words.length - 1 && words[i + 1].equals("not")) wordScore *= -1;
            score += wordScore;
        }

        double sigScore = 1.0 / (1.0 + Math.exp(-score / Math.max(count, 1)));
        String sentiment = sigScore > 0.6 ? "positive" : sigScore < 0.4 ? "negative" : "neutral";
        return Map.of("sentiment", sentiment, "score", Math.round(sigScore * 100.0) / 100.0,
                "confidence", Math.min(1.0, count * 0.15),
                "details", Map.of("positiveWords", (int) Arrays.stream(words).filter(POSITIVE_WORDS::contains).count(),
                        "negativeWords", (int) Arrays.stream(words).filter(NEGATIVE_WORDS::contains).count(),
                        "intensifiers", intensifierCount, "totalWords", words.length));
    }

    public List<Map<String, Object>> extractEntities(String text) {
        List<Map<String, Object>> entities = new ArrayList<>();
        if (text == null || text.trim().isEmpty()) return entities;

        // Money patterns
        Matcher m = Pattern.compile("(?:Rs\\.?|₹|INR)\\s*(\\d+(?:,\\d{3})*(?:\\.\\d{1,2})?)", Pattern.CASE_INSENSITIVE).matcher(text);
        while (m.find()) entities.add(Map.of("type", "MONEY", "value", m.group(1).replace(",", ""), "confidence", 0.85));

        // Date patterns
        m = Pattern.compile("\\d{1,2}[-/]\\d{1,2}[-/]\\d{2,4}|\\d{1,2}\\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+\\d{2,4}", Pattern.CASE_INSENSITIVE).matcher(text);
        while (m.find()) entities.add(Map.of("type", "DATE", "value", m.group(), "confidence", 0.8));

        // Phone pattern
        m = Pattern.compile("\\b\\d{10}\\b").matcher(text);
        while (m.find()) entities.add(Map.of("type", "PHONE", "value", m.group(), "confidence", 0.9));

        // Email pattern
        m = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}").matcher(text);
        while (m.find()) entities.add(Map.of("type", "EMAIL", "value", m.group(), "confidence", 0.95));

        // Pincode pattern
        m = Pattern.compile("\\b\\d{6}\\b").matcher(text);
        while (m.find()) entities.add(Map.of("type", "PINCODE", "value", m.group(), "confidence", 0.85));

        // Order ID pattern
        m = Pattern.compile("(?:order|ORD)\\s*(?:#|no|number)?\\s*[A-Z0-9]{5,15}", Pattern.CASE_INSENSITIVE).matcher(text);
        while (m.find()) entities.add(Map.of("type", "ORDER_ID", "value", m.group(), "confidence", 0.9));

        return entities;
    }

    public Map<String, Object> detectLanguage(String text) {
        if (text == null || text.trim().isEmpty())
            return Map.of("language", "en", "languageName", "English", "confidence", 1.0);

        Map<Character.UnicodeBlock, Integer> counts = new HashMap<>();
        for (char c : text.toCharArray()) {
            Character.UnicodeBlock block = Character.UnicodeBlock.of(c);
            if (block != null) counts.merge(block, 1, Integer::sum);
        }

        Map.Entry<Character.UnicodeBlock, Integer> dominant = counts.entrySet().stream()
                .max(Map.Entry.comparingByValue()).orElse(null);
        if (dominant == null) return Map.of("language", "en", "languageName", "English", "confidence", 0.7);

        return switch (dominant.getKey()) {
            case DEVANAGARI -> Map.of("language", "hi", "languageName", "Hindi", "confidence", 0.85);
            case TAMIL -> Map.of("language", "ta", "languageName", "Tamil", "confidence", 0.85);
            case TELUGU -> Map.of("language", "te", "languageName", "Telugu", "confidence", 0.85);
            case KANNADA -> Map.of("language", "kn", "languageName", "Kannada", "confidence", 0.85);
            case MALAYALAM -> Map.of("language", "ml", "languageName", "Malayalam", "confidence", 0.85);
            case BENGALI -> Map.of("language", "bn", "languageName", "Bengali", "confidence", 0.85);
            case GUJARATI -> Map.of("language", "gu", "languageName", "Gujarati", "confidence", 0.85);
            case GURMUKHI -> Map.of("language", "pa", "languageName", "Punjabi", "confidence", 0.85);
            default -> Map.of("language", "en", "languageName", "English", "confidence", 0.7);
        };
    }

    public Map<String, Object> summarizeText(String text, int targetLength) {
        if (text == null || text.trim().isEmpty() || text.length() <= targetLength)
            return Map.of("summary", text, "compressionRatio", 1.0, "originalLength", text != null ? text.length() : 0);

        String[] sentences = text.split("(?<=[.!?])\\s+");
        if (sentences.length <= 1)
            return Map.of("summary", text.substring(0, Math.min(targetLength, text.length())),
                    "compressionRatio", Math.round((double) targetLength / text.length() * 100.0) / 100.0,
                    "originalLength", text.length());

        List<Map.Entry<String, Double>> scored = new ArrayList<>();
        for (String sentence : sentences) {
            double score = 0;
            String[] words = sentence.toLowerCase().split("\\W+");
            for (String word : words) {
                if (POSITIVE_WORDS.contains(word) || NEGATIVE_WORDS.contains(word)) score += 2;
                if (word.length() > 6) score += 1;
            }
            scored.add(Map.entry(sentence, score + sentence.length() * 0.01));
        }

        scored.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));
        StringBuilder summary = new StringBuilder();
        for (Map.Entry<String, Double> entry : scored) {
            if (summary.length() + entry.getKey().length() > targetLength && summary.length() > 0) break;
            if (summary.length() > 0) summary.append(" ");
            summary.append(entry.getKey());
        }

        return Map.of("summary", summary.toString(),
                "compressionRatio", Math.round((double) summary.length() / text.length() * 100.0) / 100.0,
                "originalLength", text.length(), "summaryLength", summary.length());
    }

    public Map<String, Object> calculateTextSimilarity(String text1, String text2) {
        if (text1 == null || text2 == null || text1.isEmpty() || text2.isEmpty())
            return Map.of("similarityScore", 0.0, "method", "cosine");

        Set<String> unique = new HashSet<>();
        String[] w1 = text1.toLowerCase().split("\\W+");
        String[] w2 = text2.toLowerCase().split("\\W+");
        unique.addAll(Arrays.asList(w1));
        unique.addAll(Arrays.asList(w2));

        Map<String, Integer> f1 = new HashMap<>(), f2 = new HashMap<>();
        for (String w : w1) f1.merge(w, 1, Integer::sum);
        for (String w : w2) f2.merge(w, 1, Integer::sum);

        double dot = 0, n1 = 0, n2 = 0;
        for (String word : unique) {
            dot += (long) f1.getOrDefault(word, 0) * f2.getOrDefault(word, 0);
            n1 += Math.pow(f1.getOrDefault(word, 0), 2);
            n2 += Math.pow(f2.getOrDefault(word, 0), 2);
        }

        double cosine = (n1 == 0 || n2 == 0) ? 0 : dot / (Math.sqrt(n1) * Math.sqrt(n2));
        Set<String> intersection = new HashSet<>(Arrays.asList(w1));
        intersection.retainAll(Arrays.asList(w2));
        double jaccard = (double) intersection.size() / unique.size();

        return Map.of("similarityScore", Math.round(cosine * 100.0) / 100.0,
                "jaccardSimilarity", Math.round(jaccard * 100.0) / 100.0,
                "overallScore", Math.round(((cosine + jaccard) / 2) * 100.0) / 100.0);
    }

    public Map<String, Object> recognizeIntent(String text) {
        if (text == null || text.trim().isEmpty())
            return Map.of("intent", "unknown", "confidence", 0.0);

        String lower = text.toLowerCase();
        Map<String, Double> scores = new HashMap<>();
        INTENT_PATTERNS.forEach((intent, keywords) -> {
            double score = keywords.stream().filter(lower::contains).count() / (double) keywords.size();
            if (score > 0) scores.put(intent, score);
        });

        if (scores.isEmpty()) return Map.of("intent", "unknown", "confidence", 0.0);

        Map.Entry<String, Double> top = scores.entrySet().stream().max(Map.Entry.comparingByValue()).orElse(null);
        return top != null ? Map.of("intent", top.getKey(), "confidence", Math.round(top.getValue() * 100.0) / 100.0, "allIntents", scores)
                : Map.of("intent", "unknown", "confidence", 0.0);
    }
}
