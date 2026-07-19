import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/services/order_service.dart';

final orderProvider = StateNotifierProvider<OrderNotifier, OrderState>((ref) {
  return OrderNotifier(ref.read(orderServiceProvider));
});

class OrderState {
  final bool isLoading;
  final String? error;
  final List<Map<String, dynamic>> pendingOrders;
  final List<Map<String, dynamic>> processingOrders;
  final List<Map<String, dynamic>> deliveredOrders;
  final List<Map<String, dynamic>> cancelledOrders;

  const OrderState({
    this.isLoading = false,
    this.error,
    this.pendingOrders = const [],
    this.processingOrders = const [],
    this.deliveredOrders = const [],
    this.cancelledOrders = const [],
  });

  OrderState copyWith({
    bool? isLoading,
    String? error,
    List<Map<String, dynamic>>? pendingOrders,
    List<Map<String, dynamic>>? processingOrders,
    List<Map<String, dynamic>>? deliveredOrders,
    List<Map<String, dynamic>>? cancelledOrders,
  }) {
    return OrderState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      pendingOrders: pendingOrders ?? this.pendingOrders,
      processingOrders: processingOrders ?? this.processingOrders,
      deliveredOrders: deliveredOrders ?? this.deliveredOrders,
      cancelledOrders: cancelledOrders ?? this.cancelledOrders,
    );
  }
}

class OrderNotifier extends StateNotifier<OrderState> {
  final OrderService _orderService;

  OrderNotifier(this._orderService) : super(const OrderState()) {
    loadAllOrders();
  }

  Future<void> loadAllOrders() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final results = await Future.wait([
        _orderService.getOrders(status: 'pending'),
        _orderService.getOrders(status: 'processing'),
        _orderService.getOrders(status: 'delivered'),
        _orderService.getOrders(status: 'cancelled'),
      ]);

      state = OrderState(
        isLoading: false,
        pendingOrders: results[0],
        processingOrders: results[1],
        deliveredOrders: results[2],
        cancelledOrders: results[3],
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> updateStatus(String orderId, String status) async {
    try {
      await _orderService.updateOrderStatus(orderId, status);
      await loadAllOrders();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }
}
