import 'package:freezed_annotation/freezed_annotation.dart';

part 'payment.freezed.dart';
part 'payment.g.dart';

@freezed
class Payment with _$Payment {
  const factory Payment({
    required String id,
    required String orderId,
    required String userId, // nullable for guest? but we'll assume userId is present after login
    required double amount,
    required String currency, // e.g., 'USD', 'INR'
    required String paymentMethod, // e.g., 'razorpay', 'cashfree', 'stripe', 'phonepe', 'google_pay', 'paytm', 'upi', 'credit_card', 'debit_card', 'net_banking', 'wallet', 'cod'
    required String paymentStatus, // e.g., 'pending', 'processing', 'success', 'failed', 'refunded', 'partially_refunded'
    required String? transactionId, // from the gateway
    required String? gatewayResponse, // raw response from gateway for logging
    required DateTime initiatedAt,
    required DateTime? completedAt,
    required bool isEscrow, // if applicable (for split payments)
  }) = _Payment;

  factory Payment.fromJson(Map<String, dynamic> json) => _$PaymentFromJson(json);
}