package com.kartezy.voiceservice.controller;

import com.kartezy.voiceservice.service.VoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/voice")
public class VoiceController {

    @Autowired
    private VoiceService voiceService;

    @PostMapping("/speech-to-text")
    public ResponseEntity<Map<String, Object>> speechToText(
            @RequestParam("file") MultipartFile audioFile,
            @RequestParam(required = false) String language) throws Exception {
        return ResponseEntity.ok(voiceService.speechToText(audioFile, language));
    }

    @PostMapping("/text-to-speech")
    public ResponseEntity<byte[]> textToSpeech(@RequestBody Map<String, String> request) throws Exception {
        byte[] audioData = voiceService.textToSpeech(request);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("audio/mpeg"));
        headers.setContentLength(audioData.length);
        return ResponseEntity.ok().headers(headers).body(audioData);
    }

    @PostMapping("/process-command")
    public ResponseEntity<Map<String, Object>> processVoiceCommand(
            @RequestParam String commandText,
            @RequestParam String userId) throws Exception {
        return ResponseEntity.ok(voiceService.processVoiceCommand(commandText, userId));
    }

    @PostMapping("/identify-language")
    public ResponseEntity<Map<String, Object>> identifyLanguage(
            @RequestParam("file") MultipartFile audioFile) throws Exception {
        return ResponseEntity.ok(voiceService.identifyLanguage(audioFile));
    }

    @GetMapping("/voices")
    public ResponseEntity<List<Map<String, String>>> getAvailableVoices() {
        return ResponseEntity.ok(voiceService.getAvailableVoices());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "voice-service"));
    }
}
