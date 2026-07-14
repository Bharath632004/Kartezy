package com.kartezy.aiservice.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ocr")
public class OCRController {

    @PostMapping("/extract")
    public Object extractText(@RequestParam("file") MultipartFile file) {
        // TODO: Implement OCR using Tesseract or cloud API
        // For now, return a placeholder
        return Map.of("text", "OCR not implemented yet", "confidence", 0.0);
    }

    @PostMapping("/extract/structured")
    public Object extractStructuredData(@RequestParam("file") MultipartFile file,
                                        @RequestParam String documentType) {
        // TODO: Extract structured data based on document type (invoice, receipt, etc.)
        return Map.of("data", Map.of(), "confidence", 0.0);
    }

    @PostMapping("/validate")
    public Object validateDocument(@RequestParam("file") MultipartFile file,
                                   @RequestParam String documentType) {
        // TODO: Validate document (e.g., KYC, invoice)
        return Map.of("valid", false, "errors", List.of());
    }
}