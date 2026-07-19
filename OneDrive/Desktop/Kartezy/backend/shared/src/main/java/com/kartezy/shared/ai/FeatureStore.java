package com.kartezy.shared.ai;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class FeatureStore {
    private final Map<String, Map<String, Object>> entityFeatures = new ConcurrentHashMap<>();
    private final Map<String, FeatureMetadata> featureMetadata = new ConcurrentHashMap<>();

    private static FeatureStore instance;

    private FeatureStore() {}

    public static synchronized FeatureStore getInstance() {
        if (instance == null) {
            instance = new FeatureStore();
        }
        return instance;
    }

    public void setFeature(String entityType, String entityId, String featureName, Object value) {
        String key = entityType + ":" + entityId;
        entityFeatures.computeIfAbsent(key, k -> new ConcurrentHashMap<>()).put(featureName, value);
    }

    public void setFeatures(String entityType, String entityId, Map<String, Object> features) {
        String key = entityType + ":" + entityId;
        entityFeatures.computeIfAbsent(key, k -> new ConcurrentHashMap<>()).putAll(features);
    }

    @SuppressWarnings("unchecked")
    public <T> T getFeature(String entityType, String entityId, String featureName) {
        String key = entityType + ":" + entityId;
        Map<String, Object> features = entityFeatures.get(key);
        if (features == null) return null;
        return (T) features.get(featureName);
    }

    public Map<String, Object> getAllFeatures(String entityType, String entityId) {
        String key = entityType + ":" + entityId;
        Map<String, Object> features = entityFeatures.get(key);
        return features != null ? new HashMap<>(features) : Collections.emptyMap();
    }

    public void registerFeature(String featureName, String entityType, String dataType, String description) {
        featureMetadata.put(featureName, new FeatureMetadata(featureName, entityType, dataType, description));
    }

    public List<FeatureMetadata> getFeaturesByEntity(String entityType) {
        List<FeatureMetadata> result = new ArrayList<>();
        for (FeatureMetadata meta : featureMetadata.values()) {
            if (meta.entityType.equals(entityType)) {
                result.add(meta);
            }
        }
        return result;
    }

    public void deleteEntityFeatures(String entityType, String entityId) {
        entityFeatures.remove(entityType + ":" + entityId);
    }

    public void bulkUpdate(Map<String, Map<String, Object>> batchFeatures) {
        for (Map.Entry<String, Map<String, Object>> entry : batchFeatures.entrySet()) {
            String[] parts = entry.getKey().split(":", 2);
            if (parts.length == 2) {
                setFeatures(parts[0], parts[1], entry.getValue());
            }
        }
    }

    public static class FeatureMetadata {
        private final String featureName;
        private final String entityType;
        private final String dataType;
        private final String description;

        public FeatureMetadata(String featureName, String entityType, String dataType, String description) {
            this.featureName = featureName;
            this.entityType = entityType;
            this.dataType = dataType;
            this.description = description;
        }

        public String getFeatureName() { return featureName; }
        public String getEntityType() { return entityType; }
        public String getDataType() { return dataType; }
        public String getDescription() { return description; }
    }
}
