package com.kartezy.nlpservice.controller;

import com.kartezy.nlpservice.service.NlpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for NLP service.
 * Provides endpoints for sentiment analysis, entity recognition, language detection, translation,
 * summarization, question answering, keyword extraction, grammar checking, and intent detection.
 */
@RestController
@RequestMapping("/api/nlp")
public class NlpController {

    @Autowired
    private NlpService nlpService;

    /**
     * Analyzes the sentiment of a given text.
     * @param text the text to analyze
     * @return sentiment score and label
     */
    @PostMapping("/sentiment")
    public ResponseEntity<Map<String, Object>> analyzeSentiment(@RequestParam String text) {
        return ResponseEntity.ok(nlpService.analyzeSentiment(text));
    }

    /**
     * Recognizes named entities in a given text.
     * @param text the text to analyze
     * @return list of detected entities
     */
    @PostMapping("/entities")
    public ResponseEntity<List<Map<String, Object>>> recognizeEntities(@RequestParam String text) {
        return ResponseEntity.ok(nlpService.recognizeEntities(text));
    }

    /**
     * Detects the language of a given text.
     * @param text the text to analyze
     * @return detected language code
     */
    @PostMapping("/detect-language")
    public ResponseEntity<String> detectLanguage(@RequestParam String text) {
        return ResponseEntity.ok(nlpService.detectLanguage(text));
    }

    /**
     * Translates text from one language to another.
     * @param text the text to translate
     * @param sourceLanguage the source language code (optional, default is auto-detect)
     * @param targetLanguage the target language code
     * @return translated text
     */
    @PostMapping("/translate")
    public ResponseEntity<String> translateText(
            @RequestParam String text,
            @RequestParam(required = false) String sourceLanguage,
            @RequestParam String targetLanguage) {
        return ResponseEntity.ok(nlpService.translateText(text, sourceLanguage, targetLanguage));
    }

    /**
     * Summarizes a given text.
     * @param text the text to summarize
     * @param ratio the compression ratio (e.g., 0.2 for 20% of original length)
     * @return summarized text
     */
    @PostMapping("/summarize")
    public ResponseEntity<String> summarizeText(
            @RequestParam String text,
            @RequestParam double ratio) {
        return ResponseEntity.ok(nlpService.summarizeText(text, ratio));
    }

    /**
     * Answers a question based on a given context.
     * @param question the question to answer
     * @param context the context or passage to search for the answer (optional)
     * @return the answer
     */
    @PostMapping("/answer")
    public ResponseEntity<String> answerQuestion(
            @RequestParam String question,
            @RequestParam(required = false) String context) {
        return ResponseEntity.ok(nlpService.answerQuestion(question, context));
    }

    /**
     * Extracts keywords or key phrases from a given text.
     * @param text the text to extract keywords from
     * @param maxKeywords the maximum number of keywords to return
     * @return list of keywords
     */
    @PostMapping("/keywords")
    public ResponseEntity<List<String>> extractKeywords(
            @RequestParam String text,
            @RequestParam int maxKeywords) {
        return ResponseEntity.ok(nlpService.extractKeywords(text, maxKeywords));
    }

    /**
     * Checks the grammatical correctness of a sentence.
     * @param sentence the sentence to check
     * @return list of grammar errors and suggested corrections
     */
    @PostMapping("/grammar-check")
    public ResponseEntity<List<Map<String, Object>>> checkGrammar(@RequestParam String sentence) {
        return ResponseEntity.ok(nlpService.checkGrammar(sentence));
    }

    /**
     * Detects the intent of a user utterance (e.g., for chatbots).
     * @param utterance the user's input
     * @return detected intent and any associated entities
     */
    @PostMapping("/detect-intent")
    public ResponseEntity<Map<String, Object>> detectIntent(@RequestParam String utterance) {
        return ResponseEntity.ok(nlpService.detectIntent(utterance));
    }

    /**
     * Health check endpoint.
     * @return a simple status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("NLP service is healthy");
    }
}