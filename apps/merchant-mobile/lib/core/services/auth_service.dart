import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../api/api_constants.dart';

class AuthService {
  final Dio _dio;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  AuthService() : _dio = Dio(BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        receiveDataWhenStatusError: true,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
      )) {
    // We don't add any interceptors here to avoid infinite loops during token refresh.
  }

  Dio get _dioInstance => _dio;

  Future<void> loginWithEmail(String email, String password) async {
    try {
      final response = await _dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.login}',
        data: {
          'email': email,
          'password': password,
        },
      );
      // Save tokens
      await _saveTokens(response.data['access_token'], response.data['refresh_token']);
    } catch (e) {
      throw Exception('Login failed: $e');
    }
  }

  Future<void> loginWithPhone(String phone, String otp) async {
    try {
      final response = await _dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.verifyOtp}',
        data: {
          'phone': phone,
          'otp': otp,
        },
      );
      await _saveTokens(response.data['access_token'], response.data['refresh_token']);
    } catch (e) {
      throw Exception('Phone login failed: $e');
    }
  }

  Future<void> loginWithGoogle(String idToken) async {
    try {
      final response = await _dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.login}/google',
        data: {
          'id_token': idToken,
        },
      );
      await _saveTokens(response.data['access_token'], response.data['refresh_token']);
    } catch (e) {
      throw Exception('Google login failed: $e');
    }
  }

  Future<void> register(String email, String password, String fullName) async {
    try {
      final response = await _dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.register}',
        data: {
          'email': email,
          'password': password,
          'full_name': fullName,
        },
      );
      await _saveTokens(response.data['access_token'], response.data['refresh_token']);
    } catch (e) {
      throw Exception('Registration failed: $e');
    }
  }

  Future<void> refreshToken() async {
    try {
      final refreshToken = await _secureStorage.read(key: 'refresh_token');
      if (refreshToken == null) throw Exception('No refresh token');

      final response = await _dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.refreshToken}',
        data: {
          'refresh_token': refreshToken,
        },
      );
      await _saveTokens(response.data['access_token'], response.data['refresh_token']);
    } catch (e) {
      throw Exception('Token refresh failed: $e');
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.logout}',
      );
    } catch (e) {
      // Ignore logout errors
    } finally {
      await _clearTokens();
    }
  }

  Future<String?> getAccessToken() async {
    return await _secureStorage.read(key: 'access_token');
  }

  Future<bool> isLoggedIn() async {
    final accessToken = await _secureStorage.read(key: 'access_token');
    return accessToken != null && accessToken.isNotEmpty;
  }

  Future<void> _saveTokens(String accessToken, String refreshToken) async {
    await _secureStorage.write(key: 'access_token', value: accessToken);
    await _secureStorage.write(key: 'refresh_token', value: refreshToken);
  }

  Future<void> _clearTokens() async {
    await _secureStorage.delete(key: 'access_token');
    await _secureStorage.delete(key: 'refresh_token');
  }
}

// Provider for authentication state
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService();
});

// Provider for authentication state
final authStateProvider = StateNotifierProvider<AuthStateNotifier, AuthState>((ref) {
  return AuthStateNotifier(ref.read(authServiceProvider));
});

// We no longer need the dioClientProvider in this file.