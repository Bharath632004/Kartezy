package com.kartezy.reviewservice;

import com.kartezy.reviewservice.dto.*;
import com.kartezy.reviewservice.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewServiceController {
    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewDto> createReview(@Valid @RequestBody ReviewRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewDto> getReview(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.getReview(id));
    }

    @GetMapping("/target/{targetType}/{targetId}")
    public ResponseEntity<List<ReviewDto>> getTargetReviews(@PathVariable String targetType,
                                                             @PathVariable UUID targetId) {
        return ResponseEntity.ok(reviewService.getTargetReviews(targetType, targetId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReviewDto>> getUserReviews(@PathVariable UUID userId) {
        return ResponseEntity.ok(reviewService.getUserReviews(userId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewDto>> getPendingReviews() {
        return ResponseEntity.ok(reviewService.getPendingReviews());
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewDto> approveReview(@PathVariable UUID id,
                                                    @Valid @RequestBody ReviewModerationDto moderation) {
        return ResponseEntity.ok(reviewService.approveReview(id, moderation));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewDto> rejectReview(@PathVariable UUID id,
                                                   @Valid @RequestBody ReviewModerationDto moderation) {
        return ResponseEntity.ok(reviewService.rejectReview(id, moderation));
    }

    @PutMapping("/{id}/merchant-response")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewDto> addMerchantResponse(@PathVariable UUID id,
                                                          @Valid @RequestBody MerchantResponseDto response) {
        return ResponseEntity.ok(reviewService.addMerchantResponse(id, response));
    }

    @PutMapping("/{id}/helpful")
    public ResponseEntity<ReviewDto> markHelpful(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.markHelpful(id));
    }

    @PutMapping("/{id}/unhelpful")
    public ResponseEntity<ReviewDto> markUnhelpful(@PathVariable UUID id) {
        return ResponseEntity.ok(reviewService.markUnhelpful(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable UUID id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary/{targetType}/{targetId}")
    public ResponseEntity<RatingSummaryDto> getRatingSummary(@PathVariable String targetType,
                                                              @PathVariable UUID targetId) {
        return ResponseEntity.ok(reviewService.getRatingSummary(targetType, targetId));
    }

    @GetMapping("")
    public String home() { return "Welcome to review-service"; }

    @GetMapping("/health")
    public String health() { return "review-service is healthy"; }
}
