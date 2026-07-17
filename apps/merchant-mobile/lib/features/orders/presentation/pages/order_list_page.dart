import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/features/orders/presentation/providers/order_provider.dart';

class OrderListPage extends ConsumerStatefulWidget {
  const OrderListPage({super.key});

  @override
  ConsumerState<OrderListPage> createState() => _OrderListPageState();
}

class _OrderListPageState extends ConsumerState<OrderListPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _ordersForTab(int index) {
    final state = ref.watch(orderProvider);
    switch (index) {
      case 0:
        return state.pendingOrders;
      case 1:
        return state.processingOrders;
      case 2:
        return state.deliveredOrders;
      case 3:
        return state.cancelledOrders;
      default:
        return [];
    }
  }

  IconData _statusIcon(int index) {
    switch (index) {
      case 0:
        return Icons.hourglass_empty;
      case 1:
        return Icons.sync;
      case 2:
        return Icons.check_circle;
      case 3:
        return Icons.cancel;
      default:
        return Icons.help;
    }
  }

  Color _statusColor(int index) {
    switch (index) {
      case 0:
        return Colors.orange;
      case 1:
        return Colors.blue;
      case 2:
        return Colors.green;
      case 3:
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _statusLabel(int index) {
    switch (index) {
      case 0:
        return 'pending';
      case 1:
        return 'processing';
      case 2:
        return 'delivered';
      case 3:
        return 'cancelled';
      default:
        return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    final orderState = ref.watch(orderProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Orders'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(orderProvider.notifier).loadAllOrders(),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.deepPurple,
          labelColor: Colors.deepPurple,
          unselectedLabelColor: Colors.grey,
          tabs: const [
            Tab(text: 'Pending'),
            Tab(text: 'Processing'),
            Tab(text: 'Delivered'),
            Tab(text: 'Cancelled'),
          ],
        ),
      ),
      body: orderState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : orderState.error != null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 48, color: Colors.red),
                  const SizedBox(height: 12),
                  Text('Error: ${orderState.error}'),
                  const SizedBox(height: 12),
                  ElevatedButton(
                    onPressed: () =>
                        ref.read(orderProvider.notifier).loadAllOrders(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            )
          : TabBarView(
              controller: _tabController,
              children: List.generate(4, (index) {
                final orders = _ordersForTab(index);
                if (orders.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          _statusIcon(index),
                          size: 64,
                          color: Colors.grey.shade300,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No ${_statusLabel(index)} orders',
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.grey,
                          ),
                        ),
                        if (index == 0) ...[
                          const SizedBox(height: 24),
                          ElevatedButton.icon(
                            onPressed: () => context.go('/products'),
                            icon: const Icon(Icons.shopping_bag),
                            label: const Text('Browse Products'),
                          ),
                        ],
                      ],
                    ),
                  );
                }
                return RefreshIndicator(
                  onRefresh: () =>
                      ref.read(orderProvider.notifier).loadAllOrders(),
                  child: ListView.builder(
                    padding: const EdgeInsets.all(8),
                    itemCount: orders.length,
                    itemBuilder: (context, i) {
                      final order = orders[i];
                      return Card(
                        margin: const EdgeInsets.symmetric(vertical: 4),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundColor: _statusColor(
                              index,
                            ).withOpacity(0.1),
                            child: Icon(
                              _statusIcon(index),
                              color: _statusColor(index),
                            ),
                          ),
                          title: Text(
                            'Order #${order['order_number'] ?? order['id'] ?? 'N/A'}',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (order['customer_name'] != null)
                                Text('Customer: ${order['customer_name']}'),
                              if (order['total'] != null)
                                Text(
                                  'Total: \$${order['total']}',
                                  style: TextStyle(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.primary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              if (order['items_count'] != null)
                                Text('Items: ${order['items_count']}'),
                            ],
                          ),
                          isThreeLine: true,
                          trailing: PopupMenuButton<String>(
                            onSelected: (value) => ref
                                .read(orderProvider.notifier)
                                .updateStatus(
                                  order['id']?.toString() ?? '',
                                  value,
                                ),
                            itemBuilder: (ctx) => [
                              if (index < 2)
                                const PopupMenuItem(
                                  value: 'processing',
                                  child: Text('Mark Processing'),
                                ),
                              if (index < 3)
                                const PopupMenuItem(
                                  value: 'delivered',
                                  child: Text('Mark Delivered'),
                                ),
                              const PopupMenuItem(
                                value: 'cancelled',
                                child: Text('Cancel Order'),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                );
              }),
            ),
    );
  }
}
