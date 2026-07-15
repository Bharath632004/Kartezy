import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:kartezy_core/services/auth_service.dart';
import 'package:kartezy_core/storage/secure_storage.dart';

/// State for authentication
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

/// Notifier for authentication state
class AuthNotifier extends StateNotifier<AuthState> {
  final Ref _ref;
  StreamSubscription? _authSubscription;

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

    // Listen to auth state changes
    _authSubscription = authService.authStateChanges.listen((isAuthenticated) {
      final userId = authService.getUserId();
      final token = authService.getAccessToken();
      final refreshToken = authService.getRefreshToken();
      state = state.copyWith(
        isAuthenticated: isAuthenticated,
        userId: userId,
        token: token,
        refreshToken: refreshToken,
      );
    });
  }

  Future<void> loginWithEmail(String email, String password) async {
    try {
      final authRepository = _ref.read(authRepositoryProvider);
      final user = await authRepository.login(email, password);
      await _updateAuthState(user);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> sendOtp(String phoneNumber) async {
    try {
      final authRepository = _ref.read(authRepositoryProvider);
      await authRepository.sendOtp(phoneNumber);
      // Note: We don't update auth state here because we don't have a user yet.
      // We might want to store that an OTP has been sent for this phone number.
    } catch (e) {
      rethrow;
    }
  }

  Future<void> verifyOtp(String phoneNumber, String otp) async {
    try {
      final authRepository = _ref.read(authRepositoryProvider);
      final user = await authRepository.verifyOtp(phoneNumber, otp);
      await _updateAuthState(user);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> register(
    String email,
    String password,
    Map<String, dynamic> profileData,
  ) async {
    try {
      final authRepository = _ref.read(authRepositoryProvider);
      // Assuming the authRepository has a register method; if not, we need to add it.
      final user = await authRepository.register(email, password, profileData);
      await _updateAuthState(user);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    final authService = _ref.read(authServiceProvider);
    await authService.logout();
    // State will be updated via the authStateChanges listener
  }

  Future<void> _updateAuthState(dynamic user) async {
    final authService = _ref.read(authServiceProvider);
    await authService.saveTokens(
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    );
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

  @override
  void dispose() {
    _authSubscription?.cancel();
    super.dispose();
  }
}

/// Provider for auth notifier
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});
