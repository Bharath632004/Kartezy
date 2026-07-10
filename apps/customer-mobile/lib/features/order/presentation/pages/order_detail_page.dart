// lib/features/order/presentation/pages/order_detail_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:customer_mobile/features/order/provider/provider.dart';
import 'package:customer_mobile/shared/models/order.dart';
import 'package:customer_mobile/shared/widgets/card.dart';
import 'package:customer_mobile/shared/widgets/button.dart';
import 'package:customer_mobile/features/order/presentation/widgets/order_timeline.dart';
import 'package:customer_mobile/features/order/presentation/widgets/order_actions.dart';

class OrderDetailPage extends ConsumerWidget {
  final String orderId;

  const OrderDetailPage({Key? key, required this.orderId}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final orderAsync = ref.watch(getOrderUseCaseProvider(orderId));

    return Scaffold(
      appBar: AppBar(
        title: Text('Order #${orderId.substring(0, 8)}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              //  Share order
            },
          ),
        ],
      ),
      body: orderAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Error: $error'),
              ElevatedButton(
                onPressed: () {
                  ref.refresh(getOrderUseCaseProvider(orderId));
                },
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
        data: (order) => _buildOrderDetail(context, order),
      ),
    );
  }

  Widget _buildOrderDetail(BuildContext context, Order order) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Order summary card
          Card(
            margin: const EdgeInsets.all(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          order.items.isNotEmpty
                              ? order.items.first.product.imageUrl ?? ''
                              : 'https://via.placeholder.com/80',
                          width: 80,
                          height: 80,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => const Icon(
                            Icons.image_not_supported,
                            size: 80,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Order #${order.id.substring(0, 8)}',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Placed on ${DateFormat('MMM d, yyyy').format(order.createdAt)}',
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                            Text(
                              'Status: ${_formatStatus(order.orderStatus)}',
                              style: TextStyle(
                                color: _getStatusColor(order.orderStatus),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(),
                  // Order totals
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Items:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text('${order.itemCount} items'),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Subtotal:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text('\$${(order.totalAmount - order.deliveryCharges).toStringAsFixed(2)}'),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Delivery:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text('\$${order.deliveryCharges.toStringAsFixed(2)}'),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Total:',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        '\$${order.totalAmount.toStringAsFixed(2)}',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          // Order timeline
          Padding(
            padding: const EdgeInsets.all(16),
            child: OrderTimeline(order: order),
          ),
          // Order actions
          Padding(
            padding: const EdgeInsets.all(16),
            child: OrderActions(order: order),
          ),
        ],
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