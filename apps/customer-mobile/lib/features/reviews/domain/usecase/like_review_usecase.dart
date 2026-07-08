// lib/features/reviews/domain/usecase/like_review_usecase.dart
import 'package:customer_mobile/features/reviews/domain/repository/review_repository.dart';
import 'package:customer_mobile/shared/models/review.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class LikeReviewUseCase {
  final ReviewRepository _repository;

  LikeReviewUseCase(this._repository);

  Future<void> call(String reviewId) {
    return _repository.likeReview(reviewId);
  }
}

/// Provider for like review use case
final likeReviewUseCaseProvider = Provider<LikeReviewUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return LikeReviewUseCase(repository);
});
