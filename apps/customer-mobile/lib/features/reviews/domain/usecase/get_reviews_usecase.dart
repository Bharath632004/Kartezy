// lib/features/reviews/domain/usecase/get_reviews_usecase.dart
import 'package:customer_mobile/features/reviews/domain/repository/review_repository.dart';
import 'package:customer_mobile/shared/models/review.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/reviews/data/repository/review_repository_impl.dart';

class GetReviewsUseCase {
  final ReviewRepository _repository;

  GetReviewsUseCase(this._repository);

  Future<List<Review>> call(String productId) {
    return _repository.getReviews(productId);
  }
}

/// Provider for getting reviews (returns a Future<List<Review>>)
final getReviewsProvider = FutureProvider.family<List<Review>, String>((
  ref,
  String productId,
) {
  final repository = ref.read(reviewRepositoryProvider);
  final useCase = GetReviewsUseCase(repository);
  return useCase.call(productId);
});

// Keep the use case provider if needed elsewhere
final getReviewsUseCaseProvider = Provider<GetReviewsUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return GetReviewsUseCase(repository);
});
