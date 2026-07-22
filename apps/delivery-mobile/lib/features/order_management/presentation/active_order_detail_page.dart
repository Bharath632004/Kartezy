// lib/features/order_management/presentation/active_order_detail_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:delivery_mobile/features/order_management/provider/provider.dart';
import 'package:delivery_mobile/shared/models/order.dart';

class ActiveOrderDetailPage extends ConsumerStatefulWidget {
  final String orderId;

  const ActiveOrderDetailPage({super.key, required this.orderId});

  @override
  ConsumerState<ActiveOrderDetailPage> createState() => _ActiveOrderDetailPageState();
}

class _ActiveOrderDetailPageState extends ConsumerState<ActiveOrderDetailPage> {
  final _otpController = TextEditingController();

  @override
  void dispose() {
    _otpController.dispose();
    super.dispose();
  }

  OrderStatus _determineStatus(Order order) {
    switch (order.orderStatus.toUpperCase()) {
      case 'ACCEPTED':
        return OrderStatus.accepted;
      case 'PICKED_UP':
      case 'PICKUP':
        return OrderStatus.pickedUp;
      case 'DELIVERED':
        return OrderStatus.delivered;
      default:
        return OrderStatus.accepted;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Order #${widget.orderId.substring(0, 8)}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.phone),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Calling customer...')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () {
              _showOrderDetails(context);
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Timeline
            _buildStatusTimeline(),
            const SizedBox(height: 24),

            // Delivery Address
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.location_on, color: Colors.red),
                        SizedBox(width: 8),
                        Text(
                          'Delivery Address',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const Divider(),
                    _buildAddressRow('Address', '123 Main Street, Area, City'),
                    _buildAddressRow('Pincode', '560001'),
                    _buildAddressRow('Landmark', 'Near City Hospital'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Order Items Summary
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.receipt_long, color: Colors.blue),
                        SizedBox(width: 8),
                        Text(
                          'Order Items',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const Divider(),
                    _buildItemRow('Item 1', '2', '\$40.00'),
                    _buildItemRow('Item 2', '1', '\$25.00'),
                    _buildItemRow('Item 3', '3', '\$60.00'),
                    const Divider(),
                    _buildTotalRow('Subtotal', '\$125.00'),
                    _buildTotalRow('Delivery Fee', '\$10.00'),
                    _buildTotalRow('Total', '\$135.00', isBold: true),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Action Buttons based on status
            _buildActionButtons(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusTimeline() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Order Progress',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 16),
            _buildTimelineStep('Order Accepted', 'You accepted this order', true),
            _buildTimelineStep('Pickup from Store', 'Go to store for pickup', false),
            _buildTimelineStep('Deliver to Customer', 'Deliver to customer address', false),
            _buildTimelineStep('Complete', 'Mark order as delivered', false),
          ],
        ),
      ),
    );
  }

  Widget _buildTimelineStep(String title, String subtitle, bool isComplete) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: isComplete ? Colors.green : Colors.grey.shade300,
                shape: BoxShape.circle,
              ),
              child: isComplete
                  ? const Icon(Icons.check, size: 16, color: Colors.white)
                  : null,
            ),
            Container(
              width: 2,
              height: 40,
              color: Colors.grey.shade200,
            ),
          ],
        ),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: isComplete ? Colors.green : Colors.black87,
              ),
            ),
            Text(subtitle, style: const TextStyle(color: Colors.grey, fontSize: 12)),
            const SizedBox(height: 24),
          ],
        ),
      ],
    );
  }

  Widget _buildActionButtons() {
    return Column(
      children: [
        // Pickup OTP verification
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Store Pickup OTP',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _otpController,
                  decoration: const InputDecoration(
                    hintText: 'Enter OTP from store',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.lock),
                  ),
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => _pickupOrder(),
                    icon: const Icon(Icons.shopping_bag),
                    label: const Text('Confirm Pickup'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Navigate to customer
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () => _navigateToCustomer(),
            icon: const Icon(Icons.navigation),
            label: const Text('Navigate to Customer'),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Deliver button
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () => _deliverOrder(),
            icon: const Icon(Icons.check_circle),
            label: const Text('Mark as Delivered'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Customer OTP verification
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Delivery OTP Verification',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                TextField(
                  decoration: const InputDecoration(
                    hintText: 'Enter OTP from customer',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.verified_user),
                  ),
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.verified),
                    label: const Text('Verify OTP & Complete'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  void _pickupOrder() {
    if (_otpController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter the pickup OTP'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Order picked up successfully!'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _navigateToCustomer() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Opening navigation...'),
      ),
    );
  }

  Future<void> _deliverOrder() async {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Order delivered successfully!'),
        backgroundColor: Colors.green,
      ),
    );
    if (mounted) {
      context.go('/home');
    }
  }

  void _showOrderDetails(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Order Details',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 16),
            _buildDetailRow('Order ID', widget.orderId),
            _buildDetailRow('Customer', 'Customer Name'),
            _buildDetailRow('Phone', '+91-9876543210'),
            _buildDetailRow('Payment', 'COD'),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.grey)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Widget _buildAddressRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(label, style: const TextStyle(color: Colors.grey)),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Widget _buildItemRow(String name, String qty, String price) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(child: Text(name)),
          Text('x$qty', style: const TextStyle(color: Colors.grey)),
          const SizedBox(width: 16),
          SizedBox(
            width: 70,
            child: Text(price, textAlign: TextAlign.right),
          ),
        ],
      ),
    );
  }

  Widget _buildTotalRow(String label, String value, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}

enum OrderStatus { accepted, pickedUp, delivered }
