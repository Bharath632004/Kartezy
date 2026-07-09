import 'package:customer_mobile/features/refund/data/datasource/refund_remote_data_source.dart';
import 'package:customer_mobile/core/network/dio_client.dart';
import 'package:dio/dio.dart';

class RefundRemoteDataSourceImpl implements RefundRemoteDataSource {
  final DioClient dioClient;

  RefundRemoteDataSourceImpl(this.dioClient);

  @override
  Future<Map<String, dynamic>> getRefundStatus(String orderId) async {
    final response = await dioClient.dio.get('/refund/$orderId');
    return response.data;
  }

  @override
  Future<Map<String, dynamic>> requestRefund(String orderId, String reason) async {
    final response = await dioClient.dio.post(
      '/refund/request',
      data: {
        'orderId': orderId,
        'reason': reason,
      },
    );
    return response.data;
  }
}