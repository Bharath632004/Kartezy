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
@RequestMapping("/v1/computer-vision")
public class ComputerVisionController {

    @Autowired
    private AIServiceFacade aiServiceFacade;

    @PostMapping("/detect/objects")
    public Map<String, Object> detectObjects(@RequestParam("file") MultipartFile file) {
        try {
            return aiServiceFacade.detectObjects(file);
        } catch (IOException e) {
            return Map.of("objects", List.of(), "error", e.getMessage());
        }
    }

    @PostMapping("/recognize/product")
    public Map<String, Object> recognizeProduct(@RequestParam("file") MultipartFile file) {
        try {
            return aiServiceFacade.recognizeProduct(file);
        } catch (IOException e) {
            return Map.of("productId", null, "confidence", 0.0, "error", e.getMessage());
        }
    }

    @PostMapping("/similarity")
    public Map<String, Object> imageSimilarity(@RequestParam("file1") MultipartFile file1,
                                               @RequestParam("file2") MultipartFile file2) {
        try {
            return aiServiceFacade.computeImageSimilarity(file1, file2);
        } catch (IOException e) {
            return Map.of("similarityScore", 0.0, "error", e.getMessage());
        }
    }

    @PostMapping("/duplicate/detection")
    public Map<String, Object> detectDuplicateProducts(@RequestParam("file") MultipartFile file) {
        try {
            return aiServiceFacade.detectDuplicateProducts(file);
        } catch (IOException e) {
            return Map.of("isDuplicate", false, "similarProductIds", List.of(), "error", e.getMessage());
        }
    }

    @PostMapping("/shelf/analysis")
    public Map<String, Object> analyzeShelfImage(@RequestParam("file") MultipartFile file) {
        try {
            return aiServiceFacade.analyzeShelfImage(file);
        } catch (IOException e) {
            return Map.of("outOfStockItems", List.of(), "lowStockItems", List.of(), "error", e.getMessage());
        }
    }
}
