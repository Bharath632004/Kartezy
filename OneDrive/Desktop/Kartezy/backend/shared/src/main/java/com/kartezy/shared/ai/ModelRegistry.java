package com.kartezy.shared.ai;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class ModelRegistry {
    private final Map<String, Map<String, RegisteredModel>> registry = new ConcurrentHashMap<>();
    private final Map<String, String> activeVersions = new ConcurrentHashMap<>();

    private static ModelRegistry instance;

    private ModelRegistry() {}

    public static synchronized ModelRegistry getInstance() {
        if (instance == null) {
            instance = new ModelRegistry();
        }
        return instance;
    }

    public void register(String modelId, String version, AIModel<?, ?> model) {
        registry.computeIfAbsent(modelId, k -> new ConcurrentHashMap<>())
                .put(version, new RegisteredModel(model, version, System.currentTimeMillis()));
    }

    @SuppressWarnings("unchecked")
    public <T, R> AIModel<T, R> getModel(String modelId, String version) {
        Map<String, RegisteredModel> versions = registry.get(modelId);
        if (versions == null) return null;
        RegisteredModel rm = version != null ? versions.get(version) : versions.get(activeVersions.get(modelId));
        return rm != null ? (AIModel<T, R>) rm.model : null;
    }

    @SuppressWarnings("unchecked")
    public <T, R> AIModel<T, R> getActiveModel(String modelId) {
        return getModel(modelId, null);
    }

    public void setActiveVersion(String modelId, String version) {
        Map<String, RegisteredModel> versions = registry.get(modelId);
        if (versions != null && versions.containsKey(version)) {
            activeVersions.put(modelId, version);
        }
    }

    public String getActiveVersion(String modelId) {
        return activeVersions.get(modelId);
    }

    public List<String> getRegisteredModels() {
        return new ArrayList<>(registry.keySet());
    }

    public List<String> getModelVersions(String modelId) {
        Map<String, RegisteredModel> versions = registry.get(modelId);
        return versions != null ? new ArrayList<>(versions.keySet()) : Collections.emptyList();
    }

    public boolean rollback(String modelId, String targetVersion) {
        Map<String, RegisteredModel> versions = registry.get(modelId);
        if (versions != null && versions.containsKey(targetVersion)) {
            activeVersions.put(modelId, targetVersion);
            return true;
        }
        return false;
    }

    public List<ModelHealth> getHealthStatus() {
        return registry.entrySet().stream()
                .flatMap(entry -> entry.getValue().values().stream()
                        .map(rm -> {
                            boolean healthy = false;
                            String error = null;
                            try {
                                healthy = rm.model.isReady();
                            } catch (Exception e) {
                                error = e.getMessage();
                            }
                            return new ModelHealth(entry.getKey(), rm.version, healthy, error, rm.deployedAt);
                        }))
                .collect(Collectors.toList());
    }

    public static class RegisteredModel {
        final AIModel<?, ?> model;
        final String version;
        final long deployedAt;

        RegisteredModel(AIModel<?, ?> model, String version, long deployedAt) {
            this.model = model;
            this.version = version;
            this.deployedAt = deployedAt;
        }
    }

    public static class ModelHealth {
        private final String modelId;
        private final String version;
        private final boolean healthy;
        private final String error;
        private final long deployedAt;

        public ModelHealth(String modelId, String version, boolean healthy, String error, long deployedAt) {
            this.modelId = modelId;
            this.version = version;
            this.healthy = healthy;
            this.error = error;
            this.deployedAt = deployedAt;
        }

        public String getModelId() { return modelId; }
        public String getVersion() { return version; }
        public boolean isHealthy() { return healthy; }
        public String getError() { return error; }
        public long getDeployedAt() { return deployedAt; }
    }
}
