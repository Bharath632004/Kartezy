package com.kartezy.crm.controller;

import com.kartezy.crm.entity.BehaviorEvent;
import com.kartezy.crm.service.BehaviorTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/crm/behavior")
@RequiredArgsConstructor
@Tag(name = "Behavior Tracking", description = "Customer behavior event tracking and analytics")
public class BehaviorController {

    private final BehaviorTrackingService behaviorService;

    @PostMapping("/track")
    @Operation(summary = "Track a behavior event")
    public ResponseEntity<Map<String, Object>> trackEvent(@RequestBody BehaviorEvent event) {
        var saved = behaviorService.trackEvent(event);
        return ResponseEntity.ok(wrapResponse(saved, "Event tracked"));
    }

    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get events for a customer")
    public ResponseEntity<Map<String, Object>> getCustomerEvents(@PathVariable Long customerId, Pageable pageable) {
        Page<BehaviorEvent> events = behaviorService.getCustomerEvents(customerId, pageable);
        return ResponseEntity.ok(wrapResponse(events, "Events retrieved"));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get behavior analytics")
    public ResponseEntity<Map<String, Object>> getBehaviorAnalytics() {
        Map<String, Object> analytics = behaviorService.getBehaviorAnalytics();
        return ResponseEntity.ok(wrapResponse(analytics, "Analytics retrieved"));
    }

    private Map<String, Object> wrapResponse(Object data, String message) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("data", data);
        response.put("message", message);
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return response;
    }
}
