import 'package:merchant_mobile/features/dashboard/data/models/dashboard_model.dart';
import 'package:merchant_mobile/core/services/base_service.dart';
import 'package:merchant_mobile/core/api/api_constants.dart';

abstract class DashboardRemoteDataSource {
  Future<DashboardModel> getDashboardData();
}

class DashboardRemoteDataSourceImpl extends BaseService
    implements DashboardRemoteDataSource {
  DashboardRemoteDataSourceImpl(super.authService, super.dioClient);

  @override
  Future<DashboardModel> getDashboardData() async {
    final response = await dioClient.instance.get(ApiConstants.dashboardStats);
    return DashboardModel.fromJson(response.data);
  }
}
