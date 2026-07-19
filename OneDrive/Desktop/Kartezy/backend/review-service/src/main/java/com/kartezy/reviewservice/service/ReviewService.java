package com.kartezy.reviewservice.service;

import com.kartezy.reviewservice.dto.*;
import com.kartezy.reviewservice.entity.*;
import com.kartezy.reviewservice.entity.Review.ReviewStatus;
import com.kartezy.reviewservice.entity.Review.TargetType;
import com.kartezy.reviewservice.repository.*;
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
    private final RatingSummaryRepository ratingSummaryRepository;

    @Transactional
    public ReviewDto createReview(ReviewRequestDto request) {
        TargetType targetType;
        try {
            targetType = TargetType.valueOf(request.getTargetType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid target type: " + request.getTargetType());
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        var existing = reviewRepository.findByUserIdAndTargetTypeAndTargetId(
            request.getUserId(), targetType, request.getTargetId());
        if (existing.isPresent()) {
            throw new BadRequestException("You have already reviewed this item");
        }

        Review review = Review.builder()
            .userId(request.getUserId())
            .targetType(targetType)
            .targetId(request.getTargetId())
            .rating(request.getRating())
            .title(request.getTitle())
            .comment(request.getComment())
            .status(ReviewStatus.PENDING)
            .imageUrls(request.getImageUrls() != null ? request.getImageUrls() : new java.util.HashSet<>())
            .videoUrl(request.getVideoUrl())
            .orderId(request.getOrderId())
            .isHelpful(false)
            .helpfulCount(0L)
            .unhelpfulCount(0L)
            .verifiedPurchase(false)
            .build();

        review = reviewRepository.save(review);
        updateRatingSummary(targetType, request.getTargetId());
        log.info("Review created: {} for target: {} {}", review.getId(), targetType, request.getTargetId());
        return toDto(review);
    }

    @Transactional
    public ReviewDto approveReview(UUID reviewId, ReviewModerationDto moderation) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setStatus(ReviewStatus.APPROVED);
        review.setModeratedAt(LocalDateTime.now());
        review.setModeratedBy(moderation.getModeratedBy());
        review.setAdminNote(moderation.getAdminNote());
        review = reviewRepository.save(review);

        updateRatingSummary(review.getTargetType(), review.getTargetId());
        log.info("Review {} approved", reviewId);
        return toDto(review);
    }

    @Transactional
    public ReviewDto rejectReview(UUID reviewId, ReviewModerationDto moderation) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setStatus(ReviewStatus.REJECTED);
        review.setModeratedAt(LocalDateTime.now());
        review.setModeratedBy(moderation.getModeratedBy());
        review.setAdminNote(moderation.getAdminNote());
        review = reviewRepository.save(review);
        log.info("Review {} rejected", reviewId);
        return toDto(review);
    }

    @Transactional
    public ReviewDto addMerchantResponse(UUID reviewId, MerchantResponseDto response) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setMerchantResponse(response.getMerchantResponse());
        review.setMerchantRespondedAt(LocalDateTime.now());
        review = reviewRepository.save(review);
        return toDto(review);
    }

    @Transactional
    public ReviewDto markHelpful(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        review = reviewRepository.save(review);
        return toDto(review);
    }

    @Transactional
    public ReviewDto markUnhelpful(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setUnhelpfulCount(review.getUnhelpfulCount() + 1);
        review = reviewRepository.save(review);
        return toDto(review);
    }

    @Transactional
    public void deleteReview(UUID reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        reviewRepository.delete(review);
        updateRatingSummary(review.getTargetType(), review.getTargetId());
        log.info("Review {} deleted", reviewId);
    }

    public ReviewDto getReview(UUID id) {
        return reviewRepository.findById(id)
            .map(this::toDto)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
    }

    public List<ReviewDto> getTargetReviews(String targetTypeStr, UUID targetId) {
        TargetType targetType;
        try {
            targetType = TargetType.valueOf(targetTypeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid target type");
        }
        return reviewRepository.findByTargetTypeAndTargetIdOrderByCreatedAtDesc(targetType, targetId)
            .stream().filter(r -> r.getStatus() == ReviewStatus.APPROVED)
            .map(this::toDto).collect(Collectors.toList());
    }

    public List<ReviewDto> getUserReviews(UUID userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ReviewDto> getPendingReviews() {
        return reviewRepository.findByStatus(ReviewStatus.PENDING)
            .stream().map(this::toDto).collect(Collectors.toList());
    }

    public RatingSummaryDto getRatingSummary(String targetTypeStr, UUID targetId) {
        TargetType targetType;
        try {
            targetType = TargetType.valueOf(targetTypeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid target type");
        }
        return ratingSummaryRepository.findByTargetTypeAndTargetId(targetType, targetId)
            .map(this::toSummaryDto)
            .orElse(RatingSummaryDto.builder()
                .targetType(targetTypeStr).targetId(targetId)
                .averageRating(0.0).totalReviews(0L).build());
    }

    private void updateRatingSummary(TargetType targetType, UUID targetId) {
        List<Review> approved = reviewRepository
            .findByTargetTypeAndTargetIdOrderByCreatedAtDesc(targetType, targetId)
            .stream().filter(r -> r.getStatus() == ReviewStatus.APPROVED)
            .collect(Collectors.toList());

        long total = approved.size();
        if (total == 0) return;

        double avg = approved.stream().mapToInt(Review::getRating).average().orElse(0.0);
        long fiveStar = approved.stream().filter(r -> r.getRating() == 5).count();
        long fourStar = approved.stream().filter(r -> r.getRating() == 4).count();
        long threeStar = approved.stream().filter(r -> r.getRating() == 3).count();
        long twoStar = approved.stream().filter(r -> r.getRating() == 2).count();
        long oneStar = approved.stream().filter(r -> r.getRating() == 1).count();

        RatingSummary summary = ratingSummaryRepository
            .findByTargetTypeAndTargetId(targetType, targetId)
            .orElse(RatingSummary.builder()
                .targetType(targetType).targetId(targetId).build());

        summary.setAverageRating(Math.round(avg * 10.0) / 10.0);
        summary.setTotalReviews(total);
        summary.setFiveStarCount(fiveStar);
        summary.setFourStarCount(fourStar);
        summary.setThreeStarCount(threeStar);
        summary.setTwoStarCount(twoStar);
        summary.setOneStarCount(oneStar);
        summary.setLastUpdated(LocalDateTime.now());

        ratingSummaryRepository.save(summary);
    }

    private ReviewDto toDto(Review r) {
        return ReviewDto.builder()
            .id(r.getId()).userId(r.getUserId())
            .targetType(r.getTargetType().name()).targetId(r.getTargetId())
            .rating(r.getRating()).title(r.getTitle()).comment(r.getComment())
            .merchantResponse(r.getMerchantResponse())
            .merchantRespondedAt(r.getMerchantRespondedAt())
            .status(r.getStatus().name()).verifiedPurchase(r.isVerifiedPurchase())
            .isHelpful(r.isHelpful()).helpfulCount(r.getHelpfulCount())
            .unhelpfulCount(r.getUnhelpfulCount()).imageUrls(r.getImageUrls())
            .videoUrl(r.getVideoUrl()).orderId(r.getOrderId())
            .createdAt(r.getCreatedAt()).updatedAt(r.getUpdatedAt()).build();
    }

    private RatingSummaryDto toSummaryDto(RatingSummary s) {
        return RatingSummaryDto.builder()
            .id(s.getId()).targetType(s.getTargetType().name()).targetId(s.getTargetId())
            .averageRating(s.getAverageRating()).totalReviews(s.getTotalReviews())
            .fiveStarCount(s.getFiveStarCount()).fourStarCount(s.getFourStarCount())
            .threeStarCount(s.getThreeStarCount()).twoStarCount(s.getTwoStarCount())
            .oneStarCount(s.getOneStarCount()).lastUpdated(s.getLastUpdated()).build();
    }
}
