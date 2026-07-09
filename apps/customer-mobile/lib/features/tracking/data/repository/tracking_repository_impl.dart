import 'package:customer_mobile/features/tracking/data/datasource/tracking_remote_data_source.dart';
import 'package:customer_mobile/features/tracking/domain/models/driver_info.dart';
import 'package:customer_mobile/features/tracking/domain/models/route_info.dart';
import 'package:customer_mobile/features/tracking/domain/models/tracking_info.dart';
import 'package:customer_mobile/features/tracking/domain/repository/tracking_repository.dart';

class TrackingRepositoryImpl implements TrackingRepository {
  final TrackingRemoteDataSource remoteDataSource;

  TrackingRepositoryImpl(this.remoteDataSource);

  @override
  Stream<TrackingInfo> getOrderTracking(String orderId) {
    return remoteDataSource.getOrderTracking(orderId);
  }

  @override
  Future<DriverInfo> getDriverInfo(String orderId) {
    return remoteDataSource.getDriverInfo(orderId);
  }

  @override
  Future<RouteInfo> getRouteInfo(String orderId) {
    return remoteDataSource.getRouteInfo(orderId);
  }
}