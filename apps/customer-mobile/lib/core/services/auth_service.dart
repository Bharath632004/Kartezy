// lib/core/services/auth_service.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/core/storage/secure_storage.dart';
import 'package:customer_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:customer_mobile/features/authentication/provider/provider.dart';

class AuthService {
  final Ref _ref;

  AuthService(this._ref);

  Future<bool> isLoggedIn() async {
    final secureStorage = _ref.read(secureStorageProvider);
    final token = await secureStorage.read(key: 'accessToken');
    final isLoggedIn = token != null && token.isNotEmpty;
    // Update the auth state provider
    _ref.read(authStateProvider.notifier).state = isLoggedIn;
    return isLoggedIn;
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
      final accessToken = user.accessToken;
      final refreshTokenValue = user.refreshToken;
      if (accessToken == null) {
        throw Exception('Access token is null');
      }
      if (refreshTokenValue == null) {
        throw Exception('Refresh token is null');
      }
      await secureStorage.write(key: 'accessToken', value: accessToken);
      await secureStorage.write(key: 'refreshToken', value: refreshTokenValue);
      // Update auth state to true
      _ref.read(authStateProvider.notifier).state = true;
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    final secureStorage = _ref.read(secureStorageProvider);
    await secureStorage.delete(key: 'accessToken');
    await secureStorage.delete(key: 'refreshToken');
    // Update auth state to false
    _ref.read(authStateProvider.notifier).state = false;
  }

  // Additional methods for token storage
  Future<void> saveTokens({String? accessToken, String? refreshToken}) async {
    final secureStorage = _ref.read(secureStorageProvider);
    if (accessToken != null && accessToken.isNotEmpty) {
      await secureStorage.write(key: 'accessToken', value: accessToken);
    }
    if (refreshToken != null && refreshToken.isNotEmpty) {
      await secureStorage.write(key: 'refreshToken', value: refreshToken);
    }
    // Update auth state to true (assuming we have a token)
    _ref.read(authStateProvider.notifier).state = true;
  }

  Future<String?> getUserId() async {
    final secureStorage = _ref.read(secureStorageProvider);
    return await secureStorage.read(key: 'userId');
  }
}

/// Provider to check if the user is logged in (StateProvider)
final authStateProvider = StateProvider<bool>((ref) => false);

/// Provider to initialize the auth state at app startup
final initializeAuthProvider = FutureProvider<bool>((ref) async {
  final authService = ref.read(authServiceProvider);
  final isLoggedIn = await authService.isLoggedIn();
  return isLoggedIn;
});

/// Provider for auth service
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref);
});

/// Provider to get the access token (Future)
final accessTokenProvider = FutureProvider<String?>((ref) {
  final authService = ref.read(authServiceProvider);
  return authService.getAccessToken();
});