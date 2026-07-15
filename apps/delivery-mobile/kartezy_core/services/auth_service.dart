import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/storage/secure_storage.dart';
import 'package:kartezy_core/providers/network_provider.dart';
import 'package:kartezy_core/network/api_constants.dart';

class AuthService {
  final Ref _ref;

  AuthService(this._ref);

  Future<bool> isLoggedIn() async {
    final secureStorage = _ref.read(secureStorageProvider);
    final token = await secureStorage.read(key: 'accessToken');
    final isLoggedIn = token != null && token.isNotEmpty;
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
      final token = await getRefreshToken();
      if (token == null || token.isEmpty) return false;

      final dio = _ref.read(dioProvider);
      final response = await dio.post(
        ApiConstants.deliveryPartnerAuthRefresh,
        data: {'refresh_token': token},
      );

      final secureStorage = _ref.read(secureStorageProvider);
      final newAccessToken = response.data['access_token'] as String?;
      final newRefreshToken = response.data['refresh_token'] as String?;

      if (newAccessToken != null) {
        await secureStorage.write(key: 'accessToken', value: newAccessToken);
      }
      if (newRefreshToken != null) {
        await secureStorage.write(key: 'refreshToken', value: newRefreshToken);
      }

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
    _ref.read(authStateProvider.notifier).state = false;
  }

  Future<void> saveTokens({String? accessToken, String? refreshToken}) async {
    final secureStorage = _ref.read(secureStorageProvider);
    if (accessToken != null && accessToken.isNotEmpty) {
      await secureStorage.write(key: 'accessToken', value: accessToken);
    }
    if (refreshToken != null && refreshToken.isNotEmpty) {
      await secureStorage.write(key: 'refreshToken', value: refreshToken);
    }
    _ref.read(authStateProvider.notifier).state = true;
  }

  Future<String?> getUserId() async {
    final secureStorage = _ref.read(secureStorageProvider);
    return await secureStorage.read(key: 'userId');
  }
}

final authStateProvider = StateProvider<bool>((ref) => false);

final initializeAuthProvider = FutureProvider<bool>((ref) async {
  final authService = ref.read(authServiceProvider);
  final isLoggedIn = await authService.isLoggedIn();
  return isLoggedIn;
});

final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService(ref);
});

final accessTokenProvider = FutureProvider<String?>((ref) {
  final authService = ref.read(authServiceProvider);
  return authService.getAccessToken();
});
