// lib/features/reviews/domain/usecase/delete_review_usecase.dart
import 'package:customer_mobile/features/reviews/domain/repository/review_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/reviews/data/repository/review_repository_impl.dart';

class DeleteReviewUseCase {
  final ReviewRepository _repository;

  DeleteReviewUseCase(this._repository);

  Future<void> call(String reviewId) {
    return _repository.deleteReview(reviewId);
  }
}

/// Provider for delete review use case
final deleteReviewUseCaseProvider = Provider<DeleteReviewUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return DeleteReviewUseCase(repository);
});
