package com.kartezy.reviewservice.service;

import com.kartezy.reviewservice.dto.CreateReviewRequest;
import com.kartezy.reviewservice.dto.ReviewDto;
import com.kartezy.reviewservice.entity.Review;
import com.kartezy.reviewservice.repository.ReviewRepository;
import com.kartezy.shared.exception.BadRequestException;
import com.kartezy.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Transactional
    public ReviewDto createReview(CreateReviewRequest request) {
        if (reviewRepository.existsByUserIdAndProductIdAndOrderId(request.getUserId(), request.getProductId(), request.getOrderId())) {
            throw new BadRequestException("You have already reviewed this product for this order");
        }

        Review review = Review.builder()
            .productId(request.getProductId())
            .userId(request.getUserId())
            .orderId(request.getOrderId())
            .rating(request.getRating())
            .title(request.getTitle())
            .comment(request.getComment())
            .imageUrls(request.getImageUrls())
            .status("PENDING")
            .verified(false)
            .build();
        review = reviewRepository.save(review);
        log.info("Review created: id={} productId={} userId={} rating={}", review.getId(), review.getProductId(), review.getUserId(), review.getRating());
        return toDto(review);
    }

    public List<ReviewDto> getProductReviews(UUID productId) {
        return reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, "APPROVED")
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ReviewDto> getUserReviews(UUID userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto moderateReview(UUID reviewId, String status, String moderatedBy) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));
        review.setStatus(status);
        review.setModeratedAt(LocalDateTime.now());
        review.setModeratedBy(moderatedBy);
        if ("APPROVED".equals(status)) {
            review.setVerified(true);
        }
        reviewRepository.save(review);
        log.info("Review {} moderated: status={} by={}", reviewId, status, moderatedBy);
        return toDto(review);
    }

    private ReviewDto toDto(Review review) {
        return ReviewDto.builder()
            .id(review.getId()).productId(review.getProductId())
            .userId(review.getUserId()).orderId(review.getOrderId())
            .rating(review.getRating()).title(review.getTitle())
            .comment(review.getComment()).imageUrls(review.getImageUrls())
            .status(review.getStatus()).verified(review.isVerified())
            .helpfulCount(review.getHelpfulCount())
            .createdAt(review.getCreatedAt()).updatedAt(review.getUpdatedAt()).build();
    }
}
