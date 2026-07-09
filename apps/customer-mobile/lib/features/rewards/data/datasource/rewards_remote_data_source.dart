// lib/features/rewards/data/datasource/rewards/data/data/datasource/rewards_remote_data_source.dart
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/shared/models/reward.dart';

abstract class RewardsRemoteDataSource {
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

class RewardsRemoteDataSourceImpl implements RewardsRemoteDataSource {
  final Ref _ref;

  RewardsRemoteDataSourceImpl(this._ref);

  @override
  Future<RewardPoints> getRewardPoints() async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.get('/rewards/points');
    return RewardPoints.fromJson(response.data);
  }

  @override
  Future<List<RewardTransaction>> getRewardHistory() async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.get('/rewards/history');
    final List<dynamic> data = response.data;
    return data.map((e) => RewardTransaction.fromJson(e)).toList();
  }

  @override
  Future<RewardPoints> earnRewardPoints({
    required int points,
    required String description,
  }) async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.post(
      '/rewards/earn',
      data: {
        'points': points,
        'description': description,
      },
    );
    return RewardPoints.fromJson(response.data);
  }

  @override
  Future<RewardPoints> redeemRewardPoints({
    required int points,
    required String rewardId,
  }) async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.post(
      '/rewards/redeem',
      data: {
        'points': points,
        'reward_id': rewardId,
      },
    );
    return RewardPoints.fromJson(response.data);
  }

  @override
  Future<List<RewardLevel>> getRewardLevels() async {
    final dioClient = _ref.read(dioProvider);
    final response = await dioClient.get('/rewards/levels');
    final List<dynamic> data = response.data;
    return data.map((e) => RewardLevel.fromJson(e)).toList();
  }
}

/// Provider for rewards remote data source
final rewardsRemoteDataSourceProvider =
    Provider<RewardsRemoteDataSource>((ref) {
  return RewardsRemoteDataSourceImpl(ref);
});
