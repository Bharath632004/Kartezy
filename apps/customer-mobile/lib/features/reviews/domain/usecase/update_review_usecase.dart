// lib/features/reviews/domain/usecase/update_review_usecase.dart
import 'package:customer_mobile/features/reviews/domain/repository/review_repository.dart';
import 'package:customer_mobile/shared/models/review.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class UpdateReviewUseCase {
  final ReviewRepository _repository;

  UpdateReviewUseCase(this._repository);

  Future<void> call(String reviewId, Review review) {
    return _repository.updateReview(reviewId, review);
  }
}

/// Provider for update review use case
final updateReviewUseCaseProvider = Provider<UpdateReviewUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return UpdateReviewUseCase(repository);
});