package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.service.AIServiceFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/voice")
public class VoiceController {

    @Autowired
    private AIServiceFacade aiServiceFacade;

    @PostMapping("/speech-to-text")
    public Map<String, Object> speechToText(@RequestParam("file") MultipartFile audioFile,
                                            @RequestParam(required = false) String language) {
        try {
            return aiServiceFacade.speechToText(audioFile, language);
        } catch (Exception e) {
            return Map.of("text", "", "confidence", 0.0, "error", e.getMessage());
        }
    }

    @PostMapping("/text-to-speech")
    public ResponseEntity<byte[]> textToSpeech(@RequestBody Map<String, String> request) {
        try {
            byte[] audioData = aiServiceFacade.textToSpeech(request);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("audio/mpeg"));
            headers.setContentLength(audioData.length);
            return ResponseEntity.ok().headers(headers).body(audioData);
        } catch (Exception e) {
            return ResponseEntity.ok().body(new byte[0]);
        }
    }

    @PostMapping("/command/process")
    public Map<String, Object> processVoiceCommand(@RequestParam String commandText,
                                                   @RequestParam String userId) {
        try {
            return aiServiceFacade.processVoiceCommand(commandText, userId);
        } catch (Exception e) {
            return Map.of("action", "unknown", "parameters", Map.of(), "responseText", "Command processing failed",
                    "error", e.getMessage());
        }
    }

    @PostMapping("/identify/language")
    public Map<String, Object> identifyLanguage(@RequestParam("file") MultipartFile audioFile) {
        try {
            return aiServiceFacade.identifyVoiceLanguage(audioFile);
        } catch (Exception e) {
            return Map.of("language", "en", "confidence", 0.0, "error", e.getMessage());
        }
    }

    @GetMapping("/voices")
    public List<Map<String, String>> getAvailableVoices() {
        return aiServiceFacade.getAvailableVoices();
    }
}
