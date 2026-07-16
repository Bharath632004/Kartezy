// lib/features/dashboard/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

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
  DashboardNotifier() : super(DashboardState.loading()) {
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));
    // In a real app, we would call a dashboard service here
        final mockData = {
      'isOnline': true,
      'todayEarnings': 125.50,
      'weeklyEarnings': 875.25,
      'monthlyEarnings': 3500.00,
      'availableOrders': 5,
      'acceptedOrders': 3,
      'deliveredOrders': 42,
      'cancelledOrders': 2,
      'rating': 4.8,
      'walletBalance': 250.75,
      'totalDistance': 1250,
      'avgDeliveryTime': 25,
      'acceptanceRate': 85,
    };
    state = DashboardState.success(mockData);
  }

  Future<void> refresh() async {
    state = DashboardState.loading();
    await _loadDashboardData();
  }
}

// Provider for the dashboard notifier
final dashboardProvider =
    StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
  return DashboardNotifier();
});
