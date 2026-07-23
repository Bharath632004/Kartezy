package com.kartezy.trackingservice.controller;

import com.kartezy.shared.dto.ApiResponse;
import com.kartezy.trackingservice.dto.TrackingEventDto;
import com.kartezy.trackingservice.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    @PostMapping("/events")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<TrackingEventDto>> recordEvent(@RequestBody TrackingEventDto request) {
        TrackingEventDto event = trackingService.recordEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(event, "Tracking event recorded"));
    }

    @GetMapping("/orders/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TrackingEventDto>>> getOrderTrack(@PathVariable UUID orderId) {
        return ResponseEntity.ok(ApiResponse.success(trackingService.getOrderTrack(orderId)));
    }

    @GetMapping("/orders/{orderId}/recent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TrackingEventDto>>> getRecentTrack(
            @PathVariable UUID orderId,
            @RequestParam(defaultValue = "5") int minutes) {
        return ResponseEntity.ok(ApiResponse.success(trackingService.getRecentTrack(orderId, minutes)));
    }

    @GetMapping("/partners/{deliveryPartnerId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DELIVERY_PARTNER')")
    public ResponseEntity<ApiResponse<List<TrackingEventDto>>> getDeliveryPartnerTrack(
            @PathVariable UUID deliveryPartnerId) {
        return ResponseEntity.ok(ApiResponse.success(trackingService.getDeliveryPartnerTrack(deliveryPartnerId)));
    }
}
