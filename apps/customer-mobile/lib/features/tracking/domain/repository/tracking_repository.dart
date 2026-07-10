
abstract class TrackingRepository {
  /// Get real-time tracking information for an order.
  /// Returns a stream of tracking updates.
  Stream<TrackingInfo> getOrderTracking(String orderId);

  /// Get the current driver information for an order.
  Future<DriverInfo> getDriverInfo(String orderId);

  /// Get the route information for an order.
  Future<RouteInfo> getRouteInfo(String orderId);
}