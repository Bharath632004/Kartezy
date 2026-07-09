import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/repositories/dashboard_repository.dart';
import '../../core/services/auth_service.dart';
import '../../core/api/dio_client.dart';

final dashboardRepositoryProvider = Provider<DashboardRepository>((ref) {
  return DashboardRepositoryImpl(
    authService: ref.read(authServiceProvider),
    dioClient: ref.read(dioClientProvider),
  );
});

// State notifier for dashboard data
class DashboardState {
  final double todaySales;
  final double revenue;
  final int orders;
  final int pendingOrders;
  final int cancelledOrders;
  final int visitors;
  final double rating;
  final bool isLoading;
  final String? error;

  DashboardState({
    required this.todaySales,
    required this.revenue,
    required this.orders,
    required this.pendingOrders,
    required this.cancelledOrders,
    required this.visitors,
    required this.rating,
    required this.isLoading,
    this.error,
  });

  DashboardState copyWith({
    double? todaySales,
    double? revenue,
    int? orders,
    int? pendingOrders,
    int? cancelledOrders,
    int? visitors,
    double? rating,
    bool? isLoading,
    String? error,
  }) {
    return DashboardState(
      todaySales: todaySales ?? this.todaySales,
      revenue: revenue ?? this.revenue,
      orders: orders ?? this.orders,
      pendingOrders: pendingOrders ?? this.pendingOrders,
      cancelledOrders: cancelledOrders ?? this.cancelledOrders,
      visitors: visitors ?? this.visitors,
      rating: rating ?? this.rating,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

class DashboardNotifier extends StateNotifier<DashboardState> {
  final DashboardRepository _dashboardRepository;

  DashboardNotifier(this._dashboardRepository)
      : super(DashboardState(
          todaySales: 0,
          revenue: 0,
          orders: 0,
          pendingOrders: 0,
          cancelledOrders: 0,
          visitors: 0,
          rating: 0,
          isLoading: false,
          error: null,
        )) {
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final dashboardData = await _dashboardRepository.getDashboardData();
      state = state.copyWith(
        todaySales: dashboardData.todaySales,
        revenue: dashboardData.revenue,
        orders: dashboardData.orders,
        pendingOrders: dashboardData.pendingOrders,
        cancelledOrders: dashboardData.cancelledOrders,
        visitors: dashboardData.visitors,
        rating: dashboardData.rating,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      rethrow;
    }
  }
}

final dashboardProvider = StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
  return DashboardNotifier(
    ref.read(dashboardRepositoryProvider),
  );
});