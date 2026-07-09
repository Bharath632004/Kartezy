// lib/features/rewards/data/datasource/rewards_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/rewards.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class RewardsRemoteDataSource {
  final Dio _dio;

  RewardsRemoteDataSource(this._dio);

  Future<RewardPoints> getRewardPoints() async {
    final response = await _dio.get('/rewards/points');
    return RewardPoints.fromJson(response.data);
  }

  Future<List<RewardTransaction>> getRewardHistory() async {
    final response = await _dio.get('/rewards/history');
    final List<dynamic> data = response.data;
    return data.map((e) => RewardTransaction.fromJson(e)).toList();
  }

  Future<RewardPoints> earnRewardPoints({
    required int points,
    required String description,
  }) async {
    final response = await _dio.post(
      '/rewards/earn',
      data: {
        'points': points,
        'description': description,
      },
    );
    return RewardPoints.fromJson(response.data);
  }

  Future<RewardPoints> redeemRewardPoints({
    required int points,
    required String rewardId,
  }) async {
    final response = await _dio.post(
      '/rewards/redeem',
      data: {
        'points': points,
        'reward_id': rewardId,
      },
    );
    return RewardPoints.fromJson(response.data);
  }

  Future<List<RewardLevel>> getRewardLevels() async {
    final response = await _dio.get('/rewards/levels');
    final List<dynamic> data = response.data;
    return data.map((e) => RewardLevel.fromJson(e)).toList();
  }
}

/// Provider for rewards remote data source
final rewardsRemoteDataSourceProvider =
    Provider<RewardsRemoteDataSource>((ref) {
  final dio = ref.read(dioProvider);
  return RewardsRemoteDataSource(dio);
});