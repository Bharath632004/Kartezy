// lib/features/reviews/domain/repository/review_repository.dart
import 'package:customer_mobile/shared/models/review.dart';

abstract class ReviewRepository {
  Future<List<Review>> getReviews(String productId);
  Future<void> addReview(String productId, Review review);
  Future<void> updateReview(String reviewId, Review review);
  Future<void> deleteReview(String reviewId);
  Future<void> likeReview(String reviewId);
  Future<void> reportReview(String reviewId, String reason);
}