import 'package:freezed_annotation/freezed_annotation.dart';

part 'payment.freezed.dart';
part 'payment.g.dart';

@freezed
class Payment with _$Payment {
  const factory Payment({
    required String id,
    required String orderId,
    required String userId,
    required double amount,
    required String currency,
    required String paymentMethod,
    required String paymentStatus,
    required String? transactionId,
    required String? gatewayResponse,
    required DateTime initiatedAt,
    required DateTime? completedAt,
    required bool isEscrow,
  }) = _Payment;

  factory Payment.fromJson(Map<String, dynamic> json) =>
      _$PaymentFromJson(json);
}
