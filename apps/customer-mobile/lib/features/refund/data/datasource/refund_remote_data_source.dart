
abstract class RefundRemoteDataSource {
  Future<Map<String, dynamic>> getRefundStatus(String orderId);
  Future<Map<String, dynamic>> requestRefund(String orderId, String reason);
}