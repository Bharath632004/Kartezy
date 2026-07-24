import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/services/auth_service.dart';
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

  /// Returns a [LoginResult] indicating success and whether MFA is required.
  Future<LoginResult> loginWithEmail(String email, String password) async {
    try {
      final dio = _ref.read(dioProvider);
      final response = await dio.post(
        ApiConstants.deliveryPartnerAuthLogin,
        data: {'email': email, 'password': password},
      );
      final data = response.data as Map<String, dynamic>;
      
      // Check if MFA is required
      final bool mfaRequired = data['mfaRequired'] == true ||
          data['mfa_required'] == true;
      
      if (mfaRequired) {
        // Don't save tokens yet - require MFA verification first
        final mfaSessionToken = data['mfaSessionToken'] as String? ??
            data['mfa_session_token'] as String?;
        return LoginResult(
          success: true,
          mfaRequired: true,
          email: email,
          mfaSessionToken: mfaSessionToken ?? '',
        );
      }
      
      final authService = _ref.read(authServiceProvider);
      await authService.saveTokens(
        accessToken: data['accessToken'] as String? ??
            data['access_token'] as String?,
        refreshToken: data['refreshToken'] as String? ??
            data['refresh_token'] as String?,
      );
      await _refreshState();
      return LoginResult(success: true);
    } catch (e) {
      return LoginResult(success: false, error: e.toString());
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

  Future<bool> verifyOtp(String phoneNumber, String otp) async {
    try {
      final dio = _ref.read(dioProvider);
      final response = await dio.post(
        ApiConstants.deliveryPartnerAuthVerifyOtp,
        data: {'phone_number': phoneNumber, 'otp': otp},
      );
      final data = response.data as Map<String, dynamic>;
      final authService = _ref.read(authServiceProvider);
      await authService.saveTokens(
        accessToken: data['accessToken'] as String? ??
            data['access_token'] as String?,
        refreshToken: data['refreshToken'] as String? ??
            data['refresh_token'] as String?,
      );
      await _refreshState();
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    final authService = _ref.read(authServiceProvider);
    await authService.logout();
    state = const AuthState(isAuthenticated: false);
  }

  Future<void> completeMfaLogin({required String email, required String token}) async {
    final authService = _ref.read(authServiceProvider);
    await authService.saveTokens(accessToken: token);
    await _refreshState();
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

/// Result of a login attempt indicating success and whether MFA is required.
class LoginResult {
  final bool success;
  final bool mfaRequired;
  final String? email;
  final String? mfaSessionToken;
  final String? error;

  const LoginResult({
    required this.success,
    this.mfaRequired = false,
    this.email,
    this.mfaSessionToken,
    this.error,
  });
}
