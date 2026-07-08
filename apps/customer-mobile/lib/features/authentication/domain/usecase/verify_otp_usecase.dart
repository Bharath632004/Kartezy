// lib/features/authentication/domain/usecase/verify_otp_usecase.dart
import 'package:customer_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:customer_mobile/shared/models/user.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class VerifyOtpUseCase {
  final AuthRepository _repository;

  VerifyOtpUseCase(this._repository);

  Future<User> call(String phoneNumber, String otp) {
    return _repository.verifyOtp(phoneNumber, otp);
  }
}

/// Provider for verify OTP use case
final verifyOtpUseCaseProvider = Provider<VerifyOtpUseCase>((ref) {
  final repository = ref.read(authRepositoryProvider);
  return VerifyOtpUseCase(repository);
});