import '../models/dashboard_model.dart';
import '../datasources/dashboard_remote_data_source.dart';
import '../../core/services/auth_service.dart';
import '../../core/api/dio_client.dart';

abstract class DashboardRepository {
  Future<DashboardModel> getDashboardData();
}

class DashboardRepositoryImpl implements DashboardRepository {
  final DashboardRemoteDataSource remoteDataSource;

  DashboardRepositoryImpl({
    required AuthService authService,
    required DioClient dioClient,
  }) : remoteDataSource = DashboardRemoteDataSourceImpl(authService, dioClient);

  @override
  Future<DashboardModel> getDashboardData() async {
    return await remoteDataSource.getDashboardData();
  }
}
