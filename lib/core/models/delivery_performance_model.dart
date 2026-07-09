import 'package:freezed_annotation/freezed_annotation.dart';

part 'delivery_performance_model.freezed.dart';
part 'delivery_performance_model.g.dart';

@freeze
class DeliveryPerformance with _$DeliveryPerformance {
  const DeliveryPerformance._();
  factory DeliveryPerformance.fromJson(Map<String, dynamic> json) =>
      _$DeliveryPerformanceFromJson(json);

  final double? rating;
  final double? acceptanceRate; // percentage
  final double? cancellationRate; // percentage
  final double? deliverySuccessRate; // percentage
  final int? totalDeliveries;
  final int? ratingCount;
  final int? rank; // leaderboard position
  final List<DeliveryBadge>? badges;
  final List<DeliveryAchievement>? achievements;
}

@freeze
class DeliveryBadge with _$DeliveryBadge {
  const DeliveryBadge._();
  factory DeliveryBadge.fromJson(Map<String, dynamic> json) =>
      _$DeliveryBadgeFromJson(json);

  final String? id;
  final String? name;
  final String? description;
  final String? icon;
  final String? earnedAt;
}

@freeze
class DeliveryAchievement with _$DeliveryAchievement {
  const DeliveryAchievement._();
  factory DeliveryAchievement.fromJson(Map<String, dynamic> json) =>
      _$DeliveryAchievementFromJson(json);

  final String? id;
  final String? name;
  final String? description;
  final String? icon;
  final int? progress; // current progress
  final int? target; // target to achieve
  final bool? isCompleted;
  final String? earnedAt;
}
