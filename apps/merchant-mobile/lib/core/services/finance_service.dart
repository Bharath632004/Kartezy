import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/api/dio_client.dart';
import 'package:merchant_mobile/core/api/api_constants.dart';

final financeServiceProvider = Provider<FinanceService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return FinanceService(dioClient);
});

class FinanceService {
  final DioClient _dioClient;

  FinanceService(this._dioClient);

  Dio get _dio => _dioClient.instance;

  // Revenue
  Future<Map<String, dynamic>> getRevenue({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financeRevenue,
        queryParameters: {'start_date': startDate, 'end_date': endDate}
          ..removeWhere((key, value) => value == null),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch revenue: $e');
    }
  }

  // Sales Summary
  Future<Map<String, dynamic>> getSalesSummary({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financeSalesSummary,
        queryParameters: {'start_date': startDate, 'end_date': endDate}
          ..removeWhere((key, value) => value == null),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch sales summary: $e');
    }
  }

  // Settlement History
  Future<List<Map<String, dynamic>>> getSettlementHistory({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financeSettlementHistory,
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }..removeWhere((key, value) => value == null),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch settlement history: $e');
    }
  }

  // Pending Settlements
  Future<List<Map<String, dynamic>>> getPendingSettlements({
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financePendingSettlements,
        queryParameters: {'page': page, 'limit': limit}
          ..removeWhere((key, value) => value == null),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch pending settlements: $e');
    }
  }

  // Wallet Balance
  Future<Map<String, dynamic>> getWalletBalance() async {
    try {
      final response = await _dio.get(ApiConstants.financeWalletBalance);
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch wallet balance: $e');
    }
  }

  // Commission Details
  Future<Map<String, dynamic>> getCommissionDetails({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financeCommissionDetails,
        queryParameters: {'start_date': startDate, 'end_date': endDate}
          ..removeWhere((key, value) => value == null),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch commission details: $e');
    }
  }

  // Transaction History
  Future<List<Map<String, dynamic>>> getTransactionHistory({
    String? startDate,
    String? endDate,
    String? type,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financeTransactionHistory,
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'type': type,
          'page': page,
          'limit': limit,
        }..removeWhere((key, value) => value == null),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch transaction history: $e');
    }
  }

  // Refund History
  Future<List<Map<String, dynamic>>> getRefundHistory({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financeRefundHistory,
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }..removeWhere((key, value) => value == null),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch refund history: $e');
    }
  }

  // Tax Summary
  Future<Map<String, dynamic>> getTaxSummary({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financeTaxSummary,
        queryParameters: {'start_date': startDate, 'end_date': endDate}
          ..removeWhere((key, value) => value == null),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch tax summary: $e');
    }
  }

  // GST Reports
  Future<Map<String, dynamic>> getGstReports({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financeGstReports,
        queryParameters: {'start_date': startDate, 'end_date': endDate}
          ..removeWhere((key, value) => value == null),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch GST reports: $e');
    }
  }

  // Profit & Loss
  Future<Map<String, dynamic>> getProfitLoss({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financeProfitLoss,
        queryParameters: {'start_date': startDate, 'end_date': endDate}
          ..removeWhere((key, value) => value == null),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch profit & loss: $e');
    }
  }

  // Payout History
  Future<List<Map<String, dynamic>>> getPayoutHistory({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financePayoutHistory,
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }..removeWhere((key, value) => value == null),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch payout history: $e');
    }
  }

  // Bank Transfers
  Future<List<Map<String, dynamic>>> getBankTransfers({
    String? startDate,
    String? endDate,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.financeBankTransfers,
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'page': page,
          'limit': limit,
        }..removeWhere((key, value) => value == null),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch bank transfers: $e');
    }
  }

  // Payment Status
  Future<Map<String, dynamic>> getPaymentStatus({String? transactionId}) async {
    try {
      final response = await _dio.get(
        ApiConstants.financePaymentStatus,
        queryParameters: {'transaction_id': transactionId}
          ..removeWhere((key, value) => value == null),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch payment status: $e');
    }
  }
}
