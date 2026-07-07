// lib/core/services/auth_service.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/core/storage/secure_storage.dart';

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

  Future<void> logout() async {
    final secureStorage = _ref.read(secureStorageProvider);
    await secureStorage.delete(key: 'accessToken');
    await secureStorage.delete(key: 'refreshToken');
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