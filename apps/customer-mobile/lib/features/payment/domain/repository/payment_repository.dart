import 'package:customer_mobile/shared/models/payment.dart';

abstract class PaymentRepository {
  Future<Payment> initiatePayment(Map<String, dynamic> paymentData);
  Future<Payment> getPayment(String paymentId);
  Future<Payment> refundPayment(String paymentId, double? amount);
  Future<List<Payment>> getPaymentsByOrder(String orderId);
  Future<List<Payment>> getUserPayments(String? userId);
}