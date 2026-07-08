// lib/core/services/auth_service.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/core/storage/secure_storage.dart';
import 'package:customer_mobile/features/authentication/domain/repository/auth_repository.dart';

class AuthService {
  final Ref _ref;

  AuthService(this._ref);

  Future<bool> isLoggedIn() async {
    final secureStorage = _ref.read(secureStorageProvider);
    final token = await secureStorage.read(key: 'accessToken');
    return token != null && token.isNotEmpty;
  }

  Future<String?> getAccessToken() async {
    final secureStorage = _ref.read(secureStorageProvider);
    return await secureStorage.read(key: 'accessToken');
  }

  Future<String?> getRefreshToken() async {
    final secureStorage = _ref.read(secureStorageProvider);
    return await secureStorage.read(key: 'refreshToken');
  }

  Future<bool> refreshToken() async {
    try {
      final refreshToken = await getRefreshToken();
      if (refreshToken == null || refreshToken.isEmpty) {
        return false;
      }
      final authRepository = _ref.read(authRepositoryProvider);
      final user = await authRepository.refreshToken(refreshToken);
      // Update stored tokens
      final secureStorage = _ref.read(secureStorageProvider);
      await secureStorage.write(key: 'accessToken', value: user.accessToken);
      await secureStorage.write(key: 'refreshToken', value: user.refreshToken);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    final secureStorage = _ref.read(secureStorageProvider);
    await secureStorage.delete(key: 'accessToken');
    await secureStorage.delete(key: 'refreshToken');
  }

  // Additional methods for token storage
  Future<void> saveTokens({required String accessToken, required String refreshToken}) async {
    final secureStorage = _ref.read(secureStorageProvider);
    await secureStorage.write(key: 'accessToken', value: accessToken);
    await secureStorage.write(key: 'refreshToken', value: refreshToken);
  }

  Future<String?> getUserId() async {
    final secureStorage = _ref.read(secureStorageProvider);
    return await secureStorage.read(key: 'userId');
  }
}

/// Provider for auth service
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref);
});

/// Provider to check if the user is logged in (Future)
final authStateProvider = FutureProvider<bool>((ref) {
  final authService = ref.read(authServiceProvider);
  return authService.isLoggedIn();
});

/// Provider to get the access token (Future)
final accessTokenProvider = FutureProvider<String?>((ref) {
  final authService = ref.read(authServiceProvider);
  return authService.getAccessToken();
});