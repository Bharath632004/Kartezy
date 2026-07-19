package com.kartezy.shared.ai;

import java.util.*;

public class DeliveryModels {

    public static class ETARequest {
        private String orderId;
        private String storeId;
        private String deliveryAddressId;
        private double storeLat;
        private double storeLng;
        private double deliveryLat;
        private double deliveryLng;
        private String timeOfDay;
        private String dayOfWeek;
        private int estimatedPreparationTime;

        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        public String getStoreId() { return storeId; }
        public void setStoreId(String storeId) { this.storeId = storeId; }
        public String getDeliveryAddressId() { return deliveryAddressId; }
        public void setDeliveryAddressId(String deliveryAddressId) { this.deliveryAddressId = deliveryAddressId; }
        public double getStoreLat() { return storeLat; }
        public void setStoreLat(double storeLat) { this.storeLat = storeLat; }
        public double getStoreLng() { return storeLng; }
        public void setStoreLng(double storeLng) { this.storeLng = storeLng; }
        public double getDeliveryLat() { return deliveryLat; }
        public void setDeliveryLat(double deliveryLat) { this.deliveryLat = deliveryLat; }
        public double getDeliveryLng() { return deliveryLng; }
        public void setDeliveryLng(double deliveryLng) { this.deliveryLng = deliveryLng; }
        public String getTimeOfDay() { return timeOfDay; }
        public void setTimeOfDay(String timeOfDay) { this.timeOfDay = timeOfDay; }
        public String getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }
        public int getEstimatedPreparationTime() { return estimatedPreparationTime; }
        public void setEstimatedPreparationTime(int estimatedPreparationTime) { this.estimatedPreparationTime = estimatedPreparationTime; }
    }

    public static class ETAResult {
        private String orderId;
        private int estimatedMinutes;
        private double confidence;
        private int distanceMeters;
        private ETABreakdown breakdown;
        private List<String> factors;

        public ETAResult(String orderId, int estimatedMinutes, double confidence) {
            this.orderId = orderId;
            this.estimatedMinutes = estimatedMinutes;
            this.confidence = confidence;
        }

        public String getOrderId() { return orderId; }
        public int getEstimatedMinutes() { return estimatedMinutes; }
        public double getConfidence() { return confidence; }
        public int getDistanceMeters() { return distanceMeters; }
        public void setDistanceMeters(int distanceMeters) { this.distanceMeters = distanceMeters; }
        public ETABreakdown getBreakdown() { return breakdown; }
        public void setBreakdown(ETABreakdown breakdown) { this.breakdown = breakdown; }
        public List<String> getFactors() { return factors; }
        public void setFactors(List<String> factors) { this.factors = factors; }
    }

    public static class ETABreakdown {
        private int preparationTime;
        private int travelTime;
        private int trafficDelay;
        private int pickupTime;
        private int dropoffTime;

        public int getPreparationTime() { return preparationTime; }
        public void setPreparationTime(int preparationTime) { this.preparationTime = preparationTime; }
        public int getTravelTime() { return travelTime; }
        public void setTravelTime(int travelTime) { this.travelTime = travelTime; }
        public int getTrafficDelay() { return trafficDelay; }
        public void setTrafficDelay(int trafficDelay) { this.trafficDelay = trafficDelay; }
        public int getPickupTime() { return pickupTime; }
        public void setPickupTime(int pickupTime) { this.pickupTime = pickupTime; }
        public int getDropoffTime() { return dropoffTime; }
        public void setDropoffTime(int dropoffTime) { this.dropoffTime = dropoffTime; }
    }

    public static class RouteOptimizationRequest {
        private List<DeliveryStop> stops;
        private String startLocation;
        private double startLat;
        private double startLng;
        private int maxStops;
        private boolean optimizeForTime = true;
        private Map<String, Object> constraints;

        public List<DeliveryStop> getStops() { return stops; }
        public void setStops(List<DeliveryStop> stops) { this.stops = stops; }
        public String getStartLocation() { return startLocation; }
        public void setStartLocation(String startLocation) { this.startLocation = startLocation; }
        public double getStartLat() { return startLat; }
        public void setStartLat(double startLat) { this.startLat = startLat; }
        public double getStartLng() { return startLng; }
        public void setStartLng(double startLng) { this.startLng = startLng; }
        public int getMaxStops() { return maxStops; }
        public void setMaxStops(int maxStops) { this.maxStops = maxStops; }
        public boolean isOptimizeForTime() { return optimizeForTime; }
        public void setOptimizeForTime(boolean optimizeForTime) { this.optimizeForTime = optimizeForTime; }
        public Map<String, Object> getConstraints() { return constraints; }
        public void setConstraints(Map<String, Object> constraints) { this.constraints = constraints; }
    }

    public static class DeliveryStop {
        private String orderId;
        private String address;
        private double lat;
        private double lng;
        private int estimatedServiceTime;
        private String timeWindow;

        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public double getLat() { return lat; }
        public void setLat(double lat) { this.lat = lat; }
        public double getLng() { return lng; }
        public void setLng(double lng) { this.lng = lng; }
        public int getEstimatedServiceTime() { return estimatedServiceTime; }
        public void setEstimatedServiceTime(int estimatedServiceTime) { this.estimatedServiceTime = estimatedServiceTime; }
        public String getTimeWindow() { return timeWindow; }
        public void setTimeWindow(String timeWindow) { this.timeWindow = timeWindow; }
    }

    public static class OptimizedRoute {
        private String deliveryPersonId;
        private List<String> orderSequence;
        private int estimatedTotalTime;
        private double totalDistance;
        private int estimatedFuelConsumption;
        private Map<String, Object> segmentDetails;

        public OptimizedRoute(String deliveryPersonId) {
            this.deliveryPersonId = deliveryPersonId;
            this.orderSequence = new ArrayList<>();
        }

        public String getDeliveryPersonId() { return deliveryPersonId; }
        public List<String> getOrderSequence() { return orderSequence; }
        public int getEstimatedTotalTime() { return estimatedTotalTime; }
        public void setEstimatedTotalTime(int estimatedTotalTime) { this.estimatedTotalTime = estimatedTotalTime; }
        public double getTotalDistance() { return totalDistance; }
        public void setTotalDistance(double totalDistance) { this.totalDistance = totalDistance; }
        public int getEstimatedFuelConsumption() { return estimatedFuelConsumption; }
        public void setEstimatedFuelConsumption(int estimatedFuelConsumption) { this.estimatedFuelConsumption = estimatedFuelConsumption; }
        public Map<String, Object> getSegmentDetails() { return segmentDetails; }
        public void setSegmentDetails(Map<String, Object> segmentDetails) { this.segmentDetails = segmentDetails; }
    }

    public static class DriverPerformance {
        private String driverId;
        private double onTimeDeliveryRate;
        private double averageRating;
        private double deliveriesPerHour;
        private double acceptanceRate;
        private double completionRate;
        private double averageDistancePerDelivery;
        private Map<String, Double> performanceByTimeOfDay;
        private Map<String, Double> performanceByZone;

        public DriverPerformance(String driverId) {
            this.driverId = driverId;
            this.performanceByTimeOfDay = new HashMap<>();
            this.performanceByZone = new HashMap<>();
        }

        public String getDriverId() { return driverId; }
        public double getOnTimeDeliveryRate() { return onTimeDeliveryRate; }
        public void setOnTimeDeliveryRate(double onTimeDeliveryRate) { this.onTimeDeliveryRate = onTimeDeliveryRate; }
        public double getAverageRating() { return averageRating; }
        public void setAverageRating(double averageRating) { this.averageRating = averageRating; }
        public double getDeliveriesPerHour() { return deliveriesPerHour; }
        public void setDeliveriesPerHour(double deliveriesPerHour) { this.deliveriesPerHour = deliveriesPerHour; }
        public double getAcceptanceRate() { return acceptanceRate; }
        public void setAcceptanceRate(double acceptanceRate) { this.acceptanceRate = acceptanceRate; }
        public double getCompletionRate() { return completionRate; }
        public void setCompletionRate(double completionRate) { this.completionRate = completionRate; }
        public double getAverageDistancePerDelivery() { return averageDistancePerDelivery; }
        public void setAverageDistancePerDelivery(double averageDistancePerDelivery) { this.averageDistancePerDelivery = averageDistancePerDelivery; }
        public Map<String, Double> getPerformanceByTimeOfDay() { return performanceByTimeOfDay; }
        public Map<String, Double> getPerformanceByZone() { return performanceByZone; }
    }

    public static class ZoneAssignment {
        private String zoneId;
        private int optimalDrivers;
        private List<String> assignedDriverIds;
        private double expectedUtilization;
        private double expectedCoverage;
        private double averageDeliveryTime;

        public String getZoneId() { return zoneId; }
        public void setZoneId(String zoneId) { this.zoneId = zoneId; }
        public int getOptimalDrivers() { return optimalDrivers; }
        public void setOptimalDrivers(int optimalDrivers) { this.optimalDrivers = optimalDrivers; }
        public List<String> getAssignedDriverIds() { return assignedDriverIds; }
        public void setAssignedDriverIds(List<String> assignedDriverIds) { this.assignedDriverIds = assignedDriverIds; }
        public double getExpectedUtilization() { return expectedUtilization; }
        public void setExpectedUtilization(double expectedUtilization) { this.expectedUtilization = expectedUtilization; }
        public double getExpectedCoverage() { return expectedCoverage; }
        public void setExpectedCoverage(double expectedCoverage) { this.expectedCoverage = expectedCoverage; }
        public double getAverageDeliveryTime() { return averageDeliveryTime; }
        public void setAverageDeliveryTime(double averageDeliveryTime) { this.averageDeliveryTime = averageDeliveryTime; }
    }

    public static class BatchSuggestion {
        private String batchId;
        private List<String> orderIds;
        private int estimatedTimeSavings;
        private double distanceSaved;
        private double efficiencyGain;
        private List<String> compatibleDrivers;

        public BatchSuggestion(String batchId) {
            this.batchId = batchId;
            this.orderIds = new ArrayList<>();
            this.compatibleDrivers = new ArrayList<>();
        }

        public String getBatchId() { return batchId; }
        public List<String> getOrderIds() { return orderIds; }
        public int getEstimatedTimeSavings() { return estimatedTimeSavings; }
        public void setEstimatedTimeSavings(int estimatedTimeSavings) { this.estimatedTimeSavings = estimatedTimeSavings; }
        public double getDistanceSaved() { return distanceSaved; }
        public void setDistanceSaved(double distanceSaved) { this.distanceSaved = distanceSaved; }
        public double getEfficiencyGain() { return efficiencyGain; }
        public void setEfficiencyGain(double efficiencyGain) { this.efficiencyGain = efficiencyGain; }
        public List<String> getCompatibleDrivers() { return compatibleDrivers; }
    }
}
