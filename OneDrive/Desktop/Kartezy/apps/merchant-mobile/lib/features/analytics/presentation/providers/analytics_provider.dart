import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/analytics_service.dart';

final analyticsProvider =
    StateNotifierProvider<AnalyticsNotifier, AnalyticsState>((ref) {
      return AnalyticsNotifier(ref.read(analyticsServiceProvider));
    });

class AnalyticsNotifier extends StateNotifier<AnalyticsState> {
  final AnalyticsService _analyticsService;

  AnalyticsNotifier(this._analyticsService) : super(const AnalyticsState()) {
    _loadAnalyticsData();
  }

  Future<void> _loadAnalyticsData() async {
    state = state.copyWith(isLoading: true);
    try {
      // Fetch various analytics data
      final revenueAnalytics = await _analyticsService.getRevenueAnalytics();
      final ordersAnalytics = await _analyticsService.getOrdersAnalytics();
      final customersAnalytics = await _analyticsService
          .getCustomersAnalytics();
      final bestSellers = await _analyticsService.getBestSellersAnalytics();

      state = state.copyWith(
        isLoading: false,
        revenueAnalytics: revenueAnalytics,
        ordersAnalytics: ordersAnalytics,
        customersAnalytics: customersAnalytics,
        bestSellers: bestSellers,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> refresh() async {
    await _loadAnalyticsData();
  }
}

class AnalyticsState {
  final bool isLoading;
  final String? error;
  final Map<String, dynamic>? revenueAnalytics;
  final Map<String, dynamic>? ordersAnalytics;
  final Map<String, dynamic>? customersAnalytics;
  final List<dynamic>? bestSellers;

  const AnalyticsState({
    this.isLoading = false,
    this.error,
    this.revenueAnalytics,
    this.ordersAnalytics,
    this.customersAnalytics,
    this.bestSellers,
  });

  AnalyticsState copyWith({
    bool? isLoading,
    String? error,
    Map<String, dynamic>? revenueAnalytics,
    Map<String, dynamic>? ordersAnalytics,
    Map<String, dynamic>? customersAnalytics,
    List<dynamic>? bestSellers,
  }) {
    return AnalyticsState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      revenueAnalytics: revenueAnalytics ?? this.revenueAnalytics,
      ordersAnalytics: ordersAnalytics ?? this.ordersAnalytics,
      customersAnalytics: customersAnalytics ?? this.customersAnalytics,
      bestSellers: bestSellers ?? this.bestSellers,
    );
  }
}
