// lib/features/order_management/presentation/order_history_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:delivery_mobile/features/order_management/provider/provider.dart';
import 'package:delivery_mobile/features/order_management/domain/usecase/get_order_history_use_case.dart';
import 'package:delivery_mobile/shared/models/order.dart';

// State for order history
class OrderHistoryState {
  final bool isLoading;
  final List<Order> orders;
  final String? error;

  const OrderHistoryState({
    this.isLoading = false,
    this.orders = const [],
    this.error,
  });

  factory OrderHistoryState.loading() => const OrderHistoryState(isLoading: true);

  factory OrderHistoryState.success(List<Order> orders) =>
      OrderHistoryState(isLoading: false, orders: orders);

  factory OrderHistoryState.error(String error) =>
      OrderHistoryState(isLoading: false, error: error);
}

class OrderHistoryNotifier extends StateNotifier<OrderHistoryState> {
  final GetOrderHistoryUseCase _getOrderHistory;

  OrderHistoryNotifier(this._getOrderHistory) : super(const OrderHistoryState()) {
    loadHistory();
  }

  Future<void> loadHistory({int? page, int? limit, String? status}) async {
    state = OrderHistoryState.loading();
    try {
      final orders = await _getOrderHistory.call(page: page, limit: limit, status: status);
      state = OrderHistoryState.success(orders);
    } catch (e) {
      state = OrderHistoryState.error(e.toString());
    }
  }
}

final orderHistoryProvider =
    StateNotifierProvider<OrderHistoryNotifier, OrderHistoryState>((ref) {
  return OrderHistoryNotifier(ref.read(getOrderHistoryUseCaseProvider));
});

class OrderHistoryPage extends ConsumerStatefulWidget {
  const OrderHistoryPage({super.key});

  @override
  ConsumerState<OrderHistoryPage> createState() => _OrderHistoryPageState();
}

class _OrderHistoryPageState extends ConsumerState<OrderHistoryPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final historyState = ref.watch(orderHistoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Order History'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(orderHistoryProvider.notifier).loadHistory(),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Today'),
            Tab(text: 'Weekly'),
            Tab(text: 'All Time'),
          ],
        ),
      ),
      body: _buildBody(historyState),
    );
  }

  Widget _buildBody(OrderHistoryState state) {
    if (state.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.red),
            const SizedBox(height: 16),
            Text('Error: ${state.error}'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => ref.read(orderHistoryProvider.notifier).loadHistory(),
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (state.orders.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.history, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              'No order history',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            SizedBox(height: 8),
            Text(
              'Your completed orders will appear here',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      );
    }

    final now = DateTime.now();
    final todayOrders = state.orders.where((o) =>
        o.createdAt.year == now.year &&
        o.createdAt.month == now.month &&
        o.createdAt.day == now.day).toList();

    final weekAgo = now.subtract(const Duration(days: 7));
    final weeklyOrders = state.orders.where((o) =>
        o.createdAt.isAfter(weekAgo)).toList();

    return TabBarView(
      controller: _tabController,
      children: [
        _buildOrderList(todayOrders),
        _buildOrderList(weeklyOrders),
        _buildOrderList(state.orders),
      ],
    );
  }

  Widget _buildOrderList(List<Order> orders) {
    if (orders.isEmpty) {
      return const Center(
        child: Text(
          'No orders for this period',
          style: TextStyle(color: Colors.grey, fontSize: 16),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => ref.read(orderHistoryProvider.notifier).loadHistory(),
      child: ListView.builder(
        padding: const EdgeInsets.all(8),
        itemCount: orders.length,
        itemBuilder: (context, index) {
          final order = orders[index];
          final isDelivered = order.orderStatus.toUpperCase() == 'DELIVERED';
          final isCancelled = order.orderStatus.toUpperCase() == 'CANCELLED';

          return Card(
            margin: const EdgeInsets.symmetric(vertical: 4),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: isDelivered
                    ? Colors.green.withValues(alpha: 0.1)
                    : isCancelled
                        ? Colors.orange.withValues(alpha: 0.1)
                        : Colors.blue.withValues(alpha: 0.1),
                child: Icon(
                  isDelivered
                      ? Icons.check_circle
                      : isCancelled
                          ? Icons.cancel
                          : Icons.access_time,
                  color: isDelivered
                      ? Colors.green
                      : isCancelled
                          ? Colors.orange
                          : Colors.blue,
                ),
              ),
              title: Text(
                'Order #${order.id.substring(0, 8).toUpperCase()}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Text(
                '${order.itemCount} items \u2022 ₹${order.totalAmount.toStringAsFixed(2)}',
              ),
              trailing: Text(
                _formatStatus(order.orderStatus),
                style: TextStyle(
                  color: isDelivered
                      ? Colors.green
                      : isCancelled
                          ? Colors.orange
                          : Colors.blue,
                  fontWeight: FontWeight.w500,
                ),
              ),
              onTap: () => context.go('/order/${order.id}'),
            ),
          );
        },
      ),
    );
  }

  String _formatStatus(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Pending';
      case 'ACCEPTED':
        return 'Accepted';
      case 'PICKED_UP':
        return 'Picked Up';
      case 'DELIVERED':
        return 'Delivered';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status;
    }
  }
}
