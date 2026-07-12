// lib/features/rewards/domain/repository/rewards_repository.dart
import 'package:customer_mobile/shared/models/rewards.dart';

abstract class RewardsRepository {
  Future<RewardPoints> getRewardPoints();
  Future<List<RewardTransaction>> getRewardHistory();
  Future<RewardPoints> earnRewardPoints({
    required int points,
    required String description,
  });
  Future<RewardPoints> redeemRewardPoints({
    required int points,
    required String rewardId,
  });
  Future<List<RewardLevel>> getRewardLevels();
}
