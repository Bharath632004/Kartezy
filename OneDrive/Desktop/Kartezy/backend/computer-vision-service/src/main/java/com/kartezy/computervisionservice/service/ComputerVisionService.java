package com.kartezy.computervisionservice.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ComputerVisionService {

    private final Map<String, double[]> productFeatureVectors = new ConcurrentHashMap<>();
    private final Map<String, String> barcodeProductMap = new ConcurrentHashMap<>();
    private static final double SIMILARITY_THRESHOLD = 0.75;

    public Map<String, Object> detectObjects(byte[] imageData) {
        if (imageData == null || imageData.length == 0) {
            return Map.of("objects", Collections.emptyList(), "count", 0);
        }
        return Map.of("objects", List.of(
                Map.of("label", "product", "confidence", 0.85, "boundingBox", Map.of("x", 10, "y", 20, "width", 100, "height", 150)),
                Map.of("label", "barcode", "confidence", 0.92, "boundingBox", Map.of("x", 5, "y", 180, "width", 200, "height", 30))
        ), "count", 2, "processingTime", 45);
    }

    public Map<String, Object> recognizeProduct(byte[] imageData) {
        if (imageData == null || imageData.length == 0) {
            return Map.of("productId", null, "confidence", 0.0, "found", false);
        }
        double[] features = extractFeatures(imageData);
        String bestMatch = null;
        double bestScore = 0;
        for (Map.Entry<String, double[]> entry : productFeatureVectors.entrySet()) {
            double similarity = cosineSimilarity(features, entry.getValue());
            if (similarity > bestScore && similarity >= SIMILARITY_THRESHOLD) {
                bestScore = similarity;
                bestMatch = entry.getKey();
            }
        }
        if (bestMatch != null) {
            return Map.of("productId", bestMatch, "confidence", Math.round(bestScore * 100.0) / 100.0,
                    "found", true, "similarProducts", findSimilarProducts(features, bestMatch, 5));
        }
        return Map.of("productId", null, "confidence", 0.0, "found", false);
    }

    public Map<String, Object> calculateImageSimilarity(byte[] image1, byte[] image2) {
        if (image1 == null || image2 == null) return Map.of("similarityScore", 0.0, "identical", false);
        double similarity = cosineSimilarity(extractFeatures(image1), extractFeatures(image2));
        return Map.of("similarityScore", Math.round(similarity * 100.0) / 100.0,
                "identical", similarity > 0.98, "highlySimilar", similarity > SIMILARITY_THRESHOLD,
                "method", "feature_based_cosine");
    }

    public Map<String, Object> detectDuplicateProducts(byte[] imageData) {
        if (imageData == null || imageData.length == 0) {
            return Map.of("isDuplicate", false, "similarProductIds", Collections.emptyList());
        }
        double[] features = extractFeatures(imageData);
        List<Map<String, Object>> duplicates = new ArrayList<>();
        for (Map.Entry<String, double[]> entry : productFeatureVectors.entrySet()) {
            double similarity = cosineSimilarity(features, entry.getValue());
            if (similarity > SIMILARITY_THRESHOLD) {
                duplicates.add(Map.of("productId", entry.getKey(), "similarity", Math.round(similarity * 100.0) / 100.0));
            }
        }
        duplicates.sort((a, b) -> Double.compare((Double) b.get("similarity"), (Double) a.get("similarity")));
        return Map.of("isDuplicate", !duplicates.isEmpty(), "similarProductIds",
                duplicates.stream().map(d -> d.get("productId")).toList(),
                "duplicateCount", duplicates.size(), "topMatches", duplicates.stream().limit(5).toList());
    }

    public Map<String, Object> analyzeShelfImage(byte[] imageData) {
        if (imageData == null || imageData.length == 0) {
            return Map.of("outOfStockItems", Collections.emptyList(), "lowStockItems", Collections.emptyList());
        }
        Random random = new Random(42);
        List<Map<String, Object>> outOfStock = new ArrayList<>(), lowStock = new ArrayList<>(), inStock = new ArrayList<>();
        String[] products = {"Milk", "Bread", "Eggs", "Rice", "Sugar", "Oil", "Salt", "Butter"};
        for (String product : products) {
            double stockLevel = random.nextDouble();
            Map<String, Object> item = Map.of("productName", product, "stockLevel", stockLevel,
                    "confidence", 0.7 + random.nextDouble() * 0.25,
                    "position", Map.of("row", random.nextInt(5), "column", random.nextInt(10)));
            if (stockLevel < 0.1) outOfStock.add(item);
            else if (stockLevel < 0.3) lowStock.add(item);
            else inStock.add(item);
        }
        return Map.of("totalProducts", products.length, "outOfStockCount", outOfStock.size(),
                "lowStockCount", lowStock.size(), "inStockCount", inStock.size(),
                "outOfStockItems", outOfStock, "lowStockItems", lowStock,
                "stockHealthScore", Math.round((1.0 - (double) (outOfStock.size() + lowStock.size()) / products.length) * 100.0) / 100.0);
    }

    public Map<String, Object> recognizeBarcode(byte[] imageData) {
        if (imageData == null || imageData.length == 0) return Map.of("barcode", null, "format", null, "found", false);
        String barcode = simulateBarcodeDetection(imageData);
        return Map.of("barcode", barcode, "productId", barcodeProductMap.get(barcode),
                "format", "EAN_13", "found", barcode != null, "confidence", barcode != null ? 0.95 : 0.0);
    }

    public void registerProductFeatures(String productId, byte[] imageData) {
        productFeatureVectors.put(productId, extractFeatures(imageData));
    }

    public void registerBarcodeMapping(String barcode, String productId) {
        barcodeProductMap.put(barcode, productId);
    }

    private double[] extractFeatures(byte[] imageData) {
        double[] features = new double[128];
        Random random = new Random(Arrays.hashCode(imageData));
        for (int i = 0; i < features.length; i++) features[i] = random.nextGaussian();
        double norm = Math.sqrt(Arrays.stream(features).map(v -> v * v).sum());
        if (norm > 0) for (int i = 0; i < features.length; i++) features[i] /= norm;
        return features;
    }

    private String simulateBarcodeDetection(byte[] imageData) {
        if (imageData == null || imageData.length == 0) return null;
        return String.format("%012d", Math.abs(Arrays.hashCode(imageData) % 1_000_000_000_000L));
    }

    private double cosineSimilarity(double[] v1, double[] v2) {
        double dot = 0, n1 = 0, n2 = 0;
        for (int i = 0; i < Math.min(v1.length, v2.length); i++) {
            dot += v1[i] * v2[i]; n1 += v1[i] * v1[i]; n2 += v2[i] * v2[i];
        }
        return (n1 == 0 || n2 == 0) ? 0 : dot / (Math.sqrt(n1) * Math.sqrt(n2));
    }

    private List<Map<String, Object>> findSimilarProducts(double[] features, String excludeId, int limit) {
        List<Map<String, Object>> similar = new ArrayList<>();
        for (Map.Entry<String, double[]> entry : productFeatureVectors.entrySet()) {
            if (entry.getKey().equals(excludeId)) continue;
            double sim = cosineSimilarity(features, entry.getValue());
            if (sim > SIMILARITY_THRESHOLD * 0.8)
                similar.add(Map.of("productId", entry.getKey(), "similarity", Math.round(sim * 100.0) / 100.0));
        }
        similar.sort((a, b) -> Double.compare((Double) b.get("similarity"), (Double) a.get("similarity")));
        return similar.subList(0, Math.min(limit, similar.size()));
    }
}
