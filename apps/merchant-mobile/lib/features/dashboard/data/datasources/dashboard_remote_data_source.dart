import '../models/dashboard_model.dart';

abstract class DashboardRemoteDataSource {
  Future<DashboardModel> getDashboardData();
}

class DashboardRemoteDataSourceImpl implements DashboardRemoteDataSource {
  @override
  Future<DashboardModel> getDashboardData() async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));

    // Return mock data matching simplified model
    return DashboardModel(
      todaySales: 1250.50,
      revenue: 12500.75,
      orders: 45,
      pendingOrders: 8,
      cancelledOrders: 2,
      visitors: 1240,
      rating: 4.8,
    );
  }
}