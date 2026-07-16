// lib/features/order_management/domain/usecase/verify_otp_use_case.dart
import 'package:delivery_mobile/features/order_management/domain/repository/order_repository.dart';
import 'package:delivery_mobile/shared/models/order.dart';

class VerifyOtpUseCase {
  final OrderRepository _repository;

  VerifyOtpUseCase(this._repository);

  Future<Order> call(String orderId, String otp) =>
      _repository.verifyOtp(orderId, otp);
}
