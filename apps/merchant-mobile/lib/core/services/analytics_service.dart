import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../api/dio_client.dart';
import '../../api/api_constants.dart';

final analyticsServiceProvider = Provider<AnalyticsService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return AnalyticsService(dioClient);
});

class AnalyticsService {
  final DioClient _dioClient;

  AnalyticsService(this._dioClient);

  Dio get _dio => _dioClient.instance;

  // Revenue Analytics
  Future<Map<String, dynamic>> getRevenueAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsRevenue}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch revenue analytics: $e');
    }
  }

  // Orders Analytics
  Future<Map<String, dynamic>> getOrdersAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsOrders}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch orders analytics: $e');
    }
  }

  // Customers Analytics
  Future<Map<String, dynamic>> getCustomersAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsCustomers}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch customers analytics: $e');
    }
  }

  // Products Analytics
  Future<Map<String, dynamic>> getProductsAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsProducts}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch products analytics: $e');
    }
  }

  // Inventory Analytics
  Future<Map<String, dynamic>> getInventoryAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsInventory}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch inventory analytics: $e');
    }
  }

  // Delivery Performance Analytics
  Future<Map<String, dynamic>> getDeliveryPerformanceAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsDeliveryPerformance}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch delivery performance analytics: $e');
    }
  }

  // Conversion Rate Analytics
  Future<Map<String, dynamic>> getConversionRateAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsConversionRate}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch conversion rate analytics: $e');
    }
  }

  // Average Order Value Analytics
  Future<Map<String, dynamic>> getAverageOrderValueAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsAverageOrderValue}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch average order value analytics: $e');
    }
  }

  // Customer Retention Analytics
  Future<Map<String, dynamic>> getCustomerRetentionAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsCustomerRetention}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch customer retention analytics: $e');
    }
  }

  // Repeat Customers Analytics
  Future<Map<String, dynamic>> getRepeatCustomersAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsRepeatCustomers}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch repeat customers analytics: $e');
    }
  }

  // Best Sellers Analytics
  Future<List<Map<String, dynamic>>> getBestSellersAnalytics({
    String? startDate,
    String? endDate,
    int? limit,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsBestSellers}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'limit': limit,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch best sellers analytics: $e');
    }
  }

  // Worst Sellers Analytics
  Future<List<Map<String, dynamic>>> getWorstSellersAnalytics({
    String? startDate,
    String? endDate,
    int? limit,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsWorstSellers}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'limit': limit,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch worst sellers analytics: $e');
    }
  }

  // Peak Hours Analytics
  Future<Map<String, dynamic>> getPeakHoursAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsPeakHours}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch peak hours analytics: $e');
    }
  }

  // Sales by Category Analytics
  Future<List<Map<String, dynamic>>> getSalesByCategoryAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsSalesByCategory}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch sales by category analytics: $e');
    }
  }

  // Sales by Brand Analytics
  Future<List<Map<String, dynamic>>> getSalesByBrandAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsSalesByBrand}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch sales by brand analytics: $e');
    }
  }

  // Sales by City Analytics
  Future<List<Map<String, dynamic>>> getSalesByCityAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsSalesByCity}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch sales by city analytics: $e');
    }
  }

  // Sales by Store Analytics
  Future<List<Map<String, dynamic>>> getSalesByStoreAnalytics({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.analyticsSalesByStore}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch sales by store analytics: $e');
    }
  }
}