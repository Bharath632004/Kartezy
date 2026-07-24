// lib/features/order_management/presentation/order_state_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/accept_order_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/get_available_orders_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/reject_order_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/deliver_order_use_case.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/pickup_order_use_case.dart';
import 'package:delivery_mobile/features/order_management/provider/provider.dart';
import 'package:delivery_mobile/shared/models/order.dart';

// Available Orders State
class AvailableOrdersState {
  final bool isLoading;
  final List<Order> orders;
  final String? error;

  const AvailableOrdersState({
    this.isLoading = false,
    this.orders = const [],
    this.error,
  });

  factory AvailableOrdersState.loading() =>
      const AvailableOrdersState(isLoading: true);

  factory AvailableOrdersState.success(List<Order> orders) =>
      AvailableOrdersState(isLoading: false, orders: orders);

  factory AvailableOrdersState.error(String error) =>
      AvailableOrdersState(isLoading: false, error: error);
}

class AvailableOrdersNotifier extends StateNotifier<AvailableOrdersState> {
  final GetAvailableOrdersUseCase _getAvailableOrders;
  final AcceptOrderUseCase _acceptOrder;
  final RejectOrderUseCase _rejectOrder;

  AvailableOrdersNotifier(
    this._getAvailableOrders,
    this._acceptOrder,
    this._rejectOrder,
  ) : super(const AvailableOrdersState()) {
    loadOrders();
  }

  Future<void> loadOrders() async {
    state = AvailableOrdersState.loading();
    try {
      final orders = await _getAvailableOrders.call();
      state = AvailableOrdersState.success(orders);
    } catch (e) {
      state = AvailableOrdersState.error(e.toString());
    }
  }

  Future<Order?> acceptOrder(String orderId) async {
    try {
      final order = await _acceptOrder.call(orderId);
      // Remove from available list
      state = AvailableOrdersState.success(
        state.orders.where((o) => o.id != orderId).toList(),
      );
      return order;
    } catch (e) {
      state = AvailableOrdersState.error('Failed to accept order: $e');
      return null;
    }
  }

  Future<bool> rejectOrder(String orderId, String reason) async {
    try {
      await _rejectOrder.call(orderId, reason);
      state = AvailableOrdersState.success(
        state.orders.where((o) => o.id != orderId).toList(),
      );
      return true;
    } catch (e) {
      state = AvailableOrdersState.error('Failed to reject order: $e');
      return false;
    }
  }
}

final availableOrdersProvider =
    StateNotifierProvider<AvailableOrdersNotifier, AvailableOrdersState>((ref) {
      return AvailableOrdersNotifier(
        ref.read(getAvailableOrdersUseCaseProvider),
        ref.read(acceptOrderUseCaseProvider),
        ref.read(rejectOrderUseCaseProvider),
      );
    });

// Active Delivery State
class ActiveDeliveryState {
  final bool isLoading;
  final Order? order;
  final String? error;
  final bool pickupComplete;
  final bool deliveryComplete;

  const ActiveDeliveryState({
    this.isLoading = false,
    this.order,
    this.error,
    this.pickupComplete = false,
    this.deliveryComplete = false,
  });

  factory ActiveDeliveryState.loading() =>
      const ActiveDeliveryState(isLoading: true);

  factory ActiveDeliveryState.loaded(Order order) =>
      ActiveDeliveryState(isLoading: false, order: order);

  factory ActiveDeliveryState.error(String error) =>
      ActiveDeliveryState(isLoading: false, error: error);

  ActiveDeliveryState copyWith({
    bool? isLoading,
    Order? order,
    String? error,
    bool? pickupComplete,
    bool? deliveryComplete,
  }) {
    return ActiveDeliveryState(
      isLoading: isLoading ?? this.isLoading,
      order: order ?? this.order,
      error: error,
      pickupComplete: pickupComplete ?? this.pickupComplete,
      deliveryComplete: deliveryComplete ?? this.deliveryComplete,
    );
  }
}

class ActiveDeliveryNotifier extends StateNotifier<ActiveDeliveryState> {
  final PickupOrderUseCase _pickupOrder;
  final DeliverOrderUseCase _deliverOrder;

  ActiveDeliveryNotifier(this._pickupOrder, this._deliverOrder)
    : super(const ActiveDeliveryState());

  void setOrder(Order order) {
    state = ActiveDeliveryState.loaded(order);
  }

  Future<bool> pickupOrder(String orderId, String otp) async {
    state = state.copyWith(isLoading: true);
    try {
      await _pickupOrder.call(orderId, otp);
      state = state.copyWith(isLoading: false, pickupComplete: true);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: 'Pickup failed: $e');
      return false;
    }
  }

  Future<bool> deliverOrder(String orderId) async {
    state = state.copyWith(isLoading: true);
    try {
      await _deliverOrder.call(orderId);
      state = state.copyWith(isLoading: false, deliveryComplete: true);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: 'Delivery failed: $e');
      return false;
    }
  }

  void clearError() {
    state = state.copyWith(error: null);
  }
}

final activeDeliveryProvider =
    StateNotifierProvider<ActiveDeliveryNotifier, ActiveDeliveryState>((ref) {
      return ActiveDeliveryNotifier(
        ref.read(pickupOrderUseCaseProvider),
        ref.read(deliverOrderUseCaseProvider),
      );
    });
