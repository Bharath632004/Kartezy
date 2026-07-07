// lib/features/authentication/domain/usecase/login_usecase.dart
import 'package:customer_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:customer_mobile/features/authentication/data/repository/auth_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class LoginUseCase {
  final AuthRepository _repository;

  LoginUseCase(this._repository);

  Future<bool> call(String email, String password) {
    return _repository.login(email, password);
  }
}

/// Provider for login use case
final loginUseCaseProvider = Provider<LoginUseCase>((ref) {
  final repository = _ref.read(authRepositoryProvider);
  return LoginUseCase(repository);
});