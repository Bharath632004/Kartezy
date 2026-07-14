// lib/features/navigation/data/repository/navigation_repository_impl.dart
import 'package:delivery_mobile/features/navigation/data/datasource/navigation_remote_data_source.dart';
import 'package:delivery_mobile/features/navigation/domain/repository/navigation_repository.dart';
import 'package:delivery_mobile/shared/models/route_info.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class NavigationRepositoryImpl implements NavigationRepository {
  final NavigationRemoteDataSource _remoteDataSource;

  NavigationRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<RouteInfo>> getDirections(
    String origin,
    String destination,
    bool alternatives,
  ) async {
    return await _remoteDataSource.getDirections(
      origin,
      destination,
      alternatives,
    );
  }

  @override
  Future<Position> getCurrentLocation() async {
    return await _remoteDataSource.getCurrentLocation();
  }

  @override
  Stream<Position> getLocationStream({
    LocationAccuracy accuracy = LocationAccuracy.high,
  }) {
    return _remoteDataSource.getLocationStream(accuracy: accuracy);
  }

  @override
  Future<void> cancelRequest() async {
    await _remoteDataSource.cancelRequest();
  }
}

/// Provider for navigation repository
final navigationRepositoryProvider = Provider<NavigationRepository>((ref) {
  final remoteDataSource = ref.read(navigationRemoteDataSourceProvider);
  return NavigationRepositoryImpl(remoteDataSource);
});
