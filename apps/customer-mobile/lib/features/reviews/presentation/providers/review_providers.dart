// lib/features/reviews/presentation/providers/review_providers.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/reviews/domain/usecase/add_review_usecase.dart';
import 'package:customer_mobile/features/reviews/domain/usecase/delete_review_usecase.dart';
import 'package:customer_mobile/features/reviews/domain/usecase/get_reviews_usecase.dart';
import 'package:customer_mobile/features/reviews/domain/usecase/like_review_usecase.dart';
import 'package:customer_mobile/features/reviews/domain/usecase/report_review_usecase.dart';
import 'package:customer_mobile/features/reviews/domain/usecase/update_review_usecase.dart';
import 'package:customer_mobile/shared/models/review.dart';

// Reviews provider
final reviewsProvider = StateNotifierProvider<ReviewsNotifier, List<Review>>((
  ref,
) {
  return ReviewsNotifier();
});

class ReviewsNotifier extends StateNotifier<List<Review>> {
  ReviewsNotifier() : super([]);

  void setReviews(List<Review> reviews) {
    state = reviews;
  }

  void addReview(Review review) {
    state = [...state, review];
  }

  void updateReview(Review review) {
    final index = state.indexWhere((r) => r.id == review.id);
    if (index != -1) {
      state = [...state.sublist(0, index), review, ...state.sublist(index + 1)];
    }
  }

  void removeReview(String reviewId) {
    state = state.where((review) => review.id != reviewId).toList();
  }
}

// Get reviews use case provider
final getReviewsUseCaseProvider = Provider<GetReviewsUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return GetReviewsUseCase(repository);
});

// Add review use case provider
final addReviewUseCaseProvider = Provider<AddReviewUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return AddReviewUseCase(repository);
});

// Update review use case provider
final updateReviewUseCaseProvider = Provider<UpdateReviewUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return UpdateReviewUseCase(repository);
});

// Delete review use case provider
final deleteReviewUseCaseProvider = Provider<DeleteReviewUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return DeleteReviewUseCase(repository);
});

// Like review use case provider
final likeReviewUseCaseProvider = Provider<LikeReviewUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return LikeReviewUseCase(repository);
});

// Report review use case provider
final reportReviewUseCaseProvider = Provider<ReportReviewUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return ReportReviewUseCase(repository);
});
