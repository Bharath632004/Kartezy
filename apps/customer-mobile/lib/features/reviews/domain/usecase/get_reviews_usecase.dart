// lib/features/reviews/domain/usecase/get_reviews_usecase.dart
import 'package:customer_mobile/features/reviews/domain/repository/review_repository.dart';
import 'package:customer_mobile/shared/models/review.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetReviewsUseCase {
  final ReviewRepository _repository;

  GetReviewsUseCase(this._repository);

  Future<List<Review>> call(String productId) {
    return _repository.getReviews(productId);
  }
}

/// Provider for get reviews use case
final getReviewsUseCaseProvider = Provider<GetReviewsUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return GetReviewsUseCase(repository);
});
