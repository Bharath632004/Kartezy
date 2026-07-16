import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:delivery_mobile/core/services/api_service.dart';

// Define the state of the dashboard
class DashboardState {
  final bool isLoading;
  final Map<String, dynamic>? data;
  final String? error;

  const DashboardState({
    this.isLoading = false,
    this.data,
    this.error,
  });

  factory DashboardState.loading() => const DashboardState(isLoading: true);
  factory DashboardState.success(Map<String, dynamic> data) =>
      DashboardState(isLoading: false, data: data);
  factory DashboardState.error(String error) =>
      DashboardState(isLoading: false, error: error);
}

// Define the notifier
class DashboardNotifier extends StateNotifier<DashboardState> {
  final ApiService _apiService;

  DashboardNotifier(this._apiService) : super(DashboardState.loading()) {
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    try {
      state = DashboardState.loading();
      final response = await _apiService.get('/api/delivery/dashboard');
      final data = response.data as Map<String, dynamic>? ?? {};
      state = DashboardState.success(data);
    } catch (e) {
      state = DashboardState.error(e.toString());
    }
  }

  Future<void> refresh() async {
    await _loadDashboardData();
  }
}

// Provider for the dashboard notifier
final dashboardProvider =
    StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return DashboardNotifier(apiService);
});
