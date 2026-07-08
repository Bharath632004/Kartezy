// lib/features/authentication/domain/usecase/send_otp_usecase.dart
import 'package:customer_mobile/features/authentication/domain/repository/auth_repository.dart';
import 'package:customer_mobile/shared/models/user.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SendOtpUseCase {
  final AuthRepository _repository;

  SendOtpUseCase(this._repository);

  Future<User> call(String phoneNumber) {
    return _repository.sendOtp(phoneNumber);
  }
}

/// Provider for send OTP use case
final sendOtpUseCaseProvider = Provider<SendOtpUseCase>((ref) {
  final repository = ref.read(authRepositoryProvider);
  return SendOtpUseCase(repository);
});