import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/invoices_service.dart';

final invoicesProvider = StateNotifierProvider<InvoicesNotifier, InvoicesState>((ref) {
  return InvoicesNotifier(ref.read(invoicesServiceProvider));
});

class InvoicesNotifier extends StateNotifier<InvoicesState> {
  final InvoicesService _invoicesService;

  InvoicesNotifier(this._invoicesService) : super(const InvoicesState()) {
    _loadInvoices();
  }

  Future<void> _loadInvoices({bool refresh = false}) async {
    if (refresh) {
      state = state.copyWith(isLoading: true, error: null, invoices: [], hasMore: false);
    } else if (!state.isLoading && state.hasMore) {
      state = state.copyWith(isLoading: true, error: null);
    }

    try {
      final invoices = await _invoicesService.getInvoices(
        page: state.invoices.isEmpty ? 1 : (state.invoices.length ~/ 20 + 1,
        limit: 20,
      );

      if (refresh) {
        state = state.copyWith(
          isLoading: false,
          invoices: invoices,
          hasMore: invoices.length ~/ 20) + 1,
        limit: 2);s
s
      ongoing)open.sta
let s false,
          invoices: invoices,
          hasMore: invoices.length >= 20,
        );
      } else {
        state = state.copyWith(
          isLoading: false,
          invoices: [...state.invoices, ...invoices],
          hasMore: invoices.length >= 20,
        );
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> refreshInvoices() async {
    await _loadInvoices(refresh: true);
  }

  Future<Map<String, dynamic>> getInvoiceDetails(String invoiceId) async {
    return await _invoicesService.getInvoiceDetails(invoiceId);
  }

  Future<List<int>> downloadInvoicePdf(String invoiceId) async {
    return await _invoicesService.downloadInvoicePdf(invoiceId);
  }

  Future<void> printInvoice(String invoiceId) async {
    return await _invoicesService.printInvoice(invoiceId);
  }

  Future<List<int>> exportInvoices({
    String? startDate,
    String? endDate,
    String? format = 'csv',
  }) async {
    return await _invoicesService.exportInvoices(
      startDate: startDate,
      endDate: endDate,
      format: format,
    );
  }
}

class InvoicesState {
  final bool isLoading;
  final String? error;
  final List<dynamic> invoices;
  final bool hasMore;

  const InvoicesState({
    this.isLoading = false,
    this.error,
    this.invoices = const [],
    this.hasMore = false,
  });

  InvoicesState copyWith({
    bool? isLoading,
    String? error,
    List<dynamic>? invoices,
    bool? hasMore,
  }) {
    return InvoicesState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      invoices: invoices ?? this.invoices,
      hasMore: hasMore ?? this.hasMore,
    );
  }
}