// lib/features/order_management/presentation/active_order_detail_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:delivery_mobile/features/order_management/presentation/order_state_provider.dart';
import 'package:delivery_mobile/shared/models/order.dart';
import 'package:delivery_mobile/shared/models/order_item.dart';
import 'package:delivery_mobile/features/order_management/provider/provider.dart';

class ActiveOrderDetailPage extends ConsumerStatefulWidget {
  final String orderId;

  const ActiveOrderDetailPage({super.key, required this.orderId});

  @override
  ConsumerState<ActiveOrderDetailPage> createState() => _ActiveOrderDetailPageState();
}

class _ActiveOrderDetailPageState extends ConsumerState<ActiveOrderDetailPage> {
  final _pickupOtpController = TextEditingController();
  final _deliveryOtpController = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Load order data on init
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadOrderData();
    });
  }

  Future<void> _loadOrderData() async {
    // First check if the order was passed via navigation extra
    final extraOrder = GoRouterState.of(context).extra;
    if (extraOrder is Order) {
      ref.read(activeDeliveryProvider.notifier).setOrder(extraOrder);
      return;
    }
    
    // Fallback: try to find the order in the available orders list
    final availableOrders = ref.read(availableOrdersProvider).orders;
    final order = availableOrders.where((o) => o.id == widget.orderId).firstOrNull;
    if (order != null) {
      ref.read(activeDeliveryProvider.notifier).setOrder(order);
    }
  }

  @override
  void dispose() {
    _pickupOtpController.dispose();
    _deliveryOtpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final deliveryState = ref.watch(activeDeliveryProvider);
    final order = deliveryState.order;

    return Scaffold(
      appBar: AppBar(
        title: Text('Order #${widget.orderId.substring(0, 8)}'),
        actions: [
          if (order != null) ...[
            IconButton(
              icon: const Icon(Icons.phone),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Calling customer...')),
                );
              },
            ),
          ],
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () {
              if (order != null) {
                _showOrderDetails(context, order);
              }
            },
          ),
        ],
      ),
      body: deliveryState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : deliveryState.error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 48, color: Colors.red),
                      const SizedBox(height: 16),
                      Text('Error: ${deliveryState.error}'),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadOrderData,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : order == null
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.inbox, size: 64, color: Colors.grey),
                          SizedBox(height: 16),
                          Text('Order not found',
                              style: TextStyle(fontSize: 18, color: Colors.grey)),
                        ],
                      ),
                    )
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Status Timeline
                          _buildStatusTimeline(order),
                          const SizedBox(height: 24),

                          // Delivery Address
                          _buildDeliveryAddressCard(order),
                          const SizedBox(height: 16),

                          // Store Info
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Row(
                                children: [
                                  const Icon(Icons.store, color: Colors.blue),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      order.deliveryAddress.addressLine1,
                                      style: const TextStyle(fontWeight: FontWeight.w500),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Order Items Summary
                          _buildOrderItemsCard(order),
                          const SizedBox(height: 24),

                          // Action Buttons
                          _buildActionButtons(order),
                        ],
                      ),
                    ),
    );
  }

  Widget _buildStatusTimeline(Order order) {
    final status = order.orderStatus.toUpperCase();
    final isAccepted = status == 'ACCEPTED' || status == 'PICKED_UP' || status == 'DELIVERED';
    final isPickedUp = status == 'PICKED_UP' || status == 'DELIVERED';
    final isDelivered = status == 'DELIVERED';

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
            _buildTimelineStep('Order Accepted', 'You accepted this order', isAccepted),
            _buildTimelineStep('Pickup from Store', 'Go to store for pickup', isPickedUp),
            _buildTimelineStep('Deliver to Customer', 'Deliver to customer address', isDelivered),
            _buildTimelineStep('Complete', 'Mark order as delivered', isDelivered),
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

  Widget _buildDeliveryAddressCard(Order order) {
    final addr = order.deliveryAddress;
    return Card(
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
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
              ],
            ),
            const Divider(),
            _buildAddressRow('Address', addr.addressLine1),
            if (addr.addressLine2.isNotEmpty)
              _buildAddressRow('Area', addr.addressLine2),
            _buildAddressRow('City', '${addr.city}, ${addr.state}'),
            _buildAddressRow('Pincode', addr.postalCode),
          ],
        ),
      ),
    );
  }

  Widget _buildOrderItemsCard(Order order) {
    final subtotal = order.items.fold<double>(0, (sum, item) => sum + item.total);
    final deliveryFee = order.deliveryCharges;
    final total = order.totalAmount;

    return Card(
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
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
              ],
            ),
            const Divider(),
            ...order.items.map((item) => _buildItemRow(item)),
            const Divider(),
            _buildTotalRow('Subtotal', '₹${subtotal.toStringAsFixed(2)}'),
            _buildTotalRow('Delivery Fee', '₹${deliveryFee.toStringAsFixed(2)}'),
            if (order.discountAmount > 0)
              _buildTotalRow('Discount', '-₹${order.discountAmount.toStringAsFixed(2)}',
                  color: Colors.green),
            _buildTotalRow('Total', '₹${total.toStringAsFixed(2)}', isBold: true),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButtons(Order order) {
    final status = order.orderStatus.toUpperCase();

    return Column(
      children: [
        // Pickup section - show when not yet picked up
        if (status != 'PICKED_UP' && status != 'DELIVERED')
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Store Pickup',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _pickupOtpController,
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
                      onPressed: () => _handlePickup(order),
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

        // Navigate to customer (always visible when not delivered)
        if (status != 'DELIVERED')
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
        if (status != 'DELIVERED') const SizedBox(height: 16),

        // Delivery section - show when picked up and not delivered
        if (status == 'PICKED_UP' || status == 'ACCEPTED')
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
                    controller: _deliveryOtpController,
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
                      onPressed: () => _handleDeliver(order),
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

  Future<void> _handlePickup(Order order) async {
    if (_pickupOtpController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter the pickup OTP'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    final notifier = ref.read(activeDeliveryProvider.notifier);
    final success = await notifier.pickupOrder(order.id, _pickupOtpController.text.trim());

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(success ? 'Order picked up successfully!' : 'Pickup failed'),
          backgroundColor: success ? Colors.green : Colors.red,
        ),
      );
    }
  }

  Future<void> _navigateToCustomer() async {
    final order = ref.read(activeDeliveryProvider).order;
    if (order == null) return;

    final addr = order.deliveryAddress;
    final lat = addr.latitude;
    final lng = addr.longitude;

    if (lat != null && lng != null && lat != 0 && lng != 0) {
      final googleMapsUrl = Uri.parse(
        'https://www.google.com/maps/dir/?api=1&destination=$lat,$lng',
      );
      final uri = Uri.tryParse('geo:$lat,$lng?q=$lat,$lng');

      // Try Google Maps app first, fall back to web
      if (await canLaunchUrl(googleMapsUrl)) {
        await launchUrl(googleMapsUrl, mode: LaunchMode.externalApplication);
      } else if (uri != null && await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not open maps')),
        );
      }
    } else {
      // Fallback: open with address text
      final addressStr = Uri.encodeComponent(
        '${addr.addressLine1}, ${addr.city}, ${addr.state} ${addr.postalCode}',
      );
      final mapsUrl = Uri.parse(
        'https://www.google.com/maps/search/?api=1&query=$addressStr',
      );
      if (await canLaunchUrl(mapsUrl)) {
        await launchUrl(mapsUrl, mode: LaunchMode.externalApplication);
      }
    }
  }

  Future<void> _handleDeliver(Order order) async {
    if (_deliveryOtpController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter the delivery OTP from customer'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // First verify OTP, then deliver
    final notifier = ref.read(activeDeliveryProvider.notifier);
    final verifyUseCase = ref.read(verifyOtpUseCaseProvider);
    
    try {
      await verifyUseCase.call(order.id, _deliveryOtpController.text.trim());
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('OTP verification failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
      return;
    }
    
    // OTP verified, now deliver
    try {
      final success = await notifier.deliverOrder(order.id);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(success ? 'Order delivered successfully!' : 'Delivery failed'),
            backgroundColor: success ? Colors.green : Colors.red,
          ),
        );
        if (success) {
          context.go('/home');
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Delivery failed: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _showOrderDetails(BuildContext context, Order order) {
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
            _buildDetailRow('Status', order.orderStatus),
            _buildDetailRow('Items', '${order.itemCount} items'),
            _buildDetailRow('Amount', '₹${order.totalAmount.toStringAsFixed(2)}'),
            _buildDetailRow('Payment', order.paymentMethod ?? 'N/A'),
            _buildDetailRow('Payment Status', order.paymentStatus),
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

  Widget _buildItemRow(OrderItem item) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(child: Text(item.productName)),
          Text('x${item.quantity}', style: const TextStyle(color: Colors.grey)),
          const SizedBox(width: 16),
          SizedBox(
            width: 80,
            child: Text('₹${item.total.toStringAsFixed(2)}',
                textAlign: TextAlign.right),
          ),
        ],
      ),
    );
  }

  Widget _buildTotalRow(String label, String value, {bool isBold = false, Color? color}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              color: color,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}
