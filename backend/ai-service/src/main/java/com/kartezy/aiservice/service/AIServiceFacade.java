package com.kartezy.aiservice.service;

import com.kartezy.shared.client.ComputerVisionServiceClient;
import com.kartezy.shared.client.FraudDetectionServiceClient;
import com.kartezy.shared.client.NlpServiceClient;
import com.kartezy.shared.client.OcrServiceClient;
import com.kartezy.shared.client.RecommendationServiceClient;
import com.kartezy.shared.client.VoiceServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIServiceFacade {

    private final RecommendationServiceClient recommendationServiceClient;
    private final FraudDetectionServiceClient fraudDetectionServiceClient;
    private final NlpServiceClient nlpServiceClient;
    private final ComputerVisionServiceClient computerVisionServiceClient;
    private final OcrServiceClient ocrServiceClient;
    private final VoiceServiceClient voiceServiceClient;

    @Autowired
    public AIServiceFacade(RecommendationServiceClient recommendationServiceClient,
                           FraudDetectionServiceClient fraudDetectionServiceClient,
                           NlpServiceClient nlpServiceClient,
                           ComputerVisionServiceClient computerVisionServiceClient,
                           OcrServiceClient ocrServiceClient,
                           VoiceServiceClient voiceServiceClient) {
        this.recommendationServiceClient = recommendationServiceClient;
        this.fraudDetectionServiceClient = fraudDetectionServiceClient;
        this.nlpServiceClient = nlpServiceClient;
        this.computerVisionServiceClient = computerVisionServiceClient;
        this.ocrServiceClient = ocrServiceClient;
        this.voiceServiceClient = voiceServiceClient;
    }

    public List<String> getPersonalizedRecommendations(String userId, int limit) {
        try {
            return recommendationServiceClient.getPersonalizedRecommendations(userId, limit);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<String> getSimilarProducts(String productId, int limit) {
        try {
            return recommendationServiceClient.getSimilarProducts(productId, limit);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<String> getFrequentlyBoughtTogether(String productId, int limit) {
        try {
            return recommendationServiceClient.getFrequentlyBoughtTogether(productId, limit);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<String> getTrendingProducts(int limit) {
        try {
            return recommendationServiceClient.getTrendingProducts(limit);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public List<String> getContextualRecommendations(String userId, int limit) {
        try {
            return recommendationServiceClient.getContextualRecommendations(userId, limit);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public Map<String, Object> checkOrderFraud(Map<String, Object> orderDetails) {
        try {
            return fraudDetectionServiceClient.checkOrderForFraud(orderDetails);
        } catch (Exception e) {
            return createDefaultFraudResponse(false);
        }
    }

    public Map<String, Object> checkAccountFraud(Map<String, Object> accountDetails) {
        try {
            return fraudDetectionServiceClient.checkAccountForFraud(accountDetails);
        } catch (Exception e) {
            return createDefaultFraudResponse(false);
        }
    }

    public Map<String, Object> checkPaymentFraud(Map<String, Object> paymentDetails) {
        try {
            return fraudDetectionServiceClient.checkPaymentForFraud(paymentDetails);
        } catch (Exception e) {
            return createDefaultFraudResponse(false);
        }
    }

    public Map<String, Object> checkPromotionAbuse(Map<String, Object> promoUsage) {
        try {
            return fraudDetectionServiceClient.checkPromotionAbuse(promoUsage);
        } catch (Exception e) {
            return createDefaultFraudResponse(false);
        }
    }

    public Map<String, Object> checkLoginFraud(Map<String, Object> loginAttempt) {
        try {
            return fraudDetectionServiceClient.checkLoginForFraud(loginAttempt);
        } catch (Exception e) {
            return createDefaultFraudResponse(false);
        }
    }

    public Map<String, Object> checkReturnFraud(Map<String, Object> returnRequest) {
        try {
            return fraudDetectionServiceClient.checkReturnForFraud(returnRequest);
        } catch (Exception e) {
            return createDefaultFraudResponse(false);
        }
    }

    public List<Map<String, Object>> getRecentFraudAlerts(int limit) {
        try {
            return fraudDetectionServiceClient.getRecentFraudAlerts(limit);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public Map<String, Object> analyzeSentiment(String text) {
        try {
            return nlpServiceClient.analyzeSentiment(Map.of("text", text));
        } catch (Exception e) {
            return Map.of("sentiment", "neutral", "score", 0.0);
        }
    }

    public List<Map<String, Object>> extractEntities(String text) {
        try {
            return nlpServiceClient.extractEntities(Map.of("text", text));
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public Map<String, Object> detectLanguage(String text) {
        try {
            return nlpServiceClient.detectLanguage(Map.of("text", text));
        } catch (Exception e) {
            return Map.of("language", "en", "confidence", 0.0);
        }
    }

    public Map<String, Object> translateText(String text, String targetLanguage) {
        try {
            return nlpServiceClient.translateText(Map.of("text", text, "targetLanguage", targetLanguage));
        } catch (Exception e) {
            return Map.of("translatedText", text);
        }
    }

    public Map<String, Object> summarizeText(String text) {
        try {
            return nlpServiceClient.summarizeText(Map.of("text", text));
        } catch (Exception e) {
            return Map.of("summary", text);
        }
    }

    public Map<String, Object> recognizeIntent(String text) {
        try {
            return nlpServiceClient.recognizeIntent(Map.of("text", text));
        } catch (Exception e) {
            return Map.of("intent", "unknown", "confidence", 0.0);
        }
    }

    public Map<String, Object> extractOcrText(MultipartFile file) throws IOException {
        try {
            return ocrServiceClient.extractText(file);
        } catch (Exception e) {
            return Map.of("text", "OCR processing failed", "confidence", 0.0);
        }
    }

    public Map<String, Object> extractOcrStructuredData(MultipartFile file, String documentType) throws IOException {
        try {
            return ocrServiceClient.extractStructuredData(file, documentType);
        } catch (Exception e) {
            return Map.of("data", Map.of(), "confidence", 0.0);
        }
    }

    public Map<String, Object> validateOcrDocument(MultipartFile file, String documentType) throws IOException {
        try {
            return ocrServiceClient.validateDocument(file, documentType);
        } catch (Exception e) {
            return Map.of("valid", false, "errors", List.of("Service unavailable"));
        }
    }

    public Map<String, Object> detectObjects(MultipartFile file) throws IOException {
        try {
            return computerVisionServiceClient.detectObjects(file);
        } catch (Exception e) {
            return Map.of("objects", List.of());
        }
    }

    public Map<String, Object> recognizeProduct(MultipartFile file) throws IOException {
        try {
            return computerVisionServiceClient.recognizeProduct(file);
        } catch (Exception e) {
            return Map.of("productId", null, "confidence", 0.0);
        }
    }

    public Map<String, Object> computeImageSimilarity(MultipartFile file1, MultipartFile file2) throws IOException {
        try {
            return computerVisionServiceClient.imageSimilarity(file1, file2);
        } catch (Exception e) {
            return Map.of("similarityScore", 0.0);
        }
    }

    public Map<String, Object> detectDuplicateProducts(MultipartFile file) throws IOException {
        try {
            return computerVisionServiceClient.detectDuplicateProducts(file);
        } catch (Exception e) {
            return Map.of("isDuplicate", false, "similarProductIds", List.of());
        }
    }

    public Map<String, Object> analyzeShelfImage(MultipartFile file) throws IOException {
        try {
            return computerVisionServiceClient.analyzeShelfImage(file);
        } catch (Exception e) {
            return Map.of("outOfStockItems", List.of(), "lowStockItems", List.of());
        }
    }

    public Map<String, Object> speechToText(MultipartFile audioFile, String language) throws IOException {
        try {
            return voiceServiceClient.speechToText(audioFile, language);
        } catch (Exception e) {
            return Map.of("text", "", "confidence", 0.0);
        }
    }

    public byte[] textToSpeech(Map<String, String> request) throws IOException {
        try {
            return voiceServiceClient.textToSpeech(request);
        } catch (Exception e) {
            return new byte[0];
        }
    }

    public Map<String, Object> processVoiceCommand(String commandText, String userId) throws IOException {
        try {
            return voiceServiceClient.processVoiceCommand(commandText, userId);
        } catch (Exception e) {
            return Map.of(
                    "action", "unknown",
                    "parameters", Map.of(),
                    "responseText", "I didn't understand that command."
            );
        }
    }

    public Map<String, Object> identifyVoiceLanguage(MultipartFile audioFile) throws IOException {
        try {
            return voiceServiceClient.identifyLanguage(audioFile);
        } catch (Exception e) {
            return Map.of("language", "en", "confidence", 0.0);
        }
    }

    public List<Map<String, String>> getAvailableVoices() {
        try {
            return voiceServiceClient.getAvailableVoices();
        } catch (Exception e) {
            return List.of(Map.of("id", "default", "name", "Default Voice", "language", "en", "gender", "FEMALE"));
        }
    }

    private Map<String, Object> createDefaultFraudResponse(boolean isFraudulent) {
        Map<String, Object> response = new HashMap<>();
        response.put("isFraudulent", isFraudulent);
        response.put("fraudScore", 0.0);
        response.put("reasons", List.of());
        response.put("recommendedAction", "APPROVE");
        return response;
    }

    public Map<String, String> retrainFraudModels(Map<String, Object> request) {
        try {
            return fraudDetectionServiceClient.retrainFraudModels(request);
        } catch (Exception e) {
            return Map.of("status", "RETRAINING_FAILED", "message", e.getMessage());
        }
    }
}