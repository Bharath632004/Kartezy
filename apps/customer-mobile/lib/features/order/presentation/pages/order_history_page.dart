// lib/features/order/presentation/pages/order_history_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/order/provider/provider.dart';
import 'package:customer_mobile/shared/models/order.dart';
import 'package:customer_mobile/shared/widgets/card.dart';
import 'package:customer_mobile/shared/widgets/button.dart';

class OrderHistoryPage extends ConsumerWidget {
  const OrderHistoryPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orderState = ref.watch(orderProvider);

    return DefaultTabController(
      length: 7, // All, Active, Scheduled, Completed, Cancelled, Returned, Refunded
      child: Scaffold(
        appBar: AppBar(
          title: const Text('My Orders'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'All'),
              Tab(text: 'Active'),
              Tab(text: 'Scheduled'),
              Tab(text: 'Completed'),
              Tab(text: 'Cancelled'),
              Tab(text: 'Returned'),
              Tab(text: 'Refunded'),
            ],
          ),
        ),
        body: orderState.isLoading
            ? const Center(child: CircularProgressIndicator())
            : orderState.errorMessage != null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Error: ${orderState.errorMessage}'),
                        ElevatedButton(
                          onPressed: () {
                            // Refetch orders
                            ref.refresh(orderProvider);
                          },
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : TabBarView(
                    children: [
                      _buildOrderList(orderState.orders ?? []), // All
                      _buildOrderList(
                          orderState.orders?.where((o) => _isActiveStatus(o.orderStatus)).toList() ?? []),
                      _buildOrderList(
                          orderState.orders?.where((o) => o.orderStatus == 'scheduled').toList() ?? []),
                      _buildOrderList(
                          orderState.orders?.where((o) => o.orderStatus == 'delivered').toList() ?? []),
                      _buildOrderList(
                          orderState.orders?.where((o) => o.orderStatus == 'cancelled').toList() ?? []),
                      _buildOrderList(
                          orderState.orders?.where((o) => o.orderStatus == 'returned').toList() ?? []),
                      _buildOrderList(
                          orderState.orders?.where((o) => o.orderStatus == 'refunded').toList() ?? []),
                    ],
                  ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            //  Navigate to new order/cart
          },
          child: const Icon(Icons.shopping_cart),
        ),
      ),
    );
  }

  Widget _buildOrderList(List<Order> orders) {
    if (orders.isEmpty) {
      return const Center(
        child: Text('No orders found'),
      );
    }

    return ListView.builder(
      itemCount: orders.length,
      itemBuilder: (context, index) {
        final order = orders[index];
        return OrderHistoryItem(order: order);
      },
    );
  }

  bool _isActiveStatus(String status) {
    return ['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery']
        .contains(status.toLowerCase());
  }
}

class OrderHistoryItem extends StatelessWidget {
  final Order order;

  const OrderHistoryItem({Key? key, required this.order}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Image.network(
            order.items.isNotEmpty
                ? order.items.first.product.imageUrl ?? ''
                : 'https://via.placeholder.com/60',
            width: 60,
            height: 60,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) => const Icon(
              Icons.image_not_supported,
              size: 60,
            ),
          ),
        ),
        title: Text('Order #${order.id.substring(0, 8)}'),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${order.items.length} items'),
            Text('Total: \$${order.totalAmount.toStringAsFixed(2)}'),
            Text(
              'Status: ${_formatStatus(order.orderStatus)}',
              style: TextStyle(
                color: _getStatusColor(order.orderStatus),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        trailing: IconButton(
          icon: const Icon(Icons.arrow_forward_ios),
          onPressed: () {
            //  Navigate to order details page
          },
        ),
        onTap: () {
          //  Navigate to order details page
        },
      ),
    );
  }

  String _formatStatus(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'processing':
        return 'Processing';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'returned':
        return 'Returned';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'delivered':
        return Colors.green;
      case 'out_for_delivery':
        return Colors.orange;
      case 'cancelled':
      case 'returned':
        return Colors.red;
      case 'refunded':
        return Colors.purple;
      default:
        return Colors.blue;
    }
  }
}