package com.kartezy.shared.ai;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

public class MLPipeline {
    private final Map<String, TrainingJob> trainingJobs = new ConcurrentHashMap<>();
    private final List<Experiment> experiments = new CopyOnWriteArrayList<>();
    private final ModelRegistry modelRegistry = ModelRegistry.getInstance();

    private static MLPipeline instance;

    private MLPipeline() {}

    public static synchronized MLPipeline getInstance() {
        if (instance == null) {
            instance = new MLPipeline();
        }
        return instance;
    }

    public String submitTrainingJob(String modelId, String modelType, Map<String, Object> config) {
        String jobId = "job-" + UUID.randomUUID();
        TrainingJob job = new TrainingJob(jobId, modelId, modelType, config, TrainingStatus.QUEUED, Instant.now());
        trainingJobs.put(jobId, job);
        return jobId;
    }

    public String createExperiment(String modelId, String name, Map<String, Object> params) {
        String experimentId = "exp-" + UUID.randomUUID();
        Experiment exp = new Experiment(experimentId, modelId, name, params, Instant.now(), "RUNNING");
        experiments.add(exp);
        return experimentId;
    }

    public void completeExperiment(String experimentId, Map<String, Double> metrics) {
        experiments.stream()
                .filter(e -> e.experimentId.equals(experimentId))
                .findFirst()
                .ifPresent(e -> {
                    e.status = "COMPLETED";
                    e.metrics = new HashMap<>(metrics);
                    e.endTime = Instant.now();
                });
    }

    public void deployModel(String modelId, String version) {
        modelRegistry.setActiveVersion(modelId, version);
    }

    public void updateTrainingProgress(String jobId, double progress, Map<String, Double> metrics) {
        TrainingJob job = trainingJobs.get(jobId);
        if (job != null) {
            job.progress = progress;
            job.metrics.putAll(metrics);
        }
    }

    public Optional<TrainingJob> getTrainingJob(String jobId) {
        return Optional.ofNullable(trainingJobs.get(jobId));
    }

    public List<Experiment> getExperiments(String modelId) {
        if (modelId == null) return new ArrayList<>(experiments);
        return experiments.stream()
                .filter(e -> e.modelId.equals(modelId))
                .toList();
    }

    public List<TrainingJob> getActiveJobs() {
        return trainingJobs.values().stream()
                .filter(j -> j.status == TrainingStatus.RUNNING || j.status == TrainingStatus.QUEUED)
                .toList();
    }

    public Map<String, Double> evaluateModel(String modelId, List<Map<String, Object>> testData) {
        Map<String, Double> evaluationMetrics = new HashMap<>();
        AIModel<?, ?> model = modelRegistry.getActiveModel(modelId);
        if (model == null) {
            evaluationMetrics.put("error", -1.0);
            return evaluationMetrics;
        }
        evaluationMetrics.putAll(model.getMetrics());
        evaluationMetrics.put("testDataSize", (double) testData.size());
        return evaluationMetrics;
    }

    public boolean retrainModel(String modelId) {
        String jobId = submitTrainingJob(modelId, "RETRAIN", Map.of("type", "auto_retrain"));
        return jobId != null;
    }

    public enum TrainingStatus {
        QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED
    }

    public static class TrainingJob {
        private final String jobId;
        private final String modelId;
        private final String modelType;
        private final Map<String, Object> config;
        private volatile TrainingStatus status;
        private volatile double progress;
        private final Map<String, Double> metrics = new ConcurrentHashMap<>();
        private final Instant createdAt;
        private Instant completedAt;
        private String error;

        public TrainingJob(String jobId, String modelId, String modelType, Map<String, Object> config,
                          TrainingStatus status, Instant createdAt) {
            this.jobId = jobId;
            this.modelId = modelId;
            this.modelType = modelType;
            this.config = config;
            this.status = status;
            this.createdAt = createdAt;
        }

        public String getJobId() { return jobId; }
        public String getModelId() { return modelId; }
        public String getModelType() { return modelType; }
        public Map<String, Object> getConfig() { return config; }
        public TrainingStatus getStatus() { return status; }
        public double getProgress() { return progress; }
        public Map<String, Double> getMetrics() { return metrics; }
        public Instant getCreatedAt() { return createdAt; }
        public Instant getCompletedAt() { return completedAt; }
        public String getError() { return error; }
    }

    public static class Experiment {
        private final String experimentId;
        private final String modelId;
        private final String name;
        private final Map<String, Object> params;
        private final Instant startTime;
        private volatile String status;
        private Map<String, Double> metrics;
        private Instant endTime;

        public Experiment(String experimentId, String modelId, String name, Map<String, Object> params,
                         Instant startTime, String status) {
            this.experimentId = experimentId;
            this.modelId = modelId;
            this.name = name;
            this.params = params;
            this.startTime = startTime;
            this.status = status;
        }

        public String getExperimentId() { return experimentId; }
        public String getModelId() { return modelId; }
        public String getName() { return name; }
        public Map<String, Object> getParams() { return params; }
        public Instant getStartTime() { return startTime; }
        public String getStatus() { return status; }
        public Map<String, Double> getMetrics() { return metrics; }
        public Instant getEndTime() { return endTime; }
    }
}
