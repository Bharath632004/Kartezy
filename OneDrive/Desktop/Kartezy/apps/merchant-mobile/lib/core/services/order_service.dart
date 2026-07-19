import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/api/dio_client.dart';
import 'package:merchant_mobile/core/api/api_constants.dart';

final orderServiceProvider = Provider<OrderService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return OrderService(dioClient);
});

class OrderService {
  final DioClient _dioClient;

  OrderService(this._dioClient);

  Dio get _dio => _dioClient.instance;

  Future<List<Map<String, dynamic>>> getOrders({
    String? status,
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.merchantOrders,
        queryParameters: {
          'status': status,
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }..removeWhere((key, value) => value == null),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch orders: $e');
    }
  }

  Future<Map<String, dynamic>> getOrderById(String orderId) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.merchantOrders}/$orderId',
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch order: $e');
    }
  }

  Future<void> updateOrderStatus(String orderId, String status) async {
    try {
      await _dio.put(
        '${ApiConstants.merchantOrders}/$orderId/status',
        data: {'status': status},
      );
    } catch (e) {
      throw Exception('Failed to update order status: $e');
    }
  }
}
