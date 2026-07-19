// lib/features/reviews/domain/usecase/report_review_usecase.dart
import 'package:customer_mobile/features/reviews/domain/repository/review_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/reviews/data/repository/review_repository_impl.dart';

class ReportReviewUseCase {
  final ReviewRepository _repository;

  ReportReviewUseCase(this._repository);

  Future<void> call(String reviewId, String reason) {
    return _repository.reportReview(reviewId, reason);
  }
}

/// Provider for report review use case
final reportReviewUseCaseProvider = Provider<ReportReviewUseCase>((ref) {
  final repository = ref.read(reviewRepositoryProvider);
  return ReportReviewUseCase(repository);
});
