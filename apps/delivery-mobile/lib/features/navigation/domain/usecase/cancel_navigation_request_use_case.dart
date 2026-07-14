// lib/features/navigation/domain/usecase/cancel_navigation_request_use_case.dart
import 'package:delivery_mobile/features/navigation/domain/repository/navigation_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CancelNavigationRequestUseCase {
  final NavigationRepository _repository;

  CancelNavigationRequestUseCase(this._repository);

  Future<void> call() => _repository.cancelRequest();
}

/// Provider for cancel navigation request use case
final cancelNavigationRequestUseCaseProvider =
    Provider<CancelNavigationRequestUseCase>((ref) {
      final repository = ref.read(navigationRepositoryProvider);
      return CancelNavigationRequestUseCase(repository);
    });
