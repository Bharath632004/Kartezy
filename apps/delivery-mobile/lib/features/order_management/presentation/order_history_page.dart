// lib/features/order_management/presentation/order_history_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:delivery_mobile/features/order_management/provider/provider.dart';

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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Order History'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Today'),
            Tab(text: 'Weekly'),
            Tab(text: 'All Time'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildOrderList('today'),
          _buildOrderList('weekly'),
          _buildOrderList('all'),
        ],
      ),
    );
  }

  Widget _buildOrderList(String period) {
    return ListView.builder(
      padding: const EdgeInsets.all(8),
      itemCount: 5, // Placeholder count
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 4),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: index % 2 == 0
                  ? Colors.green.withValues(alpha: 0.1)
                  : Colors.orange.withValues(alpha: 0.1),
              child: Icon(
                index % 2 == 0 ? Icons.check_circle : Icons.cancel,
                color: index % 2 == 0 ? Colors.green : Colors.orange,
              ),
            ),
            title: Text(
              'Order #ORD${1000 + index}',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text(
              '${index + 1} items \u2022 \$${(20 + index * 5).toStringAsFixed(2)}',
            ),
            trailing: Text(
              index % 2 == 0 ? 'Delivered' : 'Cancelled',
              style: TextStyle(
                color: index % 2 == 0 ? Colors.green : Colors.orange,
                fontWeight: FontWeight.w500,
              ),
            ),
            onTap: () => context.go('/order/ORD${1000 + index}'),
          ),
        );
      },
    );
  }
}
