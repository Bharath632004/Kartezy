// lib/shared/models/review.dart
import 'package:freezed_annotation/freezed_annotation.dart';
part 'review.freezed.dart';
part 'review.g.dart';

@freezed
class Review with _$Review {
  const factory Review({
    required String id,
    required String productId,
    required String userId,
    required String userName,
    required double rating, // 1-5 stars
    required String title,
    required String comment,
    required DateTime createdAt,
    required bool isVerifiedPurchase,
    List<String>? images, // URLs to review images
    List<String>? videos, // URLs to review videos
    int? helpfulCount,
    int? notHelpfulCount,
  }) = _Review;

  factory Review.fromJson(Map<String, dynamic> json) =>
      _$ReviewFromJson(json);

  Map<String, dynamic> toJson() => _$ReviewToJson(this);
}