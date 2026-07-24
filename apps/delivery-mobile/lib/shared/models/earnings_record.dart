import 'package:freezed_annotation/freezed_annotation.dart';

part 'earnings_record.freezed.dart';
part 'earnings_record.g.dart';

/// Type of earning.
enum EarningType {
  deliveryFee,
  tip,
  bonus,
  incentive,
  penalty,
  referral,
  adjustment,
}

/// Represents a single earnings transaction.
@freezed
class EarningsRecord with _$EarningsRecord {
  const factory EarningsRecord({
    required String id,
    required String partnerId,
    required String? orderId,
    required EarningType type,
    required double amount,
    required String description,
    required DateTime createdAt,
    required bool isCredited,
  }) = _EarningsRecord;

  factory EarningsRecord.fromJson(Map<String, dynamic> json) =>
      _$EarningsRecordFromJson(json);
}

/// Summary of earnings for a period.
@freezed
class EarningsSummary with _$EarningsSummary {
  const factory EarningsSummary({
    required double totalEarnings,
    required double deliveryFees,
    required double tips,
    required double bonuses,
    required double incentives,
    required double penalties,
    required int totalOrders,
    required double averagePerOrder,
    required DateTime periodStart,
    required DateTime periodEnd,
  }) = _EarningsSummary;

  factory EarningsSummary.fromJson(Map<String, dynamic> json) =>
      _$EarningsSummaryFromJson(json);
}
