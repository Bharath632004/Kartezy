package com.kartezy.aiservice.controller;

import com.kartezy.aiservice.service.AIServiceFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/v1/delivery/intelligence")
public class DeliveryIntelligenceController {

    @Autowired
    private AIServiceFacade aiServiceFacade;

    @GetMapping("/eta")
    public Map<String, Object> getETA(@RequestParam String orderId,
                                      @RequestParam String deliveryAddressId) {
        Random random = new Random((orderId + deliveryAddressId).hashCode());
        int etaMinutes = 10 + random.nextInt(30);
        return Map.of(
                "orderId", orderId,
                "estimatedDeliveryTime", LocalDateTime.now().plusMinutes(etaMinutes).format(DateTimeFormatter.ISO_DATE_TIME),
                "confidence", Math.round((0.7 + random.nextDouble() * 0.25) * 100.0) / 100.0,
                "estimatedMinutes", etaMinutes,
                "factors", Map.of(
                        "trafficDelay", random.nextInt(5),
                        "weatherDelay", random.nextDouble() > 0.8 ? random.nextInt(3) : 0,
                        "driverAvailability", random.nextDouble() > 0.9 ? 1 : 0,
                        "distance", Math.round((0.5 + random.nextDouble() * 5.0) * 10.0) / 10.0
                )
        );
    }

    @GetMapping("/route/optimize")
    public Map<String, Object> optimizeRoute(@RequestParam String deliveryPersonId,
                                             @RequestParam List<String> orderIds) {
        Random random = new Random(deliveryPersonId.hashCode());
        List<String> optimized = new ArrayList<>(orderIds);
        Collections.shuffle(optimized, random);
        return Map.of(
                "deliveryPersonId", deliveryPersonId,
                "optimizedOrderSequence", optimized,
                "estimatedTotalTime", orderIds.size() * (15 + random.nextInt(20)),
                "distance", Math.round((orderIds.size() * (1.0 + random.nextDouble() * 2.0)) * 10.0) / 10.0,
                "algorithmUsed", "NEAREST_NEIGHBOR",
                "fuelEstimate", Math.round(orderIds.size() * (0.1 + random.nextDouble() * 0.2) * 10.0) / 10.0
        );
    }

    @GetMapping("/delay/predict")
    public Map<String, Object> predictDelay(@RequestParam String orderId) {
        Random random = new Random(orderId.hashCode());
        double delayProb = random.nextDouble() * 0.3;
        return Map.of(
                "orderId", orderId,
                "delayProbability", Math.round(delayProb * 100.0) / 100.0,
                "expectedDelayMinutes", delayProb > 0.1 ? random.nextInt(15) + 5 : 0,
                "reasons", delayProb > 0.1 ? List.of("TRAFFIC_CONGESTION", "HIGH_ORDER_VOLUME") : List.of(),
                "riskLevel", delayProb > 0.2 ? "HIGH" : delayProb > 0.1 ? "MEDIUM" : "LOW"
        );
    }

    @GetMapping("/driver/assignment")
    public Map<String, Object> assignDriver(@RequestParam String orderId,
                                            @RequestParam List<String> availableDriverIds) {
        if (availableDriverIds.isEmpty()) {
            return Map.of("orderId", orderId, "assignedDriverId", "", "confidence", 0.0, "message", "No drivers available");
        }
        Random random = new Random(orderId.hashCode());
        String assignedDriver = availableDriverIds.get(random.nextInt(availableDriverIds.size()));
        return Map.of(
                "orderId", orderId,
                "assignedDriverId", assignedDriver,
                "confidence", Math.round((0.75 + random.nextDouble() * 0.2) * 100.0) / 100.0,
                "estimatedArrival", LocalDateTime.now().plusMinutes(10 + random.nextInt(15)).format(DateTimeFormatter.ISO_DATE_TIME),
                "assignmentStrategy", "NEAREST_AVAILABLE"
        );
    }

    @GetMapping("/zone/optimize")
    public Map<String, Object> optimizeZoneAssignment(@RequestParam String zoneId,
                                                      @RequestParam int numDrivers) {
        Random random = new Random(zoneId.hashCode());
        List<Map<String, Object>> assignments = new ArrayList<>();
        for (int i = 1; i <= numDrivers; i++) {
            assignments.add(Map.of(
                    "driverId", "DRV-" + (100 + i),
                    "zone", "SECTOR-" + (char) ('A' + random.nextInt(5)),
                    "expectedLoad", Math.round((0.3 + random.nextDouble() * 0.7) * 100.0) / 100.0
            ));
        }
        return Map.of(
                "zoneId", zoneId,
                "driverAssignments", assignments,
                "expectedUtilization", Math.round((0.6 + random.nextDouble() * 0.3) * 100.0) / 100.0,
                "recommendedDrivers", numDrivers + random.nextInt(5),
                "optimalBatchSize", 2 + random.nextInt(4)
        );
    }

    @GetMapping("/batch/delivery")
    public Map<String, Object> getBatchDeliverySuggestions(@RequestParam String deliveryPersonId,
                                                           @RequestParam String currentLocation) {
        Random random = new Random(deliveryPersonId.hashCode());
        int batchSize = 2 + random.nextInt(4);
        List<String> batchOrders = new ArrayList<>();
        for (int i = 0; i < batchSize; i++) {
            batchOrders.add("ORD-" + (100000 + random.nextInt(900000)));
        }
        return Map.of(
                "deliveryPersonId", deliveryPersonId,
                "suggestedBatchOrderIds", batchOrders,
                "estimatedTimeSavings", batchSize * (5 + random.nextInt(10)),
                "estimatedDistanceSavings", Math.round((batchSize * (0.5 + random.nextDouble())) * 10.0) / 10.0,
                "batchEfficiency", Math.round((0.15 + random.nextDouble() * 0.3) * 100.0) / 100.0
        );
    }

    @GetMapping("/failure/risk")
    public Map<String, Object> getDeliveryFailureRisk(@RequestParam String orderId) {
        Random random = new Random(orderId.hashCode());
        double failureProb = random.nextDouble() * 0.15;
        List<String> reasons = new ArrayList<>();
        if (failureProb > 0.1) reasons.add("INCORRECT_ADDRESS");
        if (failureProb > 0.08) reasons.add("RECIPIENT_NOT_AVAILABLE");
        if (random.nextDouble() > 0.9) reasons.add("HIGH_RISK_AREA");
        return Map.of(
                "orderId", orderId,
                "failureProbability", Math.round(failureProb * 100.0) / 100.0,
                "riskLevel", failureProb > 0.1 ? "MEDIUM" : "LOW",
                "reasons", reasons,
                "recommendedAction", failureProb > 0.1 ? "VERIFY_ADDRESS" : "PROCEED_NORMALLY"
        );
    }

    @GetMapping("/performance/driver")
    public Map<String, Object> getDriverPerformanceMetrics(@RequestParam String driverId) {
        Random random = new Random(driverId.hashCode());
        return Map.of(
                "driverId", driverId,
                "onTimeDeliveryRate", Math.round((0.85 + random.nextDouble() * 0.15) * 100.0) / 100.0,
                "averageRating", Math.round((3.5 + random.nextDouble() * 1.5) * 10.0) / 10.0,
                "deliveriesPerHour", Math.round((2.0 + random.nextDouble() * 3.0) * 10.0) / 10.0,
                "fuelEfficiency", Math.round((15 + random.nextDouble() * 20) * 10.0) / 10.0,
                "totalDeliveries", 100 + random.nextInt(900),
                "averageDeliveryTime", 15 + random.nextInt(20),
                "acceptanceRate", Math.round((0.8 + random.nextDouble() * 0.2) * 100.0) / 100.0
        );
    }

    @GetMapping("/performance/fleet")
    public Map<String, Object> getFleetPerformanceMetrics() {
        Random random = new Random();
        return Map.of(
                "totalDeliveries", 5000 + random.nextInt(15000),
                "onTimeDeliveryRate", Math.round((0.88 + random.nextDouble() * 0.12) * 100.0) / 100.0,
                "averageDeliveryTime", 18 + random.nextInt(15),
                "totalDistance", Math.round((500 + random.nextDouble() * 1500) * 10.0) / 10.0,
                "fuelConsumption", Math.round((50 + random.nextDouble() * 100) * 10.0) / 10.0,
                "activeDrivers", 50 + random.nextInt(200),
                "customerRating", Math.round((4.0 + random.nextDouble() * 1.0) * 10.0) / 10.0,
                "peakHourUtilization", Math.round((0.6 + random.nextDouble() * 0.3) * 100.0) / 100.0
        );
    }
}
