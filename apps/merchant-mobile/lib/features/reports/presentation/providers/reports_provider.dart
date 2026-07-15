import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/services/reports_service.dart';

final reportsProvider = StateNotifierProvider<ReportsNotifier, ReportsState>((
  ref,
) {
  return ReportsNotifier(ref.read(reportsServiceProvider));
});

class ReportsNotifier extends StateNotifier<ReportsState> {
  final ReportsService _reportsService;

  ReportsNotifier(this._reportsService) : super(const ReportsState());

  Future<void> generateDailyReport({String? date}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final report = await _reportsService.getDailyReport(date: date);
      state = state.copyWith(isLoading: false, dailyReport: report);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> generateMonthlyReport({String? month, String? year}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final report = await _reportsService.getMonthlyReport(
        month: month,
        year: year,
      );
      state = state.copyWith(isLoading: false, monthlyReport: report);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> generateSalesReport({String? startDate, String? endDate}) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final report = await _reportsService.getSalesReport(
        startDate: startDate,
        endDate: endDate,
      );
      state = state.copyWith(isLoading: false, salesReport: report);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void clearReports() {
    state = const ReportsState();
  }
}

class ReportsState {
  final bool isLoading;
  final String? error;
  final Map<String, dynamic>? dailyReport;
  final Map<String, dynamic>? monthlyReport;
  final Map<String, dynamic>? salesReport;

  const ReportsState({
    this.isLoading = false,
    this.error,
    this.dailyReport,
    this.monthlyReport,
    this.salesReport,
  });

  ReportsState copyWith({
    bool? isLoading,
    String? error,
    Map<String, dynamic>? dailyReport,
    Map<String, dynamic>? monthlyReport,
    Map<String, dynamic>? salesReport,
  }) {
    return ReportsState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      dailyReport: dailyReport ?? this.dailyReport,
      monthlyReport: monthlyReport ?? this.monthlyReport,
      salesReport: salesReport ?? this.salesReport,
    );
  }
}
