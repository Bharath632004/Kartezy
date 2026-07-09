import 'package:customer_mobile/features/tracking/domain/models/driver_info.dart';
import 'package:customer_mobile/features/tracking/domain/models/route_info.dart';
import 'package:customer_mobile/features/tracking/domain/models/tracking_info.dart';
import 'package:customer_mobile/core/network/dio_client.dart';

abstract class TrackingRemoteDataSource {
  Stream<TrackingInfo> getOrderTracking(String orderId);
  Future<DriverInfo> getDriverInfo(String orderId);
  Future<RouteInfo> getRouteInfo(String orderId);
}