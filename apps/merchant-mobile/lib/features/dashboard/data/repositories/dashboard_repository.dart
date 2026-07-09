import '../models/dashboard_model.dart';

abstract class DashboardRepository {
  Future<DashboardModel> getDashboardData();
}

class DashboardRepositoryImpl implements DashboardRepository {
  final DashboardRemoteDataSource remoteDataSource;

  DashboardRepositoryImpl({required this.remoteDataSource});

  @override
  Future<DashboardModel> getDashboardData() async {
    return await remoteDataSource.getDashboardData();
  }
}
