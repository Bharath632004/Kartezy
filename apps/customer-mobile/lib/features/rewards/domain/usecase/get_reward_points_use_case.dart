// lib/features/rewards/domain/usecase/get_reward_points_use_case.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/rewards/domain/repository/rewards_repository.dart';
import 'package:customer_mobile/features/rewards/data/repository/rewards_repository_impl.dart';
import 'package:customer_mobile/shared/models/rewards.dart';

class GetRewardPointsUseCase {
  final RewardsRepository _repository;

  GetRewardPointsUseCase(this._repository);

  Future<RewardPoints> call() => _repository.getRewardPoints();
}

/// Provider for get reward points use case
final getRewardPointsUseCaseProvider = Provider<GetRewardPointsUseCase>((ref) {
  final repository = ref.read(rewardsRepositoryProvider);
  return GetRewardPointsUseCase(repository);
});
