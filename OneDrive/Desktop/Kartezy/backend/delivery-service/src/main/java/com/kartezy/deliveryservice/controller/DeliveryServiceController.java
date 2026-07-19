package com.kartezy.deliveryservice.controller;

import com.kartezy.deliveryservice.dto.*;
import com.kartezy.deliveryservice.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/delivery")
@RequiredArgsConstructor
public class DeliveryServiceController {
    private final DeliveryService deliveryService;

    @PostMapping("/partners")
    public ResponseEntity<DeliveryPartnerDto> registerPartner(@Valid @RequestBody DeliveryPartnerRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deliveryService.registerPartner(request));
    }

    @GetMapping("/partners")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<DeliveryPartnerDto>> getAllPartners() {
        return ResponseEntity.ok(deliveryService.getAllPartners());
    }

    @GetMapping("/partners/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeliveryPartnerDto> getPartner(@PathVariable UUID id) {
        return ResponseEntity.ok(deliveryService.getPartner(id));
    }

    @GetMapping("/partners/available")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DeliveryPartnerDto>> getAvailablePartners(@RequestParam(defaultValue = "") String city) {
        return ResponseEntity.ok(deliveryService.getAvailablePartners(city));
    }

    @PutMapping("/partners/{id}/location")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeliveryPartnerDto> updateLocation(@PathVariable UUID id,
                                                              @Valid @RequestBody DeliveryLocationUpdateDto location) {
        return ResponseEntity.ok(deliveryService.updateLocation(id, location));
    }

    @PutMapping("/partners/{id}/online")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeliveryPartnerDto> toggleOnline(@PathVariable UUID id, @RequestParam boolean online) {
        return ResponseEntity.ok(deliveryService.toggleOnlineStatus(id, online));
    }

    @PutMapping("/partners/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeliveryPartnerDto> verifyPartner(@PathVariable UUID id, @RequestParam boolean verified) {
        return ResponseEntity.ok(deliveryService.updateVerification(id, verified));
    }

    @PostMapping("/assignments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeliveryAssignmentDto> assignOrder(@Valid @RequestBody DeliveryAssignmentRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deliveryService.assignOrder(request));
    }

    @PutMapping("/assignments/{id}/accept")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeliveryAssignmentDto> acceptOrder(@PathVariable UUID id) {
        return ResponseEntity.ok(deliveryService.acceptOrder(id));
    }

    @PutMapping("/assignments/{id}/pickup")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeliveryAssignmentDto> pickUpOrder(@PathVariable UUID id) {
        return ResponseEntity.ok(deliveryService.pickUpOrder(id));
    }

    @PutMapping("/assignments/{id}/deliver")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeliveryAssignmentDto> deliverOrder(@PathVariable UUID id,
                                                               @RequestParam String otp,
                                                               @Valid @RequestBody DeliveryProofDto proof) {
        return ResponseEntity.ok(deliveryService.deliverOrder(id, otp, proof));
    }

    @PutMapping("/assignments/{id}/cancel")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeliveryAssignmentDto> cancelAssignment(@PathVariable UUID id) {
        return ResponseEntity.ok(deliveryService.cancelAssignment(id));
    }

    @GetMapping("/assignments/order/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeliveryAssignmentDto> getOrderAssignment(@PathVariable UUID orderId) {
        return ResponseEntity.ok(deliveryService.getOrderAssignment(orderId));
    }

    @GetMapping("/partners/{partnerId}/assignments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DeliveryAssignmentDto>> getPartnerAssignments(@PathVariable UUID partnerId) {
        return ResponseEntity.ok(deliveryService.getPartnerAssignments(partnerId));
    }

    @GetMapping("/partners/{partnerId}/earnings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DeliveryEarningDto>> getPartnerEarnings(@PathVariable UUID partnerId) {
        return ResponseEntity.ok(deliveryService.getPartnerEarnings(partnerId));
    }

    @GetMapping("/partners/{partnerId}/performance")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DeliveryPerformanceDto> getPartnerPerformance(@PathVariable UUID partnerId) {
        return ResponseEntity.ok(deliveryService.getPartnerPerformance(partnerId));
    }

    @GetMapping("")
    public String home() { return "Welcome to delivery-service"; }
    @GetMapping("/health")
    public String health() { return "delivery-service is healthy"; }
}
