package com.kartezy.computervisionservice.controller;

import com.kartezy.computervisionservice.service.ComputerVisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * REST controller for computer vision service.
 * Provides endpoints for product recognition, barcode detection, image similarity, duplicate detection,
 * shelf analysis, and document verification.
 */
@RestController
@RequestMapping("/api/cv")
public class ComputerVisionController {

    @Autowired
    private ComputerVisionService computerVisionService;

    /**
     * Recognizes products in an uploaded image.
     * @param file the uploaded image file
     * @return a list of detected products with labels and confidence scores
     * @throws IOException if there is an error reading the image file
     */
    @PostMapping("/recognize-products")
    public ResponseEntity<List<Map<String, Object>>> recognizeProducts(@RequestParam("file") MultipartFile file) throws IOException {
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
        List<Map<String, Object>> result = computerVisionService.recognizeProducts(image);
        return ResponseEntity.ok(result);
    }

    /**
     * Detects barcodes in an uploaded image.
     * @param file the uploaded image file
     * @return a list of detected barcode values
     * @throws IOException if there is an error reading the image file
     */
    @PostMapping("/detect-barcodes")
    public ResponseEntity<List<String>> detectBarcodes(@RequestParam("file") MultipartFile file) throws IOException {
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
        List<String> result = computerVisionService.detectBarcodes(image);
        return ResponseEntity.ok(result);
    }

    /**
     * Computes the similarity between two uploaded images.
     * @param file1 the first image file
     * @param file2 the second image file
     * @return a similarity score between 0 and 1
     * @throws IOException if there is an error reading the image files
     */
    @PostMapping("/image-similarity")
    public ResponseEntity<Double> imageSimilarity(
            @RequestParam("file1") MultipartFile file1,
            @RequestParam("file2") MultipartFile file2) throws IOException {
        BufferedImage image1 = ImageIO.read(new ByteArrayInputStream(file1.getBytes()));
        BufferedImage image2 = ImageIO.read(new ByteArrayInputStream(file2.getBytes()));
        double similarity = computerVisionService.computeImageSimilarity(image1, image2);
        return ResponseEntity.ok(similarity);
    }

    /**
     * Detects duplicate products among a set of uploaded images.
     * @param files the list of image files
     * @return a list of groups of indices that are duplicates
     * @throws IOException if there is an error reading any image file
     */
    @PostMapping("/detect-duplicates")
    public ResponseEntity<List<List<Integer>>> detectDuplicates(@RequestParam("files") List<MultipartFile> files) throws IOException {
        // Convert each file to BufferedImage
        var images = files.stream()
                .map(file -> {
                    try {
                        return ImageIO.read(new ByteArrayInputStream(file.getBytes()));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                })
                .toList();
        List<List<Integer>> result = computerVisionService.detectDuplicateProducts(images);
        return ResponseEntity.ok(result);
    }

    /**
     * Analyzes a shelf image to identify products, their positions, and stock levels.
     * @param file the uploaded shelf image file
     * @return a map containing the analysis results
     * @throws IOException if there is an error reading the image file
     */
    @PostMapping("/analyze-shelf")
    public ResponseEntity<Map<String, Object>> analyzeShelf(@RequestParam("file") MultipartFile file) throws IOException {
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
        Map<String, Object> result = computerVisionService.analyzeShelfImage(image);
        return ResponseEntity.ok(result);
    }

    /**
     * Verifies the authenticity of a document from an uploaded image.
     * @param file the uploaded document image file
     * @return a map indicating whether the document is authentic and any details
     * @throws IOException if there is an error reading the image file
     */
    @PostMapping("/verify-document")
    public ResponseEntity<Map<String, Object>> verifyDocument(@RequestParam("file") MultipartFile file) throws IOException {
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
        Map<String, Object> result = computerVisionService.verifyDocument(image);
        return ResponseEntity.ok(result);
    }

    /**
     * Health check endpoint.
     * @return a simple status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Computer vision service is healthy");
    }
}