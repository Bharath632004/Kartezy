// lib/features/order/provider/provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/order/data/datasource/order_remote_data_source.dart';
import 'package:customer_mobile/features/order/data/repository/order_repository_impl.dart';
import 'package:customer_mobile/features/order/domain/repository/order_repository.dart';
import 'package:customer_mobile/features/order/domain/usecase/cancel_order_usecase.dart';
import 'package:customer_mobile/features/order/domain/usecase/get_order_usecase.dart';
import 'package:customer_mobile/features/order/domain/usecase/get_user_orders_usecase.dart';
import 'package:customer_mobile/features/order/domain/usecase/place_order_usecase.dart';
import 'package:customer_mobile/shared/models/order.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

// Providers for data source and repository
final orderRemoteDataSourceProvider = Provider<OrderRemoteDataSource>((ref) {
  final dioClient = ref.read(dioProvider);
  return OrderRemoteDataSourceImpl(dioClient);
});

final orderRepositoryProvider = Provider<OrderRepository>((ref) {
  final remoteDataSource = ref.read(orderRemoteDataSourceProvider);
  return OrderRepositoryImpl(remoteDataSource);
});

// Providers for use cases
final placeOrderUseCaseProvider = Provider<PlaceOrderUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return PlaceOrderUseCase(repository);
});

final getOrderUseCaseProvider = FutureProvider.family<Order, String>((
  ref,
  orderId,
) async {
  final repository = ref.read(orderRepositoryProvider);
  final useCase = GetOrderUseCase(repository);
  return await useCase(orderId);
});

final getUserOrdersUseCaseProvider = Provider<GetUserOrdersUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return GetUserOrdersUseCase(repository);
});

final cancelOrderUseCaseProvider = Provider<CancelOrderUseCase>((ref) {
  final repository = ref.read(orderRepositoryProvider);
  return CancelOrderUseCase(repository);
});

// State notifier for order state (if needed)
// We might not need a complex state notifier for order, but we can create one for managing order operations.
// For now, we'll keep it simple and use the use cases directly in the UI via providers.
// If we need to manage a list of orders or loading states, we can create a state notifier.

// Example: OrderStateNotifier for managing a list of user orders.
class OrderState {
  final List<Order> orders;
  final bool isLocked; // Add other fields if needed
  final bool isLoading;
  final String? errorMessage;

  const OrderState({
    this.orders = const [],
    this.isLocked = false,
    this.isLoading = false,
    this.errorMessage,
  });

  OrderState copyWith({
    List<Order>? orders,
    bool? isLocked,
    bool? isLoading,
    String? errorMessage,
  }) {
    return OrderState(
      orders: orders ?? this.orders,
      isLocked: isLocked ?? this.isLocked,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class OrderNotifier extends StateNotifier<OrderState> {
  final GetUserOrdersUseCase _getUserOrdersUseCase;
  final PlaceOrderUseCase _placeOrderUseCase;
  final CancelOrderUseCase _cancelOrderUseCase;

  OrderNotifier({
    required this._getUserOrdersUseCase,
    required this._placeOrderUseCase,
    required this._cancelOrderUseCase,
  }) : super(const OrderState());

  Future<void> fetchUserOrders(String? userId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final orders = await _getUserOrdersUseCase(userId);
      state = state.copyWith(orders: orders, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> placeOrder(Map<String, dynamic> orderData) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final order = await _placeOrderUseCase(orderData);
      // Optionally, add the new order to the list
      state = state.copyWith(
        orders: [...state.orders, order],
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> cancelOrder(String orderId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final order = await _cancelOrderUseCase(orderId);
      // Update the order in the list
      final updatedOrders = state.orders
          .map((o) => o.id == orderId ? order : o)
          .toList();
      state = state.copyWith(orders: updatedOrders, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

// Provider for the OrderNotifier
final orderProvider = StateNotifierProvider<OrderNotifier, OrderState>((ref) {
  return OrderNotifier(
    getUserOrdersUseCase: ref.read(getUserOrdersUseCaseProvider),
    placeOrderUseCase: ref.read(placeOrderUseCaseProvider),
    cancelOrderUseCase: ref.read(cancelOrderUseCaseProvider),
  );
});
