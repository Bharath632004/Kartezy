// lib/features/authentication/domain/usecase/login_usecase.dart
import 'package:delivery_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:delivery_mobile/shared/models/user.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:delivery_mobile/features/authentication/provider/provider.dart';

class LoginUseCase {
  final AuthRepository _repository;

  LoginUseCase(this._repository);

  Future<User> call(String email, String password) async {
    final user = await _repository.login(email, password);
    return user;
  }
}

/// Provider for login use case
final loginUseCaseProvider = Provider<LoginUseCase>((ref) {
  final repository = ref.read(authRepositoryProvider);
  return LoginUseCase(repository);
});
