import 'package:customer_mobile/features/payment/data/datasource/payment_remote_data_source.dart';
import 'package:customer_mobile/features/payment/domain/repository/payment_repository.dart';
import 'package:customer_mobile/shared/models/payment.dart';

class PaymentRepositoryImpl implements PaymentRepository {
  final PaymentRemoteDataSource _remoteDataSource;

  PaymentRepositoryImpl(this._remoteDataSource);

  @override
  Future<Payment> initiatePayment(Map<String, dynamic> paymentData) =>
      _remoteDataSource.initiatePayment(paymentData);

  @override
  Future<Payment> getPayment(String paymentId) =>
      _remoteDataSource.getPayment(paymentId);

  @override
  Future<Payment> refundPayment(String paymentId, double? amount) =>
      _remoteDataSource.refundPayment(paymentId, amount);

  @override
  Future<List<Payment>> getPaymentsByOrder(String orderId) =>
      _remoteDataSource.getPaymentsByOrder(orderId);

  @override
  Future<List<Payment>> getUserPayments(String? userId) =>
      _remoteDataSource.getUserPayments(userId);
}
