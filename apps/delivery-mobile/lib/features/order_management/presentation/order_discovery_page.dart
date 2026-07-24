import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:delivery_mobile/shared/models/order.dart';

/// Order discovery page with tabs for different order types.
class OrderDiscoveryPage extends ConsumerStatefulWidget {
  const OrderDiscoveryPage({super.key});

  @override
  ConsumerState<OrderDiscoveryPage> createState() => _OrderDiscoveryPageState();
}

class _OrderDiscoveryPageState extends ConsumerState<OrderDiscoveryPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  Timer? _acceptanceTimer;
  int _timerSeconds = 30;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _acceptanceTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Available Orders'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: const [
            Tab(text: 'Nearby', icon: Icon(Icons.near_me, size: 18)),
            Tab(text: 'Priority', icon: Icon(Icons.priority_high, size: 18)),
            Tab(text: 'Stacked', icon: Icon(Icons.layers, size: 18)),
            Tab(text: 'Scheduled', icon: Icon(Icons.schedule, size: 18)),
          ],
        ),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () {}),
        ],
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildOrdersList(theme, 'nearby'),
          _buildOrdersList(theme, 'priority'),
          _buildOrdersList(theme, 'stacked'),
          _buildOrdersList(theme, 'scheduled'),
        ],
      ),
    );
  }

  Widget _buildOrdersList(ThemeData theme, String type) {
    // Demo orders for each type
    final orders = _getDemoOrders(type);

    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.inbox_outlined, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No $type orders available',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),
            const SizedBox(height: 8),
            Text(
              'Check back in a few minutes',
              style: TextStyle(color: Colors.grey[500]),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () async {},
      child: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: orders.length,
        itemBuilder: (context, index) => _OrderDiscoveryCard(
          order: orders[index],
          type: type,
          onAccept: () => _showAcceptanceDialog(orders[index]),
          onReject: () {},
        ),
      ),
    );
  }

  void _showAcceptanceDialog(Order order) {
    _timerSeconds = 30;
    _acceptanceTimer?.cancel();

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setDialogState) {
          _acceptanceTimer?.cancel();
          _acceptanceTimer = Timer.periodic(const Duration(seconds: 1), (
            timer,
          ) {
            if (_timerSeconds > 0) {
              setDialogState(() => _timerSeconds--);
            } else {
              timer.cancel();
              if (ctx.mounted) Navigator.pop(ctx);
            }
          });

          return AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Timer ring
                SizedBox(
                  width: 80,
                  height: 80,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      CircularProgressIndicator(
                        value: _timerSeconds / 30,
                        strokeWidth: 6,
                        backgroundColor: Colors.grey[200],
                        color: _timerSeconds > 10 ? Colors.green : Colors.red,
                      ),
                      Text(
                        '$_timerSeconds',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Order #${order.id.substring(0, 8)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _DialogStat(label: 'Items', value: '${order.itemCount}'),
                    _DialogStat(
                      label: 'Amount',
                      value: '₹${order.totalAmount.toStringAsFixed(0)}',
                    ),
                    _DialogStat(label: 'Distance', value: '2.3 km'),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  order.deliveryAddress.addressLine1,
                  style: const TextStyle(color: Colors.grey),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          _acceptanceTimer?.cancel();
                          Navigator.pop(ctx);
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.red,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('Reject'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          _acceptanceTimer?.cancel();
                          Navigator.pop(ctx);
                          context.go('/order/${order.id}', extra: order);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Accept',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    ).then((_) => _acceptanceTimer?.cancel());
  }

  List<Order> _getDemoOrders(String type) {
    return [];
  }
}

class _OrderDiscoveryCard extends StatelessWidget {
  final Order order;
  final String type;
  final VoidCallback onAccept;
  final VoidCallback onReject;

  const _OrderDiscoveryCard({
    required this.order,
    required this.type,
    required this.onAccept,
    required this.onReject,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final typeColor = type == 'priority'
        ? Colors.red
        : type == 'express'
        ? Colors.orange
        : Colors.blue;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: typeColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        type.toUpperCase(),
                        style: TextStyle(
                          color: typeColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Order #${order.id.substring(0, 8)}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                Text(
                  '₹${order.totalAmount.toStringAsFixed(0)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            Row(
              children: [
                const Icon(Icons.store_outlined, size: 18, color: Colors.grey),
                const SizedBox(width: 8),
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
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(
                  Icons.shopping_bag_outlined,
                  size: 18,
                  color: Colors.grey,
                ),
                const SizedBox(width: 8),
                Text('${order.itemCount} items'),
                const SizedBox(width: 16),
                const Icon(Icons.directions_walk, size: 18, color: Colors.grey),
                const SizedBox(width: 8),
                const Text('2.3 km'),
                const SizedBox(width: 16),
                const Icon(Icons.schedule, size: 18, color: Colors.grey),
                const SizedBox(width: 8),
                const Text('~15 min'),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: onReject,
                    icon: const Icon(Icons.close, size: 18),
                    label: const Text('Reject'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: onAccept,
                    icon: const Icon(Icons.check, size: 18),
                    label: const Text('Accept'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
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

class _DialogStat extends StatelessWidget {
  final String label;
  final String value;
  const _DialogStat({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
      ],
    );
  }
}
