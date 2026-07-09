import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../api/dio_client.dart';
import '../../api/api_constants.dart';

final reportsServiceProvider = Provider<ReportsService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return ReportsService(dioClient);
});

class ReportsService {
  final DioClient _dioClient;

  ReportsService(this._dioClient);

  Dio get _dio => _dioClient.instance;

  // Daily Report
  Future<Map<String, dynamic>> getDailyReport({
    String? date,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.reportsDaily}',
        queryParameters: {
          'date': date,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch daily report: $e');
    }
  }

  // Weekly Report
  Future<Map<String, dynamic>> getWeeklyReport({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.reportsWeekly}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch weekly report: $e');
    }
  }

  // Monthly Report
  Future<Map<String, dynamic>> getMonthlyReport({
    String? month, // Format: YYYY-MM
    String? year,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.reportsMonthly}',
        queryParameters: {
          'month': month,
          'year': year,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch monthly report: $e');
    }
  }

  // Yearly Report
  Future<Map<String, dynamic>> getYearlyReport({
    String? year,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.reportsYearly}',
        queryParameters: {
          'year': year,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch yearly report: $e');
    }
  }

  // Inventory Report
  Future<Map<String, dynamic>> getInventoryReport({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.reportsInventory}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch inventory report: $e');
    }
  }

  // Product Report
  Future<Map<String, dynamic>> getProductReport({
    String? productId,
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.reportsProduct}',
        queryParameters: {
          'product_id': productId,
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch product report: $e');
    }
  }

  // Sales Report
  Future<Map<String, dynamic>> getSalesReport({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.reportsSales}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch sales report: $e');
    }
  }

  // Financial Report
  Future<Map<String, dynamic>> getFinancialReport({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.reportsFinancial}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch financial report: $e');
    }
  }

  // Refund Report
  Future<Map<String, dynamic>> getRefundReport({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.reportsRefund}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch refund report: $e');
    }
  }

  // Settlement Report
  Future<Map<String, dynamic>> getSettlementReport({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.reportsSettlement}',
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
        }.where((_, value) => value != null).toMap(),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch settlement report: $e');
    }
  }
}