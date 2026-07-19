// lib/features/rewards/domain/usecase/get_reward_levels_use_case.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/rewards/domain/repository/rewards_repository.dart';
import 'package:customer_mobile/features/rewards/data/repository/rewards_repository_impl.dart';
import 'package:customer_mobile/shared/models/rewards.dart';

class GetRewardLevelsUseCase {
  final RewardsRepository _repository;

  GetRewardLevelsUseCase(this._repository);

  Future<List<RewardLevel>> call() => _repository.getRewardLevels();
}

/// Provider for get reward levels use case
final getRewardLevelsUseCaseProvider = Provider<GetRewardLevelsUseCase>((ref) {
  final repository = ref.read(rewardsRepositoryProvider);
  return GetRewardLevelsUseCase(repository);
});
