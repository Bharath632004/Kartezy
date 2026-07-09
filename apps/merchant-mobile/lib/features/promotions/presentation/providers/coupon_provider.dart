import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/promotion_service.dart';

// Coupon State
class CouponState {
  final bool isLoading;
  final String? error;
  final List<dynamic> coupons;
  final bool hasMore;

  CouponState({
    required this.isLoading,
    this.error,
    required this.coupons,
    required this.hasMore,
  });

  factory CouponState.initial() => CouponState(
        isLoading: false,
        coupons: [],
        hasMore: false,
      );

  CouponState copyWith({
    bool? isLoading,
    String? error,
    List<dynamic>? coupons,
    bool? hasMore,
  }) {
    return CouponState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      coupons: coupons ?? this.coupons,
      hasMore: hasMore ?? this.hasMore,
    );
  }
}

// Coupon Notifier
class CouponNotifier extends StateNotifier<CouponState> {
  final PromotionService _promotionService;
  int _currentPage = 1;
  bool _hasMore = true;

  CouponNotifier(this._promotionService) : super(CouponState.initial());

  Future<void> fetchCoupons({
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
      final coupons = await _promotionService.getPromotions(
        type: 'coupon',
        isActive: isActive,
        search: search,
        page: _currentPage,
      );

      if (refresh) {
        state = state.copyWith(
          isLoading: false,
          coupons: coupons,
          hasMore: coupons.length >= 20, // assuming limit 20
        );
      } else {
        state = state.copyWith(
          isLoading: false,
          coupons: [...state.coupons, ...coupons],
          hasMore: coupons.length >= 20,
        );
      }

      if (coupons.isNotEmpty) {
        _currentPage++;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> createCoupon(Map<String, dynamic> couponData) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      // We'll treat coupon creation as promotion creation with type coupon
      final promotionData = {...couponData, type: 'coupon'};
      await _promotionService.createPromotion(promotionData);
      // Optionally, refetch after creation
      await fetchCoupons(refresh: true);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }

  Future<void> updateCoupon(String id, Map<String, dynamic> couponData) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _promotionService.updatePromotion(id, {...couponData, type: 'coupon'});
      await fetchCoupons(refresh: true);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }

  Future<void> deleteCoupon(String id) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _promotionService.deletePromotion(id);
      await fetchCoupons(refresh: true);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      rethrow;
    }
  }
}

// Provider
final couponProvider = StateNotifierProvider<CouponNotifier, CouponState>((ref) {
  return CouponNotifier(ref.read(promotionServiceProvider));
});