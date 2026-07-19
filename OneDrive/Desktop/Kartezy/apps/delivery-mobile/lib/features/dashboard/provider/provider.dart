// lib/features/dashboard/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import 'package:kartezy_core/network/dio_client.dart';

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

// Dashboard service for real API calls
class DashboardService {
  final DioClient _dioClient;

  DashboardService(this._dioClient);

  Future<Map<String, dynamic>> getDashboard() async {
    final response = await _dioClient.dio.get('/delivery/dashboard');
    return response.data as Map<String, dynamic>;
  }
}

final dashboardServiceProvider = Provider<DashboardService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return DashboardService(dioClient);
});

// Define the notifier
class DashboardNotifier extends StateNotifier<DashboardState> {
  final Ref _ref;

  DashboardNotifier(this._ref) : super(const DashboardState.loading()) {
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    try {
      final dashboardService = _ref.read(dashboardServiceProvider);
      final data = await dashboardService.getDashboard();
      state = DashboardState.success(data);
    } catch (e) {
      state = DashboardState.error('Failed to load dashboard data: $e');
    }
  }

  Future<void> refresh() async {
    state = const DashboardState.loading();
    await _loadDashboardData();
  }
}

// Provider for the dashboard notifier
final dashboardProvider =
    StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
  return DashboardNotifier(ref);
});
