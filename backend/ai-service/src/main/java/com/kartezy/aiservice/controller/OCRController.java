package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.service.AIServiceFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/ocr")
public class OCRController {

    @Autowired
    private AIServiceFacade aiServiceFacade;

    @PostMapping("/extract")
    public Map<String, Object> extractText(@RequestParam("file") MultipartFile file) {
        try {
            return aiServiceFacade.extractOcrText(file);
        } catch (IOException e) {
            return Map.of("text", "OCR processing failed: " + e.getMessage(), "confidence", 0.0, "error", e.getMessage());
        }
    }

    @PostMapping("/extract/structured")
    public Map<String, Object> extractStructuredData(@RequestParam("file") MultipartFile file,
                                                     @RequestParam String documentType) {
        try {
            return aiServiceFacade.extractOcrStructuredData(file, documentType);
        } catch (IOException e) {
            return Map.of("data", Map.of(), "confidence", 0.0, "error", e.getMessage());
        }
    }

    @PostMapping("/validate")
    public Map<String, Object> validateDocument(@RequestParam("file") MultipartFile file,
                                                @RequestParam String documentType) {
        try {
            return aiServiceFacade.validateOcrDocument(file, documentType);
        } catch (IOException e) {
            return Map.of("valid", false, "errors", List.of("Service unavailable: " + e.getMessage()));
        }
    }
}
