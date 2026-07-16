package com.kartezy.ocrservice.controller;

import com.kartezy.ocrservice.service.OcrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/ocr")
public class OcrController {

    @Autowired
    private OcrService ocrService;

    @PostMapping("/extract")
    public ResponseEntity<Map<String, Object>> extractText(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ocrService.extractText(file));
    }

    @PostMapping("/extract/invoice")
    public ResponseEntity<Map<String, Object>> extractInvoice(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ocrService.extractStructuredData(file, "invoice"));
    }

    @PostMapping("/extract/bill")
    public ResponseEntity<Map<String, Object>> extractBill(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ocrService.extractStructuredData(file, "bill"));
    }

    @PostMapping("/extract/receipt")
    public ResponseEntity<Map<String, Object>> extractReceipt(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ocrService.extractStructuredData(file, "receipt"));
    }

    @PostMapping("/extract/gst")
    public ResponseEntity<Map<String, Object>> extractGst(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ocrService.extractStructuredData(file, "gst"));
    }

    @PostMapping("/extract/pan")
    public ResponseEntity<Map<String, Object>> extractPan(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ocrService.extractStructuredData(file, "pan"));
    }

    @PostMapping("/extract/aadhaar")
    public ResponseEntity<Map<String, Object>> extractAadhaar(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ocrService.extractStructuredData(file, "aadhaar"));
    }

    @PostMapping("/extract/kyc")
    public ResponseEntity<Map<String, Object>> extractKyc(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ocrService.extractStructuredData(file, "kyc"));
    }

    @PostMapping("/extract/business-document")
    public ResponseEntity<Map<String, Object>> extractBusinessDocument(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ocrService.extractStructuredData(file, "business"));
    }

    @PostMapping("/extract/product")
    public ResponseEntity<Map<String, Object>> extractProductInfo(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ocrService.extractStructuredData(file, "product"));
    }

    @PostMapping("/extract/structured")
    public ResponseEntity<Map<String, Object>> extractStructuredData(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType) throws IOException {
        return ResponseEntity.ok(ocrService.extractStructuredData(file, documentType));
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType) throws IOException {
        return ResponseEntity.ok(ocrService.validateDocument(file, documentType));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "ocr-service"));
    }
}
