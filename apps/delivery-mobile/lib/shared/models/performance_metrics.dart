import 'package:freezed_annotation/freezed_annotation.dart';

part 'performance_metrics.freezed.dart';
part 'performance_metrics.g.dart';

@freezed
class PerformanceMetrics with _$PerformanceMetrics {
  const factory PerformanceMetrics({
    required int totalOrdersDelivered,
    required int totalOrdersAssigned,
    required int totalOrdersCancelled,
    required double acceptanceRate,
    required double completionRate,
    required double onTimeRate,
    required double customerRating,
    required double merchantRating,
    required double averageDeliveryTimeMinutes,
    required int currentStreak,
    required int longestStreak,
    required int rank,
    required int totalPartners,
    List<LeaderboardEntry>? leaderboard,
    List<String>? badges,
    int? performanceScore,
    DateTime? periodStart,
    DateTime? periodEnd,
  }) = _PerformanceMetrics;

  factory PerformanceMetrics.fromJson(Map<String, dynamic> json) =>
      _$PerformanceMetricsFromJson(json);
}

@freezed
class LeaderboardEntry with _$LeaderboardEntry {
  const factory LeaderboardEntry({
    required int rank,
    required String partnerId,
    required String partnerName,
    String? photoUrl,
    required int ordersDelivered,
    required double rating,
    required double earnings,
  }) = _LeaderboardEntry;

  factory LeaderboardEntry.fromJson(Map<String, dynamic> json) =>
      _$LeaderboardEntryFromJson(json);
}
