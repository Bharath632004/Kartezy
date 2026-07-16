package com.kartezy.computervisionservice.controller;

import com.kartezy.computervisionservice.service.ComputerVisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/cv")
public class ComputerVisionController {

    @Autowired
    private ComputerVisionService computerVisionService;

    @PostMapping("/recognize-products")
    public ResponseEntity<Map<String, Object>> recognizeProducts(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(computerVisionService.recognizeProducts(file));
    }

    @PostMapping("/detect-barcodes")
    public ResponseEntity<Map<String, Object>> detectBarcodes(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(computerVisionService.detectBarcodes(file));
    }

    @PostMapping("/image-similarity")
    public ResponseEntity<Map<String, Object>> imageSimilarity(
            @RequestParam("file1") MultipartFile file1,
            @RequestParam("file2") MultipartFile file2) throws IOException {
        return ResponseEntity.ok(computerVisionService.computeImageSimilarity(file1, file2));
    }

    @PostMapping("/detect-duplicates")
    public ResponseEntity<Map<String, Object>> detectDuplicateProducts(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(computerVisionService.detectDuplicateProducts(file));
    }

    @PostMapping("/analyze-shelf")
    public ResponseEntity<Map<String, Object>> analyzeShelfImage(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(computerVisionService.analyzeShelfImage(file));
    }

    @PostMapping("/verify-document")
    public ResponseEntity<Map<String, Object>> verifyDocument(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(computerVisionService.verifyDocument(file));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "computer-vision-service"));
    }
}
