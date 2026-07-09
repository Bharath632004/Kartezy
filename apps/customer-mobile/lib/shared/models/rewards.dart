// lib/shared/models/rewards.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'rewards.freezed.dart';
part 'rewards.g.dart';

@freezed
class RewardPoints with _$RewardPoints {
  const factory RewardPoints({
    required int points,
    DateTime? expiresAt,
  }) = _RewardPoints;

  factory RewardPoints.fromJson(Map<String, dynamic> json) => _$RewardPointsFromJson(json);
}

@freezed
class RewardTransaction with _$RewardTransaction {
  const factory RewardTransaction({
    required String id,
    required String type, // earn, redeem, adjustment
    required int points,
    required String description,
    required DateTime timestamp,
  }) = _RewardTransaction;

  factory RewardTransaction.fromJson(Map<String, dynamic> json) => _$RewardTransactionFromJson(json);
}

@freezed
class RewardLevel with _$RewardLevel {
  const factory RewardLevel({
    required String level,
    required int minPoints,
    required List<String> benefits,
  }) = _RewardLevel;

  factory RewardLevel.fromJson(Map<String, dynamic> json) => _$RewardLevelFromJson(json);
}