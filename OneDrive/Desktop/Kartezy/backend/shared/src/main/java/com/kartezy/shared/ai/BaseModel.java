package com.kartezy.shared.ai;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public abstract class BaseModel<T, R> implements AIModel<T, R> {
    private final String modelId;
    private final String modelVersion;
    private final Map<String, Double> metrics = new ConcurrentHashMap<>();
    private final AtomicLong predictionCount = new AtomicLong(0);
    private final AtomicLong totalLatencyMs = new AtomicLong(0);
    private volatile boolean ready = false;

    protected BaseModel(String modelId, String modelVersion) {
        this.modelId = modelId;
        this.modelVersion = modelVersion;
    }

    @Override
    public String getModelId() {
        return modelId;
    }

    @Override
    public String getModelVersion() {
        return modelVersion;
    }

    @Override
    public Map<String, Double> getMetrics() {
        Map<String, Double> snapshot = new ConcurrentHashMap<>(metrics);
        snapshot.put("predictionCount", (double) predictionCount.get());
        long count = predictionCount.get();
        snapshot.put("averageLatencyMs", count > 0 ? (double) totalLatencyMs.get() / count : 0.0);
        return snapshot;
    }

    @Override
    public boolean isReady() {
        return ready;
    }

    protected void setReady(boolean ready) {
        this.ready = ready;
    }

    protected void trackPrediction(long latencyMs) {
        predictionCount.incrementAndGet();
        totalLatencyMs.addAndGet(latencyMs);
    }

    protected void setMetric(String name, double value) {
        metrics.put(name, value);
    }

    public abstract R predictInternal(T input) throws Exception;

    @Override
    public R predict(T input) throws Exception {
        if (!ready) {
            throw new IllegalStateException("Model " + modelId + " version " + modelVersion + " is not ready");
        }
        long start = System.currentTimeMillis();
        try {
            R result = predictInternal(input);
            trackPrediction(System.currentTimeMillis() - start);
            return result;
        } catch (Exception e) {
            setMetric("lastError", 1.0);
            throw e;
        }
    }
}
