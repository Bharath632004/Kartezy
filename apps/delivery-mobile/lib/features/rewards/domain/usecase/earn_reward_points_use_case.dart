// lib/features/rewards/domain/usecase/earn_reward_points_use_case.dart
import 'package:customer_mobile/features/rewards/domain/repository/rewards_repository.dart';
import 'package:customer_mobile/shared/models/rewards.dart';

class EarnRewardPointsUseCase {
  final RewardsRepository _repository;

  EarnRewardPointsUseCase(this._repository);

  Future<RewardPoints> call({
    required int points,
    required String description,
  }) =>
      _repository.earnRewardPoints(
        points: points,
        description: description,
      );
}

/// Provider for earn reward points use case
final earnRewardPointsUseCaseProvider = Provider<EarnRewardPointsUseCase>((ref) {
  final repository = ref.read(rewardsRepositoryProvider);
  return EarnRewardPointsUseCase(repository);
});