package com.kartezy.voiceservice.controller;

import com.kartezy.voiceservice.service.VoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * REST controller for voice service.
 * Provides endpoints for speech-to-text, text-to-speech, and voice command processing.
 */
@RestController
@RequestMapping("/api/voice")
public class VoiceController {

    @Autowired
    private VoiceService voiceService;

    /**
     * Converts speech audio to text.
     * @param file the audio file (e.g., WAV, MP3)
     * @param language the language of the speech (e.g., "en-US", "es-ES")
     * @return the transcribed text
     * @throws IOException if there is an error reading the file
     */
    @PostMapping("/speech-to-text")
    public ResponseEntity<String> speechToText(
            @RequestParam("file") MultipartFile file,
            @RequestParam String language) throws IOException {
        byte[] audioData = file.getBytes();
        String text = voiceService.speechToText(audioData, language);
        return ResponseEntity.ok(text);
    }

    /**
     * Converts text to speech audio.
     * @param text the text to convert to speech
     * @param language the language for the speech (e.g., "en-US", "es-ES")
     * @param voice the voice to use (optional, e.g., "male", "female")
     * @return the audio data as a downloadable file
     * @throws IOException if there is an error processing the request
     */
    @PostMapping("/text-to-speech")
    public ResponseEntity<ByteArrayResource> textToSpeech(
            @RequestParam String text,
            @RequestParam String language,
            @RequestParam(required = false) String voice) throws IOException {
        byte[] audioData = voiceService.textToSpeech(text, language, voice);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("audio/mpeg"));
        headers.setContentDispositionFormData("attachment", "speech.mp3");
        return ResponseEntity.ok()
                .headers(headers)
                .body(new ByteArrayResource(audioData));
    }

    /**
     * Processes a voice command to determine intent and extract parameters.
     * @param file the audio file containing the voice command
     * @param language the language of the command (e.g., "en-US", "es-ES")
     * @return a map containing the intent and any extracted parameters
     * @throws IOException if there is an error reading the file
     */
    @PostMapping("/process-command")
    public ResponseEntity<Map<String, Object>> processVoiceCommand(
            @RequestParam("file") MultipartFile file,
            @RequestParam String language) throws IOException {
        byte[] audioData = file.getBytes();
        Map<String, Object> result = voiceService.processVoiceCommand(audioData, language);
        return ResponseEntity.ok(result);
    }

    /**
     * Health check endpoint.
     * @return a simple status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Voice service is healthy");
    }
}