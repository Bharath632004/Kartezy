// lib/features/navigation/domain/usecase/get_current_location_use_case.dart
import 'package:delivery_mobile/features/navigation/domain/repository/navigation_repository.dart';
import 'package:geolocator/geolocator.dart';

class GetCurrentLocationUseCase {
  final NavigationRepository _repository;

  GetCurrentLocationUseCase(this._repository);

  Future<Position> call() => _repository.getCurrentLocation();
}
