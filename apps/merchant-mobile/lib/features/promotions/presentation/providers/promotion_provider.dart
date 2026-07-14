import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/promotion_service.dart';

// Promotion State
class PromotionState {
  final bool isLoading;
  final String? error;
  final List<dynamic> promotions;
  final bool hasMore;

  PromotionState({
    required this.isLoading,
    this.error,
    required this.promotions,
    required this.hasMore,
  });

  factory PromotionState.initial() =>
      PromotionState(isLoading: false, promotions: [], hasMore: false);

  PromotionState copyWith({
    bool? isLoading,
    String? error,
    List<dynamic>? promotions,
    bool? hasMore,
  }) {
    return PromotionState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      promotions: promotions ?? this.promotions,
      hasMore: hasMore ?? this.hasMore,
    );
  }
}

// Promotion Notifier
class PromotionNotifier extends StateNotifier<PromotionState> {
  final PromotionService _promotionService;
  int _currentPage = 1;
  bool _hasMore = true;

  PromotionNotifier(this._promotionService) : super(PromotionState.initial());

  Future<void> fetchPromotions({
    String? type,
    bool? isActive,
    String? search,
    bool refresh = false,
  }) async {
    if (refresh) {
      _currentPage = 1;
      _hasMore = true;
      state = state.copyWith(isLoading: true, error: null);
    } else if (!state.isLoading) {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final promotions = await _promotionService.getPromotions(
        type: type,
        isActive: isActive,
        search: search,
        page: _currentPage,
      );

      if (refresh) {
        state = state.copyWith(
          isLoading: false,
          promotions: promotions,
          hasMore: promotions.length >= 20, // assuming limit 20
        );
      } else {
        state = state.copyWith(
          isLoading: false,
          promotions: [...state.promotions, ...promotions],
          hasMore: promotions.length >= 20,
        );
      }

      if (promotions.isNotEmpty) {
        _currentPage++;
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> createPromotion(Map<String, dynamic> promotionData) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _promotionService.createPromotion(promotionData);
      // Optionally, refetch after creation
      await fetchPromotions(refresh: true);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }

  Future<void> updatePromotion(
    String id,
    Map<String, dynamic> promotionData,
  ) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _promotionService.updatePromotion(id, promotionData);
      await fetchPromotions(refresh: true);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }

  Future<void> deletePromotion(String id) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _promotionService.deletePromotion(id);
      await fetchPromotions(refresh: true);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }
}

// Provider
final promotionProvider =
    StateNotifierProvider<PromotionNotifier, PromotionState>((ref) {
      return PromotionNotifier(ref.read(promotionServiceProvider));
    });
