package com.kartezy.shared.ai;

import java.util.*;

public class FraudDetectionModels {

    public static class FraudCheckRequest {
        private String transactionId;
        private String userId;
        private String userType;
        private String action;
        private Map<String, Object> details;
        private double amount;
        private String paymentMethod;
        private String ipAddress;
        private String deviceId;
        private String location;
        private long timestamp;

        public FraudCheckRequest() {}

        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getUserType() { return userType; }
        public void setUserType(String userType) { this.userType = userType; }
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public Map<String, Object> getDetails() { return details; }
        public void setDetails(Map<String, Object> details) { this.details = details; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public String getPaymentMethod() { return paymentMethod; }
        public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
        public String getDeviceId() { return deviceId; }
        public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public long getTimestamp() { return timestamp; }
        public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    }

    public static class FraudCheckResult {
        private String transactionId;
        private boolean isFraudulent;
        private double fraudScore;
        private double riskScore;
        private List<String> reasons;
        private List<FraudIndicator> indicators;
        private String recommendedAction;
        private String severity;
        private Map<String, Double> factorScores;

        public FraudCheckResult(String transactionId) {
            this.transactionId = transactionId;
            this.isFraudulent = false;
            this.reasons = new ArrayList<>();
            this.indicators = new ArrayList<>();
            this.factorScores = new HashMap<>();
            this.recommendedAction = "APPROVE";
            this.severity = "LOW";
        }

        public String getTransactionId() { return transactionId; }
        public boolean isFraudulent() { return isFraudulent; }
        public void setFraudulent(boolean fraudulent) { isFraudulent = fraudulent; }
        public double getFraudScore() { return fraudScore; }
        public void setFraudScore(double fraudScore) { this.fraudScore = fraudScore; }
        public double getRiskScore() { return riskScore; }
        public void setRiskScore(double riskScore) { this.riskScore = riskScore; }
        public List<String> getReasons() { return reasons; }
        public void addReason(String reason) { this.reasons.add(reason); }
        public List<FraudIndicator> getIndicators() { return indicators; }
        public void addIndicator(FraudIndicator indicator) { this.indicators.add(indicator); }
        public String getRecommendedAction() { return recommendedAction; }
        public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public Map<String, Double> getFactorScores() { return factorScores; }
        public void addFactor(String factor, double score) { this.factorScores.put(factor, score); }
    }

    public static class FraudIndicator {
        private String type;
        private String description;
        private double weight;
        private double score;
        private Map<String, Object> evidence;

        public FraudIndicator(String type, String description, double weight, double score) {
            this.type = type;
            this.description = description;
            this.weight = weight;
            this.score = score;
        }

        public String getType() { return type; }
        public String getDescription() { return description; }
        public double getWeight() { return weight; }
        public double getScore() { return score; }
        public Map<String, Object> getEvidence() { return evidence; }
        public void setEvidence(Map<String, Object> evidence) { this.evidence = evidence; }
    }

    public static class FraudAlert {
        private String alertId;
        private String transactionId;
        private String userId;
        private String alertType;
        private String severity;
        private String status;
        private String description;
        private double score;
        private long timestamp;
        private Map<String, Object> metadata;

        public FraudAlert(String alertId, String transactionId, String userId, String alertType,
                        String severity, String description, double score) {
            this.alertId = alertId;
            this.transactionId = transactionId;
            this.userId = userId;
            this.alertType = alertType;
            this.severity = severity;
            this.description = description;
            this.score = score;
            this.status = "OPEN";
            this.timestamp = System.currentTimeMillis();
        }

        public String getAlertId() { return alertId; }
        public String getTransactionId() { return transactionId; }
        public String getUserId() { return userId; }
        public String getAlertType() { return alertType; }
        public String getSeverity() { return severity; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDescription() { return description; }
        public double getScore() { return score; }
        public long getTimestamp() { return timestamp; }
        public Map<String, Object> getMetadata() { return metadata; }
        public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    }

    public static class UserBehaviorProfile {
        private String userId;
        private double averageOrderValue;
        private double orderFrequency;
        private double typicalOrderTime;
        private String typicalLocation;
        private List<String> typicalPaymentMethods;
        private List<String> typicalDevices;
        private Map<String, Double> behavioralFeatures;

        public UserBehaviorProfile(String userId) {
            this.userId = userId;
            this.typicalPaymentMethods = new ArrayList<>();
            this.typicalDevices = new ArrayList<>();
            this.behavioralFeatures = new HashMap<>();
        }

        public String getUserId() { return userId; }
        public double getAverageOrderValue() { return averageOrderValue; }
        public void setAverageOrderValue(double averageOrderValue) { this.averageOrderValue = averageOrderValue; }
        public double getOrderFrequency() { return orderFrequency; }
        public void setOrderFrequency(double orderFrequency) { this.orderFrequency = orderFrequency; }
        public double getTypicalOrderTime() { return typicalOrderTime; }
        public void setTypicalOrderTime(double typicalOrderTime) { this.typicalOrderTime = typicalOrderTime; }
        public String getTypicalLocation() { return typicalLocation; }
        public void setTypicalLocation(String typicalLocation) { this.typicalLocation = typicalLocation; }
        public List<String> getTypicalPaymentMethods() { return typicalPaymentMethods; }
        public List<String> getTypicalDevices() { return typicalDevices; }
        public Map<String, Double> getBehavioralFeatures() { return behavioralFeatures; }
        public void addBehavioralFeature(String name, double value) { this.behavioralFeatures.put(name, value); }
    }
}
