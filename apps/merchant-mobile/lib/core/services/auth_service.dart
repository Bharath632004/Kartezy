import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/dio_client.dart';
import '../api/api_constants.dart';
import '../error/exceptions.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return AuthService(dioClient);
});

class AuthService {
  final DioClient _dioClient;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  AuthService(this._dioClient);

  Dio get _dio => _dioClient.getInstance();

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
final authStateProvider = StateNotifierProvider<AuthStateNotifier, AuthState>((ref) {
  return AuthStateNotifier(ref.read(authServiceProvider));
});

class AuthStateNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;
  AuthStateNotifier(this._authService) : super(AuthState.initial()) {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    state = state.copyWith(isLoading: true);
    try {
      final isLoggedIn = await _authService.isLoggedIn();
      if (isLoggedIn) {
        final accessToken = await _authService.getAccessToken();
        state = state.copyWith(isLoggedIn: true, userToken: accessToken);
      } else {
        state = state.copyWith(isLoggedIn: false);
      }
    } catch (e) {
      state = state.copyWith(error: e.toString());
    } finally {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> loginWithEmail(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _authService.loginWithEmail(email, password);
      final accessToken = await _authService.getAccessToken();
      state = state.copyWith(isLoggedIn: true, userToken: accessToken, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      rethrow;
    }
  }

  Future<void> loginWithPhone(String phone, String otp) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _authService.loginWithPhone(phone, otp);
      final accessToken = await _authService.getAccessToken();
      state = state.copyWith(isLoggedIn: true, userToken: accessToken, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      rethrow;
    }
  }

  Future<void> loginWithGoogle(String idToken) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _authService.loginWithGoogle(idToken);
      final accessToken = await _authService.getAccessToken();
      state = state.copyWith(isLoggedIn: true, userToken: accessToken, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      rethrow;
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);
    try {
      await _authService.logout();
      state = state.copyWith(isLoggedIn: false, userToken: null);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    } finally {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> register(String email, String password, String fullName) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _authService.register(email, password, fullName);
      final accessToken = await _authService.getAccessToken();
      state = state.copyWith(isLoggedIn: true, userToken: accessToken, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      rethrow;
    }
  }
}

enum AuthStatus { authenticated, unauthenticated, loading }

class AuthState {
  final bool isLoggedIn;
  final String? userToken;
  final bool isLoading;
  final String? error;

  AuthState({
    required this.isLoggedIn,
    this.userToken,
    required this.isLoading,
    this.error,
  });

  factory AuthState.initial() => AuthState(
        isLoggedIn: false,
        isLoading: false,
      );

  AuthState copyWith({
    bool? isLoggedIn,
    String? userToken,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      isLoggedIn: isLoggedIn ?? this.isLoggedIn,
      userToken: userToken ?? this.userToken,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

// We need to add DioClient provider
final dioClientProvider = Provider<DioClient>((ref) {
  return DioClient();
});