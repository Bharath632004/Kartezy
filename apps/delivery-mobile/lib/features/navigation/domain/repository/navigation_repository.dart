// lib/features/navigation/domain/repository/navigation_repository.dart
import 'package:delivery_mobile/shared/models/route_info.dart';
import 'package:geolocator/geolocator.dart';

abstract class NavigationRepository {
  Future<List<RouteInfo>> getDirections(
    String origin,
    String destination,
    bool alternatives,
  );

  Future<Position> getCurrentLocation();

  Stream<Position> getLocationStream({
    LocationAccuracy accuracy = LocationAccuracy.high,
  });

  Future<void> cancelRequest();
}
