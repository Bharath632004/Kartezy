// lib/features/order_management/data/datasource/order_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:kartezy_core/network/api_constants.dart';
import 'package:delivery_mobile/shared/models/order.dart';
import 'package:delivery_mobile/shared/models/order_timeline.dart';
class OrderRemoteDataSource {
  final Dio _dio;

  OrderRemoteDataSource(this._dio);

  Future<List<Order>> getAvailableOrders() async {
    final response = await _dio.get('${ApiConstants.order}/available');
    return (response.data as List)
        .map((json) => Order.fromJson(json))
        .toList();
  }

  Future<Order> acceptOrder(String orderId) async {
    final response =
        await _dio.post('${ApiConstants.order}/$orderId/accept');
    return Order.fromJson(response.data);
  }

  Future<Order> rejectOrder(String orderId, String reason) async {
    final response = await _dio.post(
      '${ApiConstants.order}/$orderId/reject',
      data: {'reason': reason},
    );
    return Order.fromJson(response.data);
  }

  Future<Order> pickupOrder(String orderId, String otp) async {
    final response = await _dio.post(
      '${ApiConstants.order}/$orderId/pickup',
      data: {'otp': otp},
    );
    return Order.fromJson(response.data);
  }

  Future<Order> verifyOtp(String orderId, String otp) async {
    final response = await _dio.post(
      '${ApiConstants.order}/$orderId/verify-otp',
      data: {'otp': otp},
    );
    return Order.fromJson(response.data);
  }

  Future<Order> deliverOrder(String orderId) async {
    final response =
        await _dio.post('${ApiConstants.order}/$orderId/deliver');
    return Order.fromJson(response.data);
  }

  Future<Order> submitProofOfDelivery(
      String orderId,
      String? signature,
      List<String>? photos,
      String? notes) async {
    final response = await _dio.post(
      '${ApiConstants.order}/$orderId/proof-of-delivery',
      data: {
        'signature': signature,
        'photos': photos,
        'notes': notes,
      },
    );
    return Order.fromJson(response.data);
  }

  Future<List<Order>> getOrderHistory({
    int? page,
    int? limit,
    String? status,
  }) async {
    final response = await _dio.get(
      '${ApiConstants.order}/history',
      queryParameters: {
        'page': page,
        'limit': limit,
        'status': status,
      }..removeWhere((key, value) => value == null),
    );
    return (response.data['data'] as List)
        .map((json) => Order.fromJson(json))
        .toList();
  }

  Future<List<OrderTimeline>> getOrderTimeline(String orderId) async {
    final response =
        await _dio.get('${ApiConstants.order}/$orderId/timeline');
    return (response.data as List)
        .map((json) => OrderTimeline.fromJson(json))
        .toList();
  }
}

