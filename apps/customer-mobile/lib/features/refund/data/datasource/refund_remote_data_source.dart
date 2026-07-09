import 'package:customer_mobile/core/network/dio_client.dart';

abstract class RefundRemoteDataSource {
  Future<Map<String, dynamic>> getRefundStatus(String orderId);
  Future<Map<String, dynamic>> requestRefund(String orderId, String reason);
}