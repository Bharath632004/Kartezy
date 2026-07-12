import 'package:customer_mobile/features/refund/data/datasource/refund_remote_data_source.dart';
import 'package:dio/dio.dart';

class RefundRemoteDataSourceImpl implements RefundRemoteDataSource {
  final Dio dio;

  RefundRemoteDataSourceImpl(this.dio);

  @override
  Future<Map<String, dynamic>> getRefundStatus(String orderId) async {
    final response = await dio.get('/refund/$orderId');
    return response.data;
  }

  @override
  Future<Map<String, dynamic>> requestRefund(
    String orderId,
    String reason,
  ) async {
    final response = await dio.post(
      '/refund/request',
      data: {'orderId': orderId, 'reason': reason},
    );
    return response.data;
  }
}
