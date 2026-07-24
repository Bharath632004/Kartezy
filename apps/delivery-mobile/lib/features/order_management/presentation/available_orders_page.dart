// lib/features/order_management/presentation/available_orders_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:delivery_mobile/features/order_management/presentation/order_state_provider.dart';
import 'package:delivery_mobile/shared/models/order.dart';

class AvailableOrdersPage extends ConsumerStatefulWidget {
  const AvailableOrdersPage({super.key});

  @override
  ConsumerState<AvailableOrdersPage> createState() =>
      _AvailableOrdersPageState();
}

class _AvailableOrdersPageState extends ConsumerState<AvailableOrdersPage> {
  @override
  Widget build(BuildContext context) {
    final state = ref.watch(availableOrdersProvider);
    final notifier = ref.read(availableOrdersProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Available Orders'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => notifier.loadOrders(),
          ),
        ],
      ),
      body: _buildBody(state, notifier),
    );
  }

  Widget _buildBody(
    AvailableOrdersState state,
    AvailableOrdersNotifier notifier,
  ) {
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
              onPressed: () => notifier.loadOrders(),
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
            Icon(Icons.inbox, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text(
              'No available orders',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            SizedBox(height: 8),
            Text(
              'New orders will appear here',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      );
    }
    return RefreshIndicator(
      onRefresh: () => notifier.loadOrders(),
      child: ListView.builder(
        padding: const EdgeInsets.all(8),
        itemCount: state.orders.length,
        itemBuilder: (context, index) {
          final order = state.orders[index];
          return _OrderCard(
            order: order,
            onAccept: () => _acceptOrder(notifier, order.id),
            onReject: () => _rejectOrder(notifier, order.id),
          );
        },
      ),
    );
  }

  Future<void> _acceptOrder(
    AvailableOrdersNotifier notifier,
    String orderId,
  ) async {
    final order = await notifier.acceptOrder(orderId);
    if (order != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Order accepted!'),
          backgroundColor: Colors.green,
        ),
      );
      // Pass the order via extra so the detail page can load it
      context.go('/order/$orderId', extra: order);
    }
  }

  Future<void> _rejectOrder(
    AvailableOrdersNotifier notifier,
    String orderId,
  ) async {
    final reason = await showDialog<String>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reject Order'),
        content: const TextField(
          decoration: InputDecoration(
            hintText: 'Enter reason for rejection',
            border: OutlineInputBorder(),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, 'Not available'),
            child: const Text('Reject'),
          ),
        ],
      ),
    );
    if (reason != null) {
      final success = await notifier.rejectOrder(orderId, reason);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(success ? 'Order rejected' : 'Failed to reject'),
            backgroundColor: success ? Colors.green : Colors.red,
          ),
        );
      }
    }
  }
}

class _OrderCard extends StatelessWidget {
  final Order order;
  final VoidCallback onAccept;
  final VoidCallback onReject;

  const _OrderCard({
    required this.order,
    required this.onAccept,
    required this.onReject,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Order #${order.id.substring(0, 8)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.orange.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'AVAILABLE',
                    style: TextStyle(
                      color: Colors.orange,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            const Divider(),
            Row(
              children: [
                const Icon(Icons.store, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(
                  order.deliveryAddress.addressLine1,
                  style: const TextStyle(color: Colors.grey),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.shopping_bag, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text('${order.itemCount} items'),
                const Spacer(),
                const Icon(Icons.currency_rupee, size: 16, color: Colors.green),
                Text(
                  order.totalAmount.toStringAsFixed(2),
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.location_on, size: 16, color: Colors.red),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    order.deliveryAddress.addressLine1,
                    style: const TextStyle(color: Colors.grey),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: onReject,
                    icon: const Icon(Icons.close),
                    label: const Text('Reject'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: onAccept,
                    icon: const Icon(Icons.check),
                    label: const Text('Accept'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
