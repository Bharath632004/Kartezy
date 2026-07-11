// lib/features/rewards/domain/usecase/redeem_reward_points_use_case.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/rewards/domain/repository/rewards_repository.dart';
import 'package:customer_mobile/features/rewards/data/repository/rewards_repository_impl.dart';
import 'package:customer_mobile/shared/models/rewards.dart';

class RedeemRewardPointsUseCase {
  final RewardsRepository _repository;

  RedeemRewardPointsUseCase(this._repository);

  Future<RewardPoints> call({
    required int points,
    required String rewardId,
  }) =>
      _repository.redeemRewardPoints(
        points: points,
        rewardId: rewardId,
      );
}

/// Provider for redeem reward points use case
final redeemRewardPointsUseCaseProvider =
    Provider<RedeemRewardPointsUseCase>((ref) {
  final repository = ref.read(rewardsRepositoryProvider);
  return RedeemRewardPointsUseCase(repository);
});