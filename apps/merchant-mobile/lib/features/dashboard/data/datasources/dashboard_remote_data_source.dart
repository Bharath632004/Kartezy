import '../models/dashboard_model.dart';
import '../../core/services/auth_service.dart';
import '../../core/services/base_service.dart';
import '../../core/api/dio_client.dart';
import '../../core/api/api_constants.dart';

abstract class DashboardRemoteDataSource {
  Future<DashboardModel> getDashboardData();
}

class DashboardRemoteDataSourceImpl extends BaseService
    implements DashboardRemoteDataSource {
  DashboardRemoteDataSourceImpl(AuthService authService, DioClient dioClient)
    : super(authService, dioClient);

  @override
  Future<DashboardModel> getDashboardData() async {
    return safeCall(() async {
      final response = await dioClient.instance.get(
        '${ApiConstants.dashboardStats}',
      );
      return DashboardModel.fromJson(response.data);
    });
  }
}
