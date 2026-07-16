package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.service.AIServiceFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/v1/ml")
public class MLController {

    @Autowired
    private AIServiceFacade aiServiceFacade;

    private final Map<String, Map<String, Object>> trainingJobs = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> modelRegistry = new ConcurrentHashMap<>();
    private final Map<String, List<String>> featureStore = new ConcurrentHashMap<>();

    public MLController() {
        // Initialize feature store with default entities
        featureStore.put("user", Arrays.asList("avg_order_value:DOUBLE", "purchase_frequency:DOUBLE", "favorite_category:STRING", "total_orders:LONG", "days_since_last_order:LONG", "customer_segment:STRING"));
        featureStore.put("product", Arrays.asList("category_id:LONG", "price:DOUBLE", "avg_rating:DOUBLE", "total_sales:LONG", "stock_level:INT", "brand_id:LONG"));
        featureStore.put("order", Arrays.asList("order_value:DOUBLE", "item_count:INT", "delivery_time:INT", "is_returned:BOOLEAN", "payment_method:STRING"));
        featureStore.put("merchant", Arrays.asList("total_revenue:DOUBLE", "order_count:LONG", "avg_rating:DOUBLE", "fulfillment_rate:DOUBLE", "return_rate:DOUBLE"));

        // Initialize model registry
        modelRegistry.put("rec-001", Map.of("modelId", "rec-001", "name", "Recommendation Model v2", "type", "RECOMMENDATION", "version", "2.1.0", "status", "DEPLOYED", "accuracy", 0.87, "createdAt", LocalDateTime.now().minusDays(30).format(DateTimeFormatter.ISO_DATE_TIME)));
        modelRegistry.put("fraud-001", Map.of("modelId", "fraud-001", "name", "Fraud Detection Model v3", "type", "FRAUD_DETECTION", "version", "3.0.0", "status", "DEPLOYED", "accuracy", 0.94, "createdAt", LocalDateTime.now().minusDays(15).format(DateTimeFormatter.ISO_DATE_TIME)));
        modelRegistry.put("forecast-001", Map.of("modelId", "forecast-001", "name", "Demand Forecasting Model", "type", "FORECASTING", "version", "1.2.0", "status", "TRAINED", "accuracy", 0.82, "createdAt", LocalDateTime.now().minusDays(7).format(DateTimeFormatter.ISO_DATE_TIME)));
        modelRegistry.put("pricing-001", Map.of("modelId", "pricing-001", "name", "Dynamic Pricing Model", "type", "PRICING", "version", "1.0.0", "status", "DEPLOYED", "accuracy", 0.85, "createdAt", LocalDateTime.now().minusDays(2).format(DateTimeFormatter.ISO_DATE_TIME)));
    }

    @PostMapping("/train")
    public Map<String, String> startTraining(@RequestBody Map<String, Object> request) {
        String modelType = (String) request.getOrDefault("modelType", "unknown");
        String modelId = (String) request.getOrDefault("modelId", UUID.randomUUID().toString());
        String jobId = "job-" + UUID.randomUUID().toString();

        Map<String, Object> job = new HashMap<>();
        job.put("jobId", jobId);
        job.put("modelId", modelId);
        job.put("modelType", modelType);
        job.put("status", "QUEUED");
        job.put("progress", 0.0);
        job.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        trainingJobs.put(jobId, job);

        return Map.of(
                "status", "TRAINING_STARTED",
                "modelId", modelId,
                "modelType", modelType,
                "jobId", jobId,
                "estimatedCompletion", LocalDateTime.now().plusHours(2).format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    @GetMapping("/train/{jobId}/status")
    public Map<String, Object> getTrainingStatus(@PathVariable String jobId) {
        Map<String, Object> job = trainingJobs.get(jobId);
        if (job == null) {
            return Map.of("jobId", jobId, "status", "NOT_FOUND", "progress", 0.0, "metrics", Map.of());
        }
        // Simulate progress
        job.put("progress", Math.min(1.0, ((double) job.getOrDefault("progress", 0.0)) + 0.1));
        if ((double) job.get("progress") >= 1.0) {
            job.put("status", "COMPLETED");
            job.put("metrics", Map.of("accuracy", 0.85 + new Random().nextDouble() * 0.1, "loss", 0.1 + new Random().nextDouble() * 0.2));
            job.put("completedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        } else {
            job.put("status", "IN_PROGRESS");
        }
        return job;
    }

    @PostMapping("/deploy")
    public Map<String, String> deployModel(@RequestBody Map<String, Object> request) {
        String modelId = (String) request.get("modelId");
        String version = (String) request.getOrDefault("version", "1.0.0");
        String environment = (String) request.getOrDefault("environment", "staging");

        Map<String, Object> model = modelRegistry.get(modelId);
        if (model != null) {
            model.put("status", "DEPLOYED");
            model.put("version", version);
            model.put("deployedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
            model.put("environment", environment);
        }

        return Map.of(
                "status", "DEPLOYED",
                "modelId", modelId,
                "version", version,
                "environment", environment,
                "endpoint", "/v1/ml/models/" + modelId + "/predict",
                "deployedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    @PostMapping("/predict/{modelId}")
    public Map<String, Object> predict(@PathVariable String modelId,
                                       @RequestBody Map<String, Object> input) {
        Map<String, Object> model = modelRegistry.get(modelId);
        String status = model != null ? (String) model.get("status") : "UNKNOWN";

        if (!"DEPLOYED".equals(status)) {
            return Map.of("modelId", modelId, "error", "Model not deployed", "status", status);
        }

        Random random = new Random(modelId.hashCode());
        return Map.of(
                "modelId", modelId,
                "prediction", Map.of("value", random.nextDouble() * 100, "category", getPredictionCategory(modelId, random)),
                "confidence", Math.round((0.7 + random.nextDouble() * 0.25) * 100.0) / 100.0,
                "latencyMs", 50 + random.nextInt(200),
                "modelVersion", model.get("version"),
                "timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    @GetMapping("/models")
    public List<Map<String, Object>> listModels(@RequestParam(required = false) String modelType) {
        if (modelType != null && !modelType.isEmpty()) {
            return modelRegistry.values().stream()
                    .filter(m -> modelType.equals(m.get("type")))
                    .map(this::enrichModel)
                    .toList();
        }
        return modelRegistry.values().stream().map(this::enrichModel).toList();
    }

    @GetMapping("/models/{modelId}/versions")
    public List<Map<String, Object>> getModelVersions(@PathVariable String modelId) {
        return List.of(
                Map.of("version", "1.0.0", "status", "ARCHIVED", "createdAt", LocalDateTime.now().minusDays(60).format(DateTimeFormatter.ISO_DATE_TIME), "performanceMetrics", Map.of("accuracy", 0.72)),
                Map.of("version", "2.0.0", "status", "ARCHIVED", "createdAt", LocalDateTime.now().minusDays(30).format(DateTimeFormatter.ISO_DATE_TIME), "performanceMetrics", Map.of("accuracy", 0.81)),
                Map.of("version", modelRegistry.containsKey(modelId) ? modelRegistry.get(modelId).get("version") : "3.0.0", "status", "DEPLOYED", "createdAt", LocalDateTime.now().minusDays(2).format(DateTimeFormatter.ISO_DATE_TIME), "performanceMetrics", Map.of("accuracy", 0.88 + new Random().nextDouble() * 0.05))
        );
    }

    @PostMapping("/models/{modelId}/evaluate")
    public Map<String, Object> evaluateModel(@PathVariable String modelId,
                                             @RequestBody Map<String, Object> request) {
        Random random = new Random(modelId.hashCode());
        return Map.of(
                "modelId", modelId,
                "metrics", Map.of(
                        "accuracy", Math.round((0.75 + random.nextDouble() * 0.2) * 100.0) / 100.0,
                        "precision", Math.round((0.73 + random.nextDouble() * 0.22) * 100.0) / 100.0,
                        "recall", Math.round((0.70 + random.nextDouble() * 0.25) * 100.0) / 100.0,
                        "f1Score", Math.round((0.72 + random.nextDouble() * 0.23) * 100.0) / 100.0,
                        "mae", Math.round(random.nextDouble() * 10 * 100.0) / 100.0,
                        "rmse", Math.round(random.nextDouble() * 15 * 100.0) / 100.0
                ),
                "datasetSize", 5000 + random.nextInt(45000),
                "evaluatedAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    @PostMapping("/models/{modelId}/retrain")
    public Map<String, String> triggerRetraining(@PathVariable String modelId,
                                                 @RequestBody Map<String, Object> request) {
        String jobId = "job-" + UUID.randomUUID().toString();
        trainingJobs.put(jobId, Map.of("jobId", jobId, "modelId", modelId, "status", "QUEUED", "progress", 0.0));
        return Map.of(
                "status", "RETRAINING_STARTED",
                "modelId", modelId,
                "jobId", jobId,
                "estimatedCompletion", LocalDateTime.now().plusMinutes(30).format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    @GetMapping("/feature-store/entities")
    public List<Map<String, Object>> listFeatureEntities() {
        List<Map<String, Object>> entities = new ArrayList<>();
        for (String entityName : featureStore.keySet()) {
            entities.add(Map.of(
                    "entityName", entityName,
                    "description", entityName.substring(0, 1).toUpperCase() + entityName.substring(1) + " features for ML models",
                    "featureCount", featureStore.get(entityName).size()
            ));
        }
        return entities;
    }

    @GetMapping("/feature-store/entities/{entityName}/features")
    public List<Map<String, Object>> getEntityFeatures(@PathVariable String entityName) {
        List<String> features = featureStore.get(entityName);
        if (features == null) return List.of();

        return features.stream().map(f -> {
            String[] parts = f.split(":");
            return Map.of("featureName", parts[0], "dataType", parts[1]);
        }).toList();
    }

    @GetMapping("/experiments")
    public List<Map<String, Object>> listExperiments(@RequestParam(required = false) String modelId) {
        Random random = new Random();
        List<Map<String, Object>> experiments = new ArrayList<>();
        String[] statuses = {"COMPLETED", "RUNNING", "FAILED"};
        for (int i = 1; i <= 3; i++) {
            experiments.add(Map.of(
                    "experimentId", "exp-" + String.format("%03d", i),
                    "modelId", modelId != null ? modelId : "rec-001",
                    "name", getExperimentName(i),
                    "startTime", LocalDateTime.now().minusDays(random.nextInt(30)).format(DateTimeFormatter.ISO_DATE_TIME),
                    "endTime", LocalDateTime.now().minusDays(random.nextInt(5)).format(DateTimeFormatter.ISO_DATE_TIME),
                    "status", statuses[random.nextInt(statuses.length)],
                    "metrics", Map.of("accuracy", Math.round((0.7 + random.nextDouble() * 0.25) * 100.0) / 100.0),
                    "hyperparameters", Map.of("learning_rate", 0.001 * (i), "batch_size", 32 * i)
            ));
        }
        return experiments;
    }

    @GetMapping("/monitoring/drift")
    public Map<String, Object> getFeatureDrift(@RequestParam String modelId,
                                               @RequestParam String featureName) {
        Random random = new Random((modelId + featureName).hashCode());
        double driftScore = random.nextDouble() * 0.2;
        return Map.of(
                "modelId", modelId,
                "featureName", featureName,
                "driftDetected", driftScore > 0.1,
                "driftScore", Math.round(driftScore * 100.0) / 100.0,
                "driftSeverity", driftScore > 0.15 ? "HIGH" : driftScore > 0.08 ? "MEDIUM" : "LOW",
                "recommendedAction", driftScore > 0.1 ? "RETRAIN_MODEL" : "NO_ACTION",
                "lastChecked", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    @GetMapping("/monitoring/prediction")
    public Map<String, Object> getPredictionMonitoring(@RequestParam String modelId) {
        Random random = new Random(modelId.hashCode());
        return Map.of(
                "modelId", modelId,
                "predictionDistribution", Map.of(
                        "mean", Math.round(random.nextDouble() * 100 * 100.0) / 100.0,
                        "std", Math.round(random.nextDouble() * 20 * 100.0) / 100.0,
                        "min", 0.0,
                        "max", 100.0
                ),
                "averageLatencyMs", Math.round((20 + random.nextDouble() * 100) * 100.0) / 100.0,
                "p95LatencyMs", Math.round((50 + random.nextDouble() * 200) * 100.0) / 100.0,
                "errorRate", Math.round((random.nextDouble() * 0.05) * 100.0) / 100.0,
                "requestsPerMinute", 100 + random.nextInt(900),
                "uptime", Math.round((99.5 + random.nextDouble() * 0.5) * 10.0) / 10.0
        );
    }

    @PostMapping("/alerts")
    public Map<String, String> createAlert(@RequestBody Map<String, Object> request) {
        return Map.of(
                "status", "ALERT_CREATED",
                "alertId", UUID.randomUUID().toString(),
                "severity", (String) request.getOrDefault("severity", "INFO"),
                "createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
    }

    private Map<String, Object> enrichModel(Map<String, Object> model) {
        Map<String, Object> enriched = new HashMap<>(model);
        enriched.put("endpoint", "/v1/ml/models/" + model.get("modelId") + "/predict");
        enriched.put("monitoring", Map.of("enabled", true, "lastChecked", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)));
        enriched.put("featureDependencies", List.of("feature-store/" + model.get("type")));
        return enriched;
    }

    private String getPredictionCategory(String modelId, Random random) {
        if (modelId.contains("rec")) return random.nextBoolean() ? "PURCHASE" : "CLICK";
        if (modelId.contains("fraud")) return random.nextBoolean() ? "LEGITIMATE" : "SUSPICIOUS";
        if (modelId.contains("forecast")) return "DEMAND_FORECAST";
        if (modelId.contains("pricing")) return "DYNAMIC_PRICE";
        return "GENERAL";
    }

    private String getExperimentName(int i) {
        String[] names = {"Baseline model with default parameters", "Enhanced model with feature engineering", "Optimized model with hyperparameter tuning"};
        return names[Math.min(i - 1, names.length - 1)];
    }
}
