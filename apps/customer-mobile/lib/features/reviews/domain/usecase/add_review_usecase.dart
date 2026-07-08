// lib/features/reviews/domain/usecase/add_review_usecase.dart
import 'package:customer_mobile/features/reviews/domain/repository/review_repository.dart';
import 'package:customer_mobile/shared/models/review.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AddReviewUseCase {
  final ReviewRepository _repository;

  AddReviewUseCase(this._repository);

  Future<void> call(String productId, Review review) {
    return _repository.addReview(productId, review);
  }
}

/// Provider for add review use case
final addReviewUseCaseProvider = Provider<AddReviewUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return AddReviewUseCase(repository);
});
