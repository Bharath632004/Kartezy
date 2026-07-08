// lib/features/authentication/domain/repository/auth_repository.dart
import 'package:customer_mobile/shared/models/user.dart';

abstract class AuthRepository {
  Future<User> login(String email, String password);
  Future<void> logout();
  Future<String?> getCurrentUserId();
  Future<User> refreshToken(String refreshToken);
  Future<User> sendOtp(String phoneNumber);
  Future<User> verifyOtp(String phoneNumber, String otp);
}
