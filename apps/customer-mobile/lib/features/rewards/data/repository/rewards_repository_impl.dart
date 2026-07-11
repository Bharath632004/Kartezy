// lib/features/rewards/data/repository/rewards_repository_impl.dart
import 'package:customer_mobile/features/rewards/data/datasource/rewards_remote_data_source.dart';
import 'package:customer_mobile/features/rewards/domain/repository/rewards_repository.dart';
import 'package:customer_mobile/shared/models/rewards.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class RewardsRepositoryImpl implements RewardsRepository {
  final RewardsRemoteDataSource _remoteDataSource;

  RewardsRepositoryImpl(this._remoteDataSource);

  @override
  Future<RewardPoints> getRewardPoints() => _remoteDataSource.getRewardPoints();

  @override
  Future<List<RewardTransaction>> getRewardHistory() =>
      _remoteDataSource.getRewardHistory();

  @override
  Future<RewardPoints> earnRewardPoints({
    required int points,
    required String description,
  }) =>
      _remoteDataSource.earnRewardPoints(
        points: points,
        description: description,
      );

  @override
  Future<RewardPoints> redeemRewardPoints({
    required int points,
    required String rewardId,
  }) =>
      _remoteDataSource.redeemRewardPoints(
        points: points,
        rewardId: rewardId,
      );

  @override
  Future<List<RewardLevel>> getRewardLevels() =>
      _remoteDataSource.getRewardLevels();
}

/// Provider for rewards repository
final rewardsRepositoryProvider = Provider<RewardsRepository>((ref) {
  final remoteDataSource = ref.read(rewardsRemoteDataSourceProvider);
  return RewardsRepositoryImpl(remoteDataSource);
});