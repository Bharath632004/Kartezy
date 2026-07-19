import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/finance_service.dart';

// Revenue State
class RevenueState {
  final bool isLoading;
  final String? error;
  final Map<String, dynamic>? revenue;
  final Map<String, dynamic>? salesSummary;
  final Map<String, dynamic>? walletBalance;

  RevenueState({
    required this.isLoading,
    this.error,
    this.revenue,
    this.salesSummary,
    this.walletBalance,
  });

  factory RevenueState.initial() => RevenueState(isLoading: false);

  RevenueState copyWith({
    bool? isLoading,
    String? error,
    Map<String, dynamic>? revenue,
    Map<String, dynamic>? salesSummary,
    Map<String, dynamic>? walletBalance,
  }) {
    return RevenueState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      revenue: revenue ?? this.revenue,
      salesSummary: salesSummary ?? this.salesSummary,
      walletBalance: walletBalance ?? this.walletBalance,
    );
  }
}

// Revenue Notifier
class RevenueNotifier extends StateNotifier<RevenueState> {
  final FinanceService _financeService;

  RevenueNotifier(this._financeService) : super(RevenueState.initial());

  Future<void> fetchRevenue({String? startDate, String? endDate}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final revenue = await _financeService.getRevenue(
        startDate: startDate,
        endDate: endDate,
      );
      state = state.copyWith(isLoading: false, revenue: revenue);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> fetchSalesSummary({String? startDate, String? endDate}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final salesSummary = await _financeService.getSalesSummary(
        startDate: startDate,
        endDate: endDate,
      );
      state = state.copyWith(isLoading: false, salesSummary: salesSummary);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> fetchWalletBalance() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final walletBalance = await _financeService.getWalletBalance();
      state = state.copyWith(isLoading: false, walletBalance: walletBalance);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> refreshAll() async {
    await fetchRevenue();
    await fetchSalesSummary();
    await fetchWalletBalance();
  }
}

// Provider
final revenueProvider = StateNotifierProvider<RevenueNotifier, RevenueState>((
  ref,
) {
  return RevenueNotifier(ref.read(financeServiceProvider));
});
