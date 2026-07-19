// lib/features/rewards/domain/usecase/get_reward_history_use_case.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/rewards/domain/repository/rewards_repository.dart';
import 'package:customer_mobile/features/rewards/data/repository/rewards_repository_impl.dart';
import 'package:customer_mobile/shared/models/rewards.dart';

class GetRewardHistoryUseCase {
  final RewardsRepository _repository;

  GetRewardHistoryUseCase(this._repository);

  Future<List<RewardTransaction>> call() => _repository.getRewardHistory();
}

/// Provider for get reward history use case
final getRewardHistoryUseCaseProvider = Provider<GetRewardHistoryUseCase>((
  ref,
) {
  final repository = ref.read(rewardsRepositoryProvider);
  return GetRewardHistoryUseCase(repository);
});
