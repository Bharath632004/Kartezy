// lib/features/rewards/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/rewards/domain/usecase/get_reward_points_use_case.dart';
import 'package:customer_mobile/features/rewards/domain/usecase/get_reward_history_use_case.dart';
import 'package:customer_mobile/features/rewards/domain/usecase/earn_reward_points_use_case.dart';
import 'package:customer_mobile/features/rewards/domain/usecase/redeem_reward_points_use_case.dart';
import 'package:customer_mobile/features/rewards/domain/usecase/get_reward_levels_use_case.dart';
import 'package:customer_mobile/shared/models/rewards.dart';

class RewardsState {
  final RewardPoints? points;
  final List<RewardTransaction>? history;
  final List<RewardLevel>? levels;
  final bool isLoading;
  final String? error;

  RewardsState({
    this.points,
    this.history,
    this.levels,
    this.isLoading = false,
    this.error,
  });

  RewardsState copyWith({
    RewardPoints? points,
    List<RewardTransaction>? history,
    List<RewardLevel>? levels,
    bool? isLoading,
    String? error,
  }) {
    return RewardsState(
      points: points ?? this.points,
      history: history ?? this.history,
      levels: levels ?? this.levels,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class RewardsNotifier extends StateNotifier<RewardsState> {
  final GetRewardPointsUseCase _getRewardPoints;
  final GetRewardHistoryUseCase _getRewardHistory;
  final EarnRewardPointsUseCase _earnRewardPoints;
  final RedeemRewardPointsUseCase _redeemRewardPoints;
  final GetRewardLevelsUseCase _getRewardLevels;

  RewardsNotifier(
    this._getRewardPoints,
    this._getRewardHistory,
    this._earnRewardPoints,
    this._redeemRewardPoints,
    this._getRewardLevels,
  ) : super(RewardsState());

  Future<void> loadRewardPoints() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final points = await _getRewardPoints();
      state = state.copyWith(points: points, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> loadRewardHistory() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final history = await _getRewardHistory();
      state = state.copyWith(history: history, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> loadRewardLevels() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final levels = await _getRewardLevels();
      state = state.copyWith(levels: levels, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> earnPoints({
    required int points,
    required String description,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final earnedPoints = await _earnRewardPoints(
        points: points,
        description: description,
      );
      state = state.copyWith(points: earnedPoints, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> redeemPoints({
    required int points,
    required String rewardId,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final redeemedPoints = await _redeemRewardPoints(
        points: points,
        rewardId: rewardId,
      );
      state = state.copyWith(points: redeemedPoints, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }
}

/// Provider for rewards notifier
final rewardsProvider = StateNotifierProvider<RewardsNotifier, RewardsState>((ref) {
  return RewardsNotifier(
    ref.read(getRewardPointsUseCaseProvider),
    ref.read(getRewardHistoryUseCaseProvider),
    ref.read(earnRewardPointsUseCaseProvider),
    ref.read(redeemRewardPointsUseCaseProvider),
    ref.read(getRewardLevelsUseCaseProvider),
  );
});
