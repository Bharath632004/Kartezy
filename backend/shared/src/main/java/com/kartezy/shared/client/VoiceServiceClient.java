package com.kartezy.shared.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Feign client for the Voice Service.
 */
@FeignClient(name = "voice-service", path = "/voice")
public interface VoiceServiceClient {

    @PostMapping("/speech-to-text")
    Map<String, Object> speechToText(@RequestParam("file") MultipartFile audioFile,
                                     @RequestParam(required = false) String language) throws IOException;

    @PostMapping("/text-to-speech")
    byte[] textToSpeech(@RequestBody Map<String, String> request) throws IOException;

    @PostMapping("/command/process")
    Map<String, Object> processVoiceCommand(@RequestParam String commandText,
                                            @RequestParam String userId) throws IOException;

    @PostMapping("/identify/language")
    Map<String, Object> identifyLanguage(@RequestParam("file") MultipartFile audioFile) throws IOException;

    @GetMapping("/voices")
    List<Map<String, String>> getAvailableVoices() throws IOException;
}