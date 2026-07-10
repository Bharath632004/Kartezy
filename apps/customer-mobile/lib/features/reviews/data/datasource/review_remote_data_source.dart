// lib/features/reviews/data/datasource/review_remote_data_source.dart
import 'package:customer_mobile/shared/models/review.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract class ReviewRemoteDataSource {
  Future<List<Review>> getReviews(String productId);
  Future<void> addReview(String productId, Review review);
  Future<void> updateReview(String reviewId, Review review);
  Future<void> deleteReview(String reviewId);
  Future<void> likeReview(String reviewId);
  Future<void> reportReview(String reviewId, String reason);
}

class ReviewRemoteDataSourceImpl implements ReviewRemoteDataSource {
  final Ref _ref;

  ReviewRemoteDataSourceImpl(this._ref);

  @override
  Future<List<Review>> getReviews(String productId) async {
    final dio = _ref.read(dioProvider);
    final response = await dio.get('/reviews/product/$productId');
    final List<dynamic> data = response.data['reviews'] ?? [];
    return data.map((json) => Review.fromJson(json)).toList();
  }

  @override
  Future<void> addReview(String productId, Review review) async {
    final dio = _ref.read(dioProvider);
    await dio.post(
      '/reviews',
      data: {'productId': productId, ...review.toJson()},
    );
  }

  @override
  Future<void> updateReview(String reviewId, Review review) async {
    final dio = _ref.read(dioProvider);
    await dio.put('/reviews/$reviewId', data: review.toJson());
  }

  @override
  Future<void> deleteReview(String reviewId) async {
    final dio = _ref.read(dioProvider);
    await dio.delete('/reviews/$reviewId');
  }

  @override
  Future<void> likeReview(String reviewId) async {
    final dio = _ref.read(dioProvider);
    await dio.post('/reviews/$reviewId/like');
  }

  @override
  Future<void> reportReview(String reviewId, String reason) async {
    final dio = _ref.read(dioProvider);
    await dio.post('/reviews/$reviewId/report', data: {'reason': reason});
  }
}

/// Provider for review remote data source
final reviewRemoteDataSourceProvider = Provider<ReviewRemoteDataSource>((ref) {
  return ReviewRemoteDataSourceImpl(ref);
});