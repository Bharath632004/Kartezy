// lib/features/authentication/domain/repository/auth_repository.dart
import 'package:customer_mobile/shared/models/user.dart';
import 'package:customer_mobile/features/authentication/domain/models/login_response.dart';

abstract class AuthRepository {
  Future<LoginResponse> login(String email, String password);
  Future<void> logout();
  Future<String?> getCurrentUserId();
  Future<User> refreshToken(String refreshToken);
  Future<User> sendOtp(String phoneNumber);
  Future<User> verifyOtp(String phoneNumber, String otp);
}
