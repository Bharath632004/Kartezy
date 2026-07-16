// lib/features/navigation/domain/usecase/get_directions_use_case.dart
import 'package:delivery_mobile/features/navigation/domain/repository/navigation_repository.dart';
import 'package:delivery_mobile/shared/models/route_info.dart';

class GetDirectionsUseCase {
  final NavigationRepository _repository;

  GetDirectionsUseCase(this._repository);

  Future<List<RouteInfo>> call(
    String origin,
    String destination,
    bool alternatives,
  ) => _repository.getDirections(origin, destination, alternatives);
}
