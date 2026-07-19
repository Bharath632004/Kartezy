// lib/features/navigation/domain/usecase/get_location_stream_use_case.dart
import 'package:delivery_mobile/features/navigation/domain/repository/navigation_repository.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetLocationStreamUseCase {
  final NavigationRepository _repository;

  GetLocationStreamUseCase(this._repository);

  Stream<Position> call({LocationAccuracy accuracy = LocationAccuracy.high}) =>
      _repository.getLocationStream(accuracy: accuracy);
}

/// Provider for get location stream use case
final getLocationStreamUseCaseProvider = Provider<GetLocationStreamUseCase>((
  ref,
) {
  final repository = ref.read(navigationRepositoryProvider);
  return GetLocationStreamUseCase(repository);
});
