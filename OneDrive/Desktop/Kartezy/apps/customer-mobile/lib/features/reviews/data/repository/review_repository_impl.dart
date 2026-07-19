// lib/features/reviews/data/repository/review_repository_impl.dart
import 'package:customer_mobile/features/reviews/data/datasource/review_remote_data_source.dart';
import 'package:customer_mobile/features/reviews/domain/repository/review_repository.dart';
import 'package:customer_mobile/shared/models/review.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ReviewRepositoryImpl implements ReviewRepository {
  final ReviewRemoteDataSource _remoteDataSource;

  ReviewRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<Review>> getReviews(String productId) async {
    return await _remoteDataSource.getReviews(productId);
  }

  @override
  Future<void> addReview(String productId, Review review) async {
    await _remoteDataSource.addReview(productId, review);
  }

  @override
  Future<void> updateReview(String reviewId, Review review) async {
    await _remoteDataSource.updateReview(reviewId, review);
  }

  @override
  Future<void> deleteReview(String reviewId) async {
    await _remoteDataSource.deleteReview(reviewId);
  }

  @override
  Future<void> likeReview(String reviewId) async {
    await _remoteDataSource.likeReview(reviewId);
  }

  @override
  Future<void> reportReview(String reviewId, String reason) async {
    await _remoteDataSource.reportReview(reviewId, reason);
  }
}

/// Provider for review repository
final reviewRepositoryProvider = Provider<ReviewRepository>((ref) {
  final remoteDataSource = ref.read(reviewRemoteDataSourceProvider);
  return ReviewRepositoryImpl(remoteDataSource);
});
