import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/analytics_service.dart';

class AnalyticsState {
  final bool isLoading;
  final String? error;
  final Map<String, dynamic>? ordersAnalytics;
  final List<dynamic>? bestSellers;

  const AnalyticsState({
    required this.isLoading,
    this.error,
    this.ordersAnalytics,
    this.bestSellers,
  });

  AnalyticsState copyWith({
    bool? isLoading,
    String? error,
    Map<String, dynamic>? ordersAnalytics,
    List<dynamic>? bestSellers,
  }) {
    return AnalyticsState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      ordersAnalytics: ordersAnalytics ?? this.ordersAnalytics,
      bestSellers: bestSellers ?? this.bestSellers,
    );
  }
}

class AnalyticsNotifier extends StateNotifier<AnalyticsState> {
  final AnalyticsService _analyticsService;

  AnalyticsNotifier(this._analyticsService) : super(const AnalyticsState(
        isLoading: false,
        ordersAnalytics: null,
        bestSellers: null,
      ));

  Future<void> refresh() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final ordersAnalytics = await _analyticsService.getOrdersAnalytics();
      final bestSellers = await _analyticsService.getBestSellersAnalytics();
      // We can add more analytics calls here if needed
      state = state.copyWith(
        isLoading: false,
        ordersAnalytics: ordersAnalytics,
        bestSellers: bestSellers,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

final analyticsProvider = StateNotifierProvider<AnalyticsNotifier, AnalyticsState>((ref) {
  return AnalyticsNotifier(ref.read(analyticsServiceProvider));
});
