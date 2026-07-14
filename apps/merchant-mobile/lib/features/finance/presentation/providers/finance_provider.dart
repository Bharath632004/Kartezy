import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/finance_service.dart';

final financeProvider = StateNotifierProvider<FinanceNotifier, FinanceState>((
  ref,
) {
  return FinanceNotifier(ref.read(financeServiceProvider));
});

class FinanceNotifier extends StateNotifier<FinanceState> {
  final FinanceService _financeService;

  FinanceNotifier(this._financeService) : super(const FinanceState()) {
    // Load initial data
    _loadFinanceData();
  }

  Future<void> _loadFinanceData() async {
    state = state.copyWith(isLoading: true);
    try {
      // Fetch various finance data in parallel
      final revenue = await _financeService.getRevenue();
      final salesSummary = await _financeService.getSalesSummary();
      final walletBalance = await _financeService.getWalletBalance();

      state = state.copyWith(
        isLoading: false,
        revenue: revenue,
        salesSummary: salesSummary,
        walletBalance: walletBalance,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> refresh() async {
    await _loadFinanceData();
  }
}

class FinanceState {
  final bool isLoading;
  final String? error;
  final Map<String, dynamic>? revenue;
  final Map<String, dynamic>? salesSummary;
  final Map<String, dynamic>? walletBalance;

  const FinanceState({
    this.isLoading = false,
    this.error,
    this.revenue,
    this.salesSummary,
    this.walletBalance,
  });

  FinanceState copyWith({
    bool? isLoading,
    String? error,
    Map<String, dynamic>? revenue,
    Map<String, dynamic>? salesSummary,
    Map<String, dynamic>? walletBalance,
  }) {
    return FinanceState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      revenue: revenue ?? this.revenue,
      salesSummary: salesSummary ?? this.salesSummary,
      walletBalance: walletBalance ?? this.walletBalance,
    );
  }
}
