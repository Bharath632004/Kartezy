import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/api/dio_client.dart';
import 'package:merchant_mobile/core/api/api_constants.dart';

final promotionServiceProvider = Provider<PromotionService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return PromotionService(dioClient);
});

class PromotionService {
  final DioClient _dioClient;

  PromotionService(this._dioClient);

  Dio get _dio => _dioClient.instance;

  // Generic promotion methods
  Future<List<Map<String, dynamic>>> getPromotions({
    String? type,
    bool? isActive,
    String? search,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.promotionList,
        queryParameters: {
          'type': type,
          'is_active': isActive,
          'search': search,
          'page': page,
          'limit': limit,
        }..removeWhere((key, value) => value == null),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch promotions: $e');
    }
  }

  Future<Map<String, dynamic>> getPromotionById(String promotionId) async {
    try {
      final response = await _dio.get(
        ApiConstants.promotionDetail.replaceAll(
          '{id}',
          promotionId,
        ),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch promotion: $e');
    }
  }

  Future<Map<String, dynamic>> createPromotion(
    Map<String, dynamic> promotionData,
  ) async {
    try {
      final response = await _dio.post(
        ApiConstants.promotionCreate,
        data: promotionData,
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to create promotion: $e');
    }
  }

  Future<Map<String, dynamic>> updatePromotion(
    String promotionId,
    Map<String, dynamic> promotionData,
  ) async {
    try {
      final response = await _dio.put(
        ApiConstants.promotionUpdate.replaceAll(
          '{id}',
          promotionId,
        ),
        data: promotionData,
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to update promotion: $e');
    }
  }

  Future<void> deletePromotion(String promotionId) async {
    try {
      await _dio.delete(
        ApiConstants.promotionDelete.replaceAll(
          '{id}',
          promotionId,
        ),
      );
    } catch (e) {
      throw Exception('Failed to delete promotion: $e');
    }
  }

  // Specific promotion types (if needed, otherwise use generic with type parameter)
  Future<List<Map<String, dynamic>>> getCoupons({
    bool? isActive,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.promotionCoupons,
        queryParameters: {'is_active': isActive, 'page': page, 'limit': limit}
          ..removeWhere((key, value) => value == null),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch coupons: $e');
    }
  }

  // Add other specific types similarly if needed, but for brevity we'll use generic.
}
