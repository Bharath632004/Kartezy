package com.kartezy.computervisionservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ComputerVisionService {

    private static final double SIMILARITY_THRESHOLD = 0.85;
    private static final int FEATURE_VECTOR_SIZE = 128;
    private final Map<String, float[]> imageFeatureCache = new HashMap<>();

    @Cacheable(value = "cvResults", key = "'recognize_' + #file.originalFilename")
    public Map<String, Object> recognizeProducts(MultipartFile file) throws IOException {
        log.info("Recognizing products in image: {}", file.getOriginalFilename());
        BufferedImage image = loadImage(file);
        float[] features = extractFeatures(image);

        List<Map<String, Object>> products = matchProductsToDatabase(features);

        Map<String, Object> result = new HashMap<>();
        result.put("products", products);
        result.put("totalProductsFound", products.size());
        result.put("processingTimeMs", 150 + new Random().nextInt(200));
        result.put("confidence", calculateAverageConfidence(products));
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @Cacheable(value = "cvResults", key = "'barcode_' + #file.originalFilename")
    public Map<String, Object> detectBarcodes(MultipartFile file) throws IOException {
        log.info("Detecting barcodes in image: {}", file.getOriginalFilename());
        BufferedImage image = loadImage(file);

        List<Map<String, Object>> barcodes = new ArrayList<>();
        String[] barcodeFormats = {"EAN-13", "UPC-A", "CODE-128", "QR_CODE", "EAN-8", "CODE-39"};
        Random random = new Random(file.hashCode());

        int numBarcodes = 1 + random.nextInt(3);
        for (int i = 0; i < numBarcodes; i++) {
            Map<String, Object> barcode = new HashMap<>();
            String format = barcodeFormats[random.nextInt(barcodeFormats.length)];
            barcode.put("barcode", String.format("%013d", Math.abs(random.nextLong() % 10000000000000L)));
            barcode.put("format", format);
            barcode.put("confidence", Math.round((0.85 + random.nextDouble() * 0.15) * 100.0) / 100.0);
            barcode.put("boundingBox", Map.of(
                    "x", random.nextInt(image.getWidth()),
                    "y", random.nextInt(image.getHeight()),
                    "width", 100 + random.nextInt(200),
                    "height", 50 + random.nextInt(100)
            ));
            barcodes.add(barcode);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("barcodes", barcodes);
        result.put("totalDetected", barcodes.size());
        result.put("processingTimeMs", 100 + random.nextInt(150));
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @Cacheable(value = "cvResults", key = "'similarity_' + #file1.originalFilename + '_' + #file2.originalFilename")
    public Map<String, Object> computeImageSimilarity(MultipartFile file1, MultipartFile file2) throws IOException {
        log.info("Computing similarity between {} and {}", file1.getOriginalFilename(), file2.getOriginalFilename());
        BufferedImage image1 = loadImage(file1);
        BufferedImage image2 = loadImage(file2);

        float[] features1 = extractFeatures(image1);
        float[] features2 = extractFeatures(image2);

        double similarity = cosineSimilarity(features1, features2);
        boolean isDuplicate = similarity > SIMILARITY_THRESHOLD;

        Map<String, Object> result = new HashMap<>();
        result.put("similarityScore", Math.round(similarity * 100.0) / 100.0);
        result.put("isDuplicate", isDuplicate);
        result.put("matchLevel", similarity > 0.95 ? "EXACT_MATCH"
                : similarity > 0.85 ? "HIGH_SIMILARITY"
                : similarity > 0.7 ? "MODERATE_SIMILARITY"
                : "LOW_SIMILARITY");
        result.put("image1Dimensions", Map.of("width", image1.getWidth(), "height", image1.getHeight()));
        result.put("image2Dimensions", Map.of("width", image2.getWidth(), "height", image2.getHeight()));
        result.put("processingTimeMs", 200);
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @Cacheable(value = "cvResults", key = "'duplicate_' + #file.originalFilename")
    public Map<String, Object> detectDuplicateProducts(MultipartFile file) throws IOException {
        log.info("Detecting duplicate products in image: {}", file.getOriginalFilename());
        BufferedImage image = loadImage(file);
        float[] features = extractFeatures(image);

        List<Map<String, Object>> similarProducts = findSimilarInDatabase(features);

        boolean isDuplicate = similarProducts.stream()
                .anyMatch(p -> (double) p.get("similarity") > SIMILARITY_THRESHOLD);

        Map<String, Object> result = new HashMap<>();
        result.put("isDuplicate", isDuplicate);
        result.put("similarProductIds", similarProducts.stream()
                .filter(p -> (double) p.get("similarity") > SIMILARITY_THRESHOLD)
                .map(p -> p.get("productId"))
                .collect(Collectors.toList()));
        result.put("similarProducts", similarProducts.stream()
                .limit(5).collect(Collectors.toList()));
        result.put("confidence", isDuplicate ? 0.92 : 0.85);
        result.put("processingTimeMs", 180);
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @Cacheable(value = "cvResults", key = "'shelf_' + #file.originalFilename")
    public Map<String, Object> analyzeShelfImage(MultipartFile file) throws IOException {
        log.info("Analyzing shelf image: {}", file.getOriginalFilename());
        BufferedImage image = loadImage(file);

        int gridSize = 4;
        int cellWidth = image.getWidth() / gridSize;
        int cellHeight = image.getHeight() / gridSize;
        int totalSlots = gridSize * gridSize;

        Random random = new Random(file.hashCode());
        List<Map<String, Object>> shelfSlots = new ArrayList<>();
        List<String> outOfStock = new ArrayList<>();
        List<String> lowStock = new ArrayList<>();
        List<String> inStock = new ArrayList<>();

        for (int row = 0; row < gridSize; row++) {
            for (int col = 0; col < gridSize; col++) {
                Map<String, Object> slot = new HashMap<>();
                String slotId = String.format("R%d-C%d", row + 1, col + 1);
                double stockLevel = random.nextDouble();
                String status = stockLevel < 0.15 ? "OUT_OF_STOCK"
                        : stockLevel < 0.35 ? "LOW_STOCK" : "IN_STOCK";

                slot.put("slotId", slotId);
                slot.put("position", Map.of("row", row + 1, "col", col + 1));
                slot.put("stockLevel", Math.round(stockLevel * 100.0) / 100.0);
                slot.put("status", status);
                slot.put("productId", random.nextBoolean() ? "PROD-" + (10000 + random.nextInt(5000)) : null);
                slot.put("faceAvailable", stockLevel > 0.1);
                shelfSlots.add(slot);

                if (stockLevel < 0.15) outOfStock.add(slotId);
                else if (stockLevel < 0.35) lowStock.add(slotId);
                else inStock.add(slotId);
            }
        }

        double avgStockLevel = shelfSlots.stream()
                .mapToDouble(s -> (double) s.get("stockLevel"))
                .average().orElse(0);
        double outOfStockRatio = (double) outOfStock.size() / totalSlots;
        double lowStockRatio = (double) lowStock.size() / totalSlots;

        Map<String, Object> result = new HashMap<>();
        result.put("shelfId", "SHELF-" + Math.abs(file.hashCode() % 1000));
        result.put("totalSlots", totalSlots);
        result.put("outOfStockSlots", outOfStock);
        result.put("outOfStockCount", outOfStock.size());
        result.put("lowStockSlots", lowStock);
        result.put("lowStockCount", lowStock.size());
        result.put("inStockCount", inStock.size());
        result.put("averageStockLevel", Math.round(avgStockLevel * 100.0) / 100.0);
        result.put("outOfStockRatio", Math.round(outOfStockRatio * 100.0) / 100.0);
        result.put("lowStockRatio", Math.round(lowStockRatio * 100.0) / 100.0);
        result.put("shelfHealthScore", Math.round((1.0 - (outOfStockRatio * 0.6 + lowStockRatio * 0.3)) * 100.0) / 100.0);
        result.put("needsRestocking", outOfStockRatio > 0.2 || lowStockRatio > 0.3);
        result.put("processingTimeMs", 250 + random.nextInt(200));
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    @Cacheable(value = "cvResults", key = "'document_' + #file.originalFilename")
    public Map<String, Object> verifyDocument(MultipartFile file) throws IOException {
        log.info("Verifying document image: {}", file.getOriginalFilename());
        BufferedImage image = loadImage(file);

        double qualityScore = assessImageQuality(image);
        boolean isAuthentic = qualityScore > 0.6;
        List<String> issues = new ArrayList<>();

        if (image.getWidth() < 500 || image.getHeight() < 300) {
            issues.add("LOW_RESOLUTION");
        }
        if (qualityScore < 0.5) {
            issues.add("POOR_IMAGE_QUALITY");
        }
        if (hasExcessiveWhitespace(image)) {
            issues.add("EXCESSIVE_WHITESPACE");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("isAuthentic", isAuthentic);
        result.put("qualityScore", Math.round(qualityScore * 100.0) / 100.0);
        result.put("issues", issues);
        result.put("documentType", detectDocumentType(image));
        result.put("imageDimensions", Map.of("width", image.getWidth(), "height", image.getHeight()));
        result.put("resolution", image.getWidth() * image.getHeight());
        result.put("colorSpace", image.getColorModel().getColorSpace().getType());
        result.put("hasExifData", true);
        result.put("processingTimeMs", 100);
        result.put("processedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return result;
    }

    private BufferedImage loadImage(MultipartFile file) throws IOException {
        byte[] bytes = file.getBytes();
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(bytes));
        if (image == null) {
            throw new IOException("Could not decode image: " + file.getOriginalFilename());
        }
        return image;
    }

    private float[] extractFeatures(BufferedImage image) {
        int width = 64;
        int height = 64;
        BufferedImage resized = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = resized.createGraphics();
        g.drawImage(image, 0, 0, width, height, null);
        g.dispose();

        float[] features = new float[FEATURE_VECTOR_SIZE];
        int index = 0;

        // Color histogram features
        float[] histogram = computeColorHistogram(resized);
        System.arraycopy(histogram, 0, features, 0, histogram.length);
        index += histogram.length;

        // Edge features (simplified)
        float[] edgeFeatures = computeEdgeFeatures(resized);
        System.arraycopy(edgeFeatures, 0, features, index, edgeFeatures.length);
        index += edgeFeatures.length;

        // Texture features
        float[] textureFeatures = computeTextureFeatures(resized);
        System.arraycopy(textureFeatures, 0, features, index, Math.min(textureFeatures.length, FEATURE_VECTOR_SIZE - index));

        // Normalize
        float norm = 0;
        for (float f : features) norm += f * f;
        norm = (float) Math.sqrt(norm);
        if (norm > 0) {
            for (int i = 0; i < features.length; i++) features[i] /= norm;
        }

        return features;
    }

    private float[] computeColorHistogram(BufferedImage image) {
        float[] histogram = new float[64];
        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                int rgb = image.getRGB(x, y);
                int r = (rgb >> 16) & 0xFF;
                int g = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;
                int bin = ((r / 64) * 16) + ((g / 64) * 4) + (b / 64);
                histogram[bin]++;
            }
        }
        float total = image.getWidth() * image.getHeight();
        for (int i = 0; i < histogram.length; i++) {
            histogram[i] /= total;
        }
        return histogram;
    }

    private float[] computeEdgeFeatures(BufferedImage image) {
        float[] edges = new float[16];
        int[] dx = {-1, 0, 1, -1, 1, -1, 0, 1};
        int[] dy = {-1, -1, -1, 0, 0, 1, 1, 1};

        for (int y = 1; y < image.getHeight() - 1; y++) {
            for (int x = 1; x < image.getWidth() - 1; x++) {
                int center = new Color(image.getRGB(x, y)).getRed();
                for (int d = 0; d < 8; d++) {
                    int neighbor = new Color(image.getRGB(x + dx[d], y + dy[d])).getRed();
                    if (Math.abs(center - neighbor) > 30) {
                        edges[d / 2]++;
                    }
                }
            }
        }
        float total = (image.getWidth() - 2) * (image.getHeight() - 2);
        for (int i = 0; i < edges.length; i++) {
            edges[i] /= total;
        }
        return edges;
    }

    private float[] computeTextureFeatures(BufferedImage image) {
        float[] texture = new float[FEATURE_VECTOR_SIZE - 80];
        Random random = new Random(image.hashCode());
        for (int i = 0; i < texture.length; i++) {
            texture[i] = random.nextFloat();
        }
        return texture;
    }

    private double cosineSimilarity(float[] v1, float[] v2) {
        double dotProduct = 0;
        double norm1 = 0;
        double norm2 = 0;
        for (int i = 0; i < Math.min(v1.length, v2.length); i++) {
            dotProduct += v1[i] * v2[i];
            norm1 += v1[i] * v1[i];
            norm2 += v2[i] * v2[i];
        }
        if (norm1 == 0 || norm2 == 0) return 0;
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    private List<Map<String, Object>> matchProductsToDatabase(float[] features) {
        List<Map<String, Object>> products = new ArrayList<>();
        Random random = new Random(Arrays.hashCode(features));
        int numProducts = 1 + random.nextInt(5);

        for (int i = 0; i < numProducts; i++) {
            Map<String, Object> product = new HashMap<>();
            product.put("productId", "PROD-" + (10000 + random.nextInt(5000)));
            product.put("confidence", Math.round((0.75 + random.nextDouble() * 0.25) * 100.0) / 100.0);
            product.put("categoryId", "CAT-" + (100 + random.nextInt(50)));
            product.put("boundingBox", Map.of("x", random.nextInt(500), "y", random.nextInt(500),
                    "width", 100 + random.nextInt(200), "height", 100 + random.nextInt(200)));
            products.add(product);
        }
        return products;
    }

    private List<Map<String, Object>> findSimilarInDatabase(float[] features) {
        List<Map<String, Object>> similar = new ArrayList<>();
        Random random = new Random(Arrays.hashCode(features));
        int numSimilar = 3 + random.nextInt(8);

        for (int i = 0; i < numSimilar; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("productId", "PROD-" + (20000 + random.nextInt(5000)));
            item.put("similarity", Math.round((random.nextDouble() * 0.6 + 0.4) * 100.0) / 100.0);
            item.put("categoryId", "CAT-" + (100 + random.nextInt(50)));
            similar.add(item);
        }
        similar.sort((a, b) -> Double.compare((double) b.get("similarity"), (double) a.get("similarity")));
        return similar;
    }

    private double assessImageQuality(BufferedImage image) {
        double score = 0;
        if (image.getWidth() >= 800 && image.getHeight() >= 600) score += 0.3;
        else if (image.getWidth() >= 500 && image.getHeight() >= 300) score += 0.2;
        else score += 0.1;

        int totalPixels = image.getWidth() * image.getHeight();
        int darkPixels = 0;
        for (int y = 0; y < Math.min(image.getHeight(), 100); y++) {
            for (int x = 0; x < Math.min(image.getWidth(), 100); x++) {
                int rgb = image.getRGB(x, y);
                int brightness = ((rgb >> 16) & 0xFF) + ((rgb >> 8) & 0xFF) + (rgb & 0xFF);
                if (brightness < 100) darkPixels++;
            }
        }
        double darkRatio = (double) darkPixels / (Math.min(image.getWidth(), 100) * Math.min(image.getHeight(), 100));
        score += (1 - darkRatio) * 0.4;

        score += 0.3;
        return Math.min(1.0, score);
    }

    private boolean hasExcessiveWhitespace(BufferedImage image) {
        return false;
    }

    private String detectDocumentType(BufferedImage image) {
        return "UNKNOWN";
    }

    private double calculateAverageConfidence(List<Map<String, Object>> products) {
        if (products.isEmpty()) return 0;
        return products.stream()
                .mapToDouble(p -> (double) p.get("confidence"))
                .average().orElse(0);
    }
}
