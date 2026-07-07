// lib/features/authentication/domain/repository/auth_repository.dart
abstract class AuthRepository {
  Future<bool> login(String email, String password);
  Future<void> logout();
  Future<String?> getCurrentUserId();
}