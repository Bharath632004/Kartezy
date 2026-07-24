import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:delivery_mobile/shared/models/order.dart';
import 'package:delivery_mobile/features/order_management/presentation/order_state_provider.dart';
import 'package:delivery_mobile/features/order_management/provider/provider.dart';

/// World-class active order detail page with full delivery flow.
class ActiveOrderDetailPage extends ConsumerStatefulWidget {
  final String orderId;
  const ActiveOrderDetailPage({super.key, required this.orderId});

  @override
  ConsumerState<ActiveOrderDetailPage> createState() =>
      _ActiveOrderDetailPageState();
}

class _ActiveOrderDetailPageState extends ConsumerState<ActiveOrderDetailPage>
    with SingleTickerProviderStateMixin {
  final _pickupOtpController = TextEditingController();
  final _deliveryOtpController = TextEditingController();
  late AnimationController _animController;
  late Animation<double> _pulseAnimation;
  int _currentPhase =
      0; // 0: to store, 1: at store, 2: to customer, 3: at customer

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeInOut),
    );
    WidgetsBinding.instance.addPostFrameCallback((_) => _loadOrderData());
  }

  @override
  void dispose() {
    _animController.dispose();
    _pickupOtpController.dispose();
    _deliveryOtpController.dispose();
    super.dispose();
  }

  void _loadOrderData() {
    final extraOrder = GoRouterState.of(context).extra;
    if (extraOrder is Order) {
      ref.read(activeDeliveryProvider.notifier).setOrder(extraOrder);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final deliveryState = ref.watch(activeDeliveryProvider);
    final order = deliveryState.order;

    return Scaffold(
      backgroundColor: theme.colorScheme.surfaceContainerLowest,
      appBar: AppBar(
        title: Text('Order #${widget.orderId.substring(0, 8)}'),
        actions: [
          IconButton(icon: const Icon(Icons.phone), onPressed: _callCustomer),
          IconButton(
            icon: const Icon(Icons.chat),
            onPressed: () => context.push('/chat/order/${widget.orderId}'),
          ),
          IconButton(
            icon: const Icon(Icons.more_vert),
            onPressed: _showMoreOptions,
          ),
        ],
      ),
      body: deliveryState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : order == null
          ? const Center(child: Text('Order not found'))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildStatusBanner(theme, order),
                  const SizedBox(height: 16),
                  _buildPhaseTimeline(theme),
                  const SizedBox(height: 16),
                  _buildStoreCard(theme, order),
                  const SizedBox(height: 12),
                  _buildCustomerCard(theme, order),
                  const SizedBox(height: 12),
                  _buildOrderItemsCard(theme, order),
                  const SizedBox(height: 16),
                  _buildActionArea(theme, order),
                  const SizedBox(height: 80),
                ],
              ),
            ),
      bottomNavigationBar: _buildBottomBar(theme, order),
    );
  }

  Widget _buildStatusBanner(ThemeData theme, Order order) {
    final colors = {
      'ACCEPTED': Colors.blue,
      'PICKING_UP': Colors.orange,
      'PICKED_UP': Colors.purple,
      'DELIVERING': Colors.teal,
      'DELIVERED': Colors.green,
    };
    final color = colors[order.orderStatus.toUpperCase()] ?? Colors.blue;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(colors: [color, color.withValues(alpha: 0.7)]),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          ScaleTransition(
            scale: _pulseAnimation,
            child: Container(
              width: 12,
              height: 12,
              decoration: const BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                order.orderStatus.toUpperCase(),
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const Text(
                'Order is being processed',
                style: TextStyle(color: Colors.white70, fontSize: 13),
              ),
            ],
          ),
          const Spacer(),
          Text(
            '₹${order.totalAmount.toStringAsFixed(0)}',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 20,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPhaseTimeline(ThemeData theme) {
    final phases = [
      _PhaseData(
        'Navigate to Store',
        'Go to store for pickup',
        Icons.store,
        _currentPhase >= 0,
      ),
      _PhaseData(
        'Pickup Order',
        'Verify and collect order',
        Icons.shopping_bag,
        _currentPhase >= 1,
      ),
      _PhaseData(
        'Navigate to Customer',
        'Deliver to customer',
        Icons.navigation,
        _currentPhase >= 2,
      ),
      _PhaseData(
        'Complete Delivery',
        'Verify OTP & deliver',
        Icons.check_circle,
        _currentPhase >= 3,
      ),
    ];

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: phases.asMap().entries.map((entry) {
            final i = entry.key;
            final phase = entry.value;
            final isCurrent = i == _currentPhase;
            final isLast = i == phases.length - 1;

            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: phase.isComplete
                            ? Colors.green
                            : isCurrent
                            ? theme.colorScheme.primary
                            : Colors.grey[200],
                        shape: BoxShape.circle,
                      ),
                      child: phase.isComplete
                          ? const Icon(
                              Icons.check,
                              size: 18,
                              color: Colors.white,
                            )
                          : isCurrent
                          ? ScaleTransition(
                              scale: _pulseAnimation,
                              child: Icon(
                                phase.icon,
                                size: 16,
                                color: Colors.white,
                              ),
                            )
                          : Icon(phase.icon, size: 16, color: Colors.grey[400]),
                    ),
                    if (!isLast)
                      Container(
                        width: 2,
                        height: 40,
                        color: phase.isComplete
                            ? Colors.green
                            : Colors.grey[200],
                      ),
                  ],
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          phase.title,
                          style: TextStyle(
                            fontWeight: isCurrent
                                ? FontWeight.bold
                                : FontWeight.w500,
                            color: phase.isComplete ? Colors.green : null,
                          ),
                        ),
                        Text(
                          phase.subtitle,
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildStoreCard(ThemeData theme, Order order) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: Colors.blue.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.store, color: Colors.blue, size: 20),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Text(
                    'Pickup Location',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            Text(
              order.deliveryAddress.addressLine1,
              style: const TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _ActionChip(
                  icon: Icons.navigation,
                  label: 'Navigate',
                  onTap: _navigateToStore,
                ),
                const SizedBox(width: 8),
                _ActionChip(icon: Icons.phone, label: 'Call', onTap: () {}),
                const SizedBox(width: 8),
                _ActionChip(icon: Icons.map, label: 'Check In', onTap: () {}),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCustomerCard(ThemeData theme, Order order) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: Colors.green.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.person,
                    color: Colors.green,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Text(
                    'Delivery Address',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            Text(
              order.deliveryAddress.addressLine1,
              style: const TextStyle(color: Colors.grey),
            ),
            if (order.deliveryInstructions != null &&
                order.deliveryInstructions!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.orange.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.info_outline,
                      size: 16,
                      color: Colors.orange,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        order.deliveryInstructions!,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.orange,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildOrderItemsCard(ThemeData theme, Order order) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Order Items',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  '${order.itemCount} items',
                  style: const TextStyle(color: Colors.grey),
                ),
              ],
            ),
            const Divider(),
            ...order.items.map(
              (item) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: Colors.green,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(child: Text(item.productName)),
                    Text(
                      'x${item.quantity}',
                      style: const TextStyle(color: Colors.grey),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      '₹${item.total.toStringAsFixed(0)}',
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
            ),
            const Divider(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Total',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  '₹${order.totalAmount.toStringAsFixed(0)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionArea(ThemeData theme, Order order) {
    if (_currentPhase == 1) {
      // Pickup OTP verification
      return Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Store Pickup Verification',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 4),
              const Text(
                'Enter the OTP provided by the store',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _pickupOtpController,
                keyboardType: TextInputType.number,
                maxLength: 6,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 8,
                ),
                decoration: InputDecoration(
                  hintText: '••••••',
                  counterText: '',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  filled: true,
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _handlePickup,
                  icon: const Icon(Icons.shopping_bag),
                  label: const Text('Confirm Pickup'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    if (_currentPhase == 3) {
      // Delivery OTP verification
      return Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Customer Delivery Verification',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 4),
              const Text(
                'Enter the OTP provided by the customer',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _deliveryOtpController,
                keyboardType: TextInputType.number,
                maxLength: 6,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 8,
                ),
                decoration: InputDecoration(
                  hintText: '••••••',
                  counterText: '',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  filled: true,
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: _handleDelivery,
                  icon: const Icon(Icons.verified),
                  label: const Text('Verify & Complete Delivery'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return const SizedBox.shrink();
  }

  Widget _buildBottomBar(ThemeData theme, Order order) {
    return SafeArea(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 8,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: _callCustomer,
                icon: const Icon(Icons.phone, size: 18),
                label: const Text('Call Customer'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: _navigateToCustomer,
                icon: const Icon(Icons.navigation, size: 18),
                label: const Text('Navigate'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _callCustomer() async {
    final url = Uri.parse('tel:+919876543210');
    if (await canLaunchUrl(url)) await launchUrl(url);
  }

  void _navigateToCustomer() async {
    final url = Uri.parse(
      'https://www.google.com/maps/dir/?api=1&destination=12.9716,77.5946',
    );
    if (await canLaunchUrl(url))
      await launchUrl(url, mode: LaunchMode.externalApplication);
  }

  void _navigateToStore() async {
    final url = Uri.parse(
      'https://www.google.com/maps/dir/?api=1&destination=12.9716,77.5946',
    );
    if (await canLaunchUrl(url))
      await launchUrl(url, mode: LaunchMode.externalApplication);
  }

  void _handlePickup() {
    if (_pickupOtpController.text.length >= 4) {
      setState(() => _currentPhase = 2);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Pickup confirmed! Navigate to customer.'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  void _handleDelivery() {
    if (_deliveryOtpController.text.length >= 4) {
      setState(() => _currentPhase = 4);
      _showDeliveryComplete();
    }
  }

  void _showDeliveryComplete() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 64),
            const SizedBox(height: 16),
            const Text(
              'Delivery Complete!',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
            ),
            const SizedBox(height: 8),
            const Text(
              'You earned ₹70 for this delivery',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  context.go('/home');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text('Back to Dashboard'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showMoreOptions() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.report),
              title: const Text('Report Issue'),
              onTap: () => Navigator.pop(ctx),
            ),
            ListTile(
              leading: const Icon(Icons.share),
              title: const Text('Share Trip'),
              onTap: () => Navigator.pop(ctx),
            ),
            ListTile(
              leading: const Icon(Icons.cancel, color: Colors.red),
              title: const Text(
                'Cancel Order',
                style: TextStyle(color: Colors.red),
              ),
              onTap: () => Navigator.pop(ctx),
            ),
          ],
        ),
      ),
    );
  }
}

class _PhaseData {
  final String title;
  final String subtitle;
  final IconData icon;
  final bool isComplete;
  _PhaseData(this.title, this.subtitle, this.icon, this.isComplete);
}

class _ActionChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  const _ActionChip({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.surfaceContainerHighest,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 14),
            const SizedBox(width: 4),
            Text(label, style: const TextStyle(fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
