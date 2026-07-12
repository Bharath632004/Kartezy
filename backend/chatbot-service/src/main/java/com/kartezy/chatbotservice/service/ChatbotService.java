package com.kartezy.chatbotservice.service;

import com.kartezy.nlpservice.service.NlpService;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Service for chatbot operations.
 * <p>
 * This service processes user messages, understands intent and entities using NLP,
 * and generates appropriate responses. It can be integrated with various channels
 * (web, mobile, social media).
 * The methods are currently placeholders and will throw {@link UnsupportedOperationException} until
 * the underlying NLP and response generation models are implemented.
 * </p>
 */
@Service
public class ChatbotService {

    private final NlpService nlpService;

    public ChatbotService(NlpService nlpService) {
        this.nlpService = nlpService;
    }

    /**
     * Processes a user message and returns a chatbot response.
     * @param userMessage the message from the user
     * @param context optional context (e.g., user ID, conversation history)
     * @return a map containing the bot's response and any additional data (e.g., suggested actions)
     * @throws UnsupportedOperationException if the feature is not implemented
     */
    public Map<String, Object> getResponse(String userMessage, Map<String, Object> context) {
        throw new UnsupportedOperationException("Chatbot response generation is not implemented yet.");
    }

    /**
     * Detects the intent of a user message.
     * @param userMessage the user's message
     * @return a map containing the detected intent and confidence score
     * @throws UnsupportedOperationException if the feature is not implemented
     */
    public Map<String, Object> detectIntent(String userMessage) {
        // Delegate to NLP service
        return nlpService.detectIntent(userMessage);
    }

    /**
     * Extracts entities from a user message.
     * @param userMessage the user's message
     * @return a list of entities
     * @throws UnsupportedOperationException if the feature is not implemented
     */
    public java.util.List<Map<String, Object>> extractEntities(String userMessage) {
        // Delegate to NLP service
        return nlpService.recognizeEntities(userMessage);
    }
}