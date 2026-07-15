import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/services/auth_service.dart';
import 'package:kartezy_core/storage/secure_storage.dart';
import 'package:kartezy_core/providers/network_provider.dart';
import 'package:kartezy_core/network/api_constants.dart';

class AuthState {
  final bool isAuthenticated;
  final String? userId;
  final String? token;
  final String? refreshToken;

  const AuthState({
    required this.isAuthenticated,
    this.userId,
    this.token,
    this.refreshToken,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    String? userId,
    String? token,
    String? refreshToken,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      userId: userId ?? this.userId,
      token: token ?? this.token,
      refreshToken: refreshToken ?? this.refreshToken,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final Ref _ref;

  AuthNotifier(this._ref) : super(const AuthState(isAuthenticated: false)) {
    _init();
  }

  Future<void> _init() async {
    final authService = _ref.read(authServiceProvider);
    final isLoggedIn = await authService.isLoggedIn();
    final userId = await authService.getUserId();
    final token = await authService.getAccessToken();
    final refreshToken = await authService.getRefreshToken();

    state = state.copyWith(
      isAuthenticated: isLoggedIn,
      userId: userId,
      token: token,
      refreshToken: refreshToken,
    );
  }

  Future<void> loginWithEmail(String email, String password) async {
    try {
      final dio = _ref.read(dioProvider);
      final response = await dio.post(
        ApiConstants.deliveryPartnerAuthLogin,
        data: {'email': email, 'password': password},
      );
      final authService = _ref.read(authServiceProvider);
      await authService.saveTokens(
        accessToken: response.data['access_token'] as String?,
        refreshToken: response.data['refresh_token'] as String?,
      );
      await _refreshState();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> sendOtp(String phoneNumber) async {
    try {
      final dio = _ref.read(dioProvider);
      await dio.post(
        ApiConstants.deliveryPartnerAuthSendOtp,
        data: {'phone_number': phoneNumber},
      );
    } catch (e) {
      rethrow;
    }
  }

  Future<void> verifyOtp(String phoneNumber, String otp) async {
    try {
      final dio = _ref.read(dioProvider);
      final response = await dio.post(
        ApiConstants.deliveryPartnerAuthVerifyOtp,
        data: {'phone_number': phoneNumber, 'otp': otp},
      );
      final authService = _ref.read(authServiceProvider);
      await authService.saveTokens(
        accessToken: response.data['access_token'] as String?,
        refreshToken: response.data['refresh_token'] as String?,
      );
      await _refreshState();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    final authService = _ref.read(authServiceProvider);
    await authService.logout();
    state = const AuthState(isAuthenticated: false);
  }

  Future<void> _refreshState() async {
    final authService = _ref.read(authServiceProvider);
    final userId = await authService.getUserId();
    final token = await authService.getAccessToken();
    final refreshToken = await authService.getRefreshToken();
    state = state.copyWith(
      isAuthenticated: true,
      userId: userId,
      token: token,
      refreshToken: refreshToken,
    );
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});
