package com.kartezy.reviewservice.controller;

import com.kartezy.reviewservice.dto.CreateReviewRequest;
import com.kartezy.reviewservice.dto.ReviewDto;
import com.kartezy.reviewservice.service.ReviewService;
import com.kartezy.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ReviewDto>> createReview(@Valid @RequestBody CreateReviewRequest request) {
        ReviewDto review = reviewService.createReview(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(review, "Review submitted for moderation"));
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getProductReviews(@PathVariable UUID productId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getProductReviews(productId)));
    }

    @GetMapping("/users/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getUserReviews(@PathVariable UUID userId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getUserReviews(userId)));
    }

    @PutMapping("/{reviewId}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReviewDto>> moderateReview(
            @PathVariable UUID reviewId,
            @RequestParam String status,
            @RequestParam String moderatedBy) {
        ReviewDto review = reviewService.moderateReview(reviewId, status, moderatedBy);
        return ResponseEntity.ok(ApiResponse.success(review, "Review moderated"));
    }
}
