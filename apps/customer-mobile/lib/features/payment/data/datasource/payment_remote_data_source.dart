import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:customer_mobile/shared/models/payment.dart';
import 'package:dio/dio.dart';

abstract class PaymentRemoteDataSource {
  Future<Payment> initiatePayment(Map<String, dynamic> paymentData);
  Future<Payment> getPayment(String paymentId);
  Future<Payment> refundPayment(String paymentId, double? amount);
  Future<List<Payment>> getPaymentsByOrder(String orderId);
  Future<List<Payment>> getUserPayments(String? userId);
}

class PaymentRemoteDataSourceImpl implements PaymentRemoteDataSource {
  final DioClient _dioClient;

  PaymentRemoteDataSourceImpl(this._dioClient);

  @override
  Future<Payment> initiatePayment(Map<String, dynamic> paymentData) async {
    final response = await _dioClient.post('/payments', data: paymentData);
    return Payment.fromJson(response.data);
  }

  @override
  Future<Payment> getPayment(String paymentId) async {
    final response = await _dioClient.get('/payments/$paymentId');
    return Payment.fromJson(response.data);
  }

  @override
  Future<Payment> refundPayment(String paymentId, double? amount) async {
    final response = await _dioClient.post(
      '/payments/$paymentId/refund',
      data: {'amount': amount},
    );
    return Payment.fromJson(response.data);
  }

  @override
  Future<List<Payment>> getPaymentsByOrder(String orderId) async {
    final response = await _dioClient.get(
      '/payments',
      queryParameters: {'orderId': orderId},
    );
    final List<dynamic> data = response.data;
    return data.map((json) => Payment.fromJson(json)).toList();
  }

  @override
  Future<List<Payment>> getUserPayments(String? userId) async {
    final response = await _dioClient.get(
      '/payments/user',
      queryParameters: {'userId': userId},
    );
    final List<dynamic> data = response.data;
    return data.map((json) => Payment.fromJson(json)).toList();
  }
}