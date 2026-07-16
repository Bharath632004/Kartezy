// lib/features/navigation/domain/usecase/cancel_navigation_request_use_case.dart
import 'package:delivery_mobile/features/navigation/domain/repository/navigation_repository.dart';

class CancelNavigationRequestUseCase {
  final NavigationRepository _repository;

  CancelNavigationRequestUseCase(this._repository);

  Future<void> call() => _repository.cancelRequest();
}
