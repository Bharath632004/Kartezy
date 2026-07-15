import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/api/dio_client.dart';
import 'package:merchant_mobile/core/api/api_constants.dart';

final invoicesServiceProvider = Provider<InvoicesService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return InvoicesService(dioClient);
});

class InvoicesService {
  final DioClient _dioClient;

  InvoicesService(this._dioClient);

  Dio get _dio => _dioClient.instance;

  // Get Invoices List
  Future<List<Map<String, dynamic>>> getInvoices({
    String? startDate,
    String? endDate,
    String? status,
    int? page,
    int limit = 20,
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.invoicesList,
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'status': status,
          'page': page,
          'limit': limit,
        }..removeWhere((key, value) => value == null),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => json as Map<String, dynamic>).toList();
    } catch (e) {
      throw Exception('Failed to fetch invoices: $e');
    }
  }

  // Get Invoice Details
  Future<Map<String, dynamic>> getInvoiceDetails(String invoiceId) async {
    try {
      final response = await _dio.get(
        ApiConstants.invoicesDetail.replaceAll(
          '{id}',
          invoiceId,
        ),
      );
      return response.data;
    } catch (e) {
      throw Exception('Failed to fetch invoice details: $e');
    }
  }

  // Download Invoice PDF
  Future<List<int>> downloadInvoicePdf(String invoiceId) async {
    try {
      final response = await _dio.get(
        ApiConstants.invoicesDownloadPdf.replaceAll(
          '{id}',
          invoiceId,
        ),
        options: Options(responseType: ResponseType.bytes),
      );
      return response.data as List<int>;
    } catch (e) {
      throw Exception('Failed to download invoice PDF: $e');
    }
  }

  // Print Invoice (assuming it returns a printable format or just opens print dialog)
  Future<void> printInvoice(String invoiceId) async {
    try {
      await _dio.get(
        ApiConstants.invoicesPrint.replaceAll(
          '{id}',
          invoiceId,
        ),
      );
      // In a real app, this might trigger a print dialog or return data for printing.
      // For now, we just call the endpoint.
    } catch (e) {
      throw Exception('Failed to print invoice: $e');
    }
  }

  // Export Invoices
  Future<List<int>> exportInvoices({
    String? startDate,
    String? endDate,
    String? format = 'csv', // or pdf, excel
  }) async {
    try {
      final response = await _dio.get(
        ApiConstants.invoicesExport,
        queryParameters: {
          'start_date': startDate,
          'end_date': endDate,
          'format': format,
        }..removeWhere((key, value) => value == null),
        options: Options(responseType: ResponseType.bytes),
      );
      return response.data as List<int>;
    } catch (e) {
      throw Exception('Failed to export invoices: $e');
    }
  }
}
