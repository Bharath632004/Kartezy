import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/providers/network_provider.dart';
import 'package:kartezy_core/network/dio_client.dart';

// Define the state of the dashboard
class DashboardState {
  final bool isLoading;
  final Map<String, dynamic>? data;
  final String? error;

  const DashboardState({this.isLoading = false, this.data, this.error});

  factory DashboardState.loading() => const DashboardState(isLoading: true);
  factory DashboardState.success(Map<String, dynamic> data) =>
      DashboardState(isLoading: false, data: data);
  factory DashboardState.error(String error) =>
      DashboardState(isLoading: false, error: error);
}

// Define the notifier
class DashboardNotifier extends StateNotifier<DashboardState> {
  final DioClient _dioClient;

  DashboardNotifier(this._dioClient) : super(DashboardState.loading()) {
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    try {
      state = DashboardState.loading();
      final response = await _dioClient.get('/api/delivery/dashboard');
      final data = response.data as Map<String, dynamic>? ?? {};
      state = DashboardState.success(data);
    } catch (e) {
      state = DashboardState.error(e.toString());
    }
  }

  Future<void> refresh() async {
    await _loadDashboardData();
  }

  Future<void> toggleOnline(bool isOnline) async {
    try {
      final currentData = Map<String, dynamic>.from(state.data ?? {});
      currentData['isOnline'] = isOnline;
      state = DashboardState.success(currentData);
      await _dioClient.put(
        '/api/delivery/partner/status',
        data: {'is_online': isOnline},
      );
    } catch (e) {
      final currentData = Map<String, dynamic>.from(state.data ?? {});
      currentData['isOnline'] = !isOnline;
      state = DashboardState.success(currentData);
    }
  }
}

// Provider for the dashboard notifier
final dashboardProvider =
    StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
      final dioClient = ref.watch(dioClientProvider);
      return DashboardNotifier(dioClient);
    });
