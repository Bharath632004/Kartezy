// lib/features/profile/domain/usecase/get_profile_usecase.dart
import 'package:customer_mobile/features/profile/domain/repository/profile_repository.dart';
import 'package:customer_mobile/shared/models/user.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetProfileUseCase {
  final ProfileRepository _repository;

  GetProfileUseCase(this._repository);

  Future<User> call() => _repository.getProfile();
}

/// Provider for get profile use case
final getProfileUseCaseProvider = Provider<GetProfileUseCase>((ref) {
  final repository = ref.read(profileRepositoryProvider);
  return GetProfileUseCase(repository);
});
