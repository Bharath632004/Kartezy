import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Delivery order model
class DeliveryOrder {
  final String id;
  final String orderNumber;
  final String customerName;
  final String customerAddress;
  final String? deliveryPartnerName;
  final String? deliveryPartnerPhone;
  final String status; // assigned, picked_up, in_transit, delivered, failed
  final DateTime estimatedDelivery;
  final double lat;
  final double lng;
  final double? partnerLat;
  final double? partnerLng;

  const DeliveryOrder({
    required this.id,
    required this.orderNumber,
    required this.customerName,
    required this.customerAddress,
    this.deliveryPartnerName,
    this.deliveryPartnerPhone,
    required this.status,
    required this.estimatedDelivery,
    required this.lat,
    required this.lng,
    this.partnerLat,
    this.partnerLng,
  });
}

final deliveryOrdersProvider = Provider<List<DeliveryOrder>>((ref) {
  return [
    DeliveryOrder(
      id: '1',
      orderNumber: 'ORD-001',
      customerName: 'Rahul Sharma',
      customerAddress: '42, Lake View Apartments, MG Road',
      deliveryPartnerName: 'Vijay Kumar',
      deliveryPartnerPhone: '+91-9876543210',
      status: 'in_transit',
      estimatedDelivery: DateTime.now().add(const Duration(minutes: 15)),
      lat: 12.9716,
      lng: 77.5946,
      partnerLat: 12.9720,
      partnerLng: 77.5950,
    ),
    DeliveryOrder(
      id: '2',
      orderNumber: 'ORD-002',
      customerName: 'Priya Patel',
      customerAddress: '15, Sunshine Colony, S.G. Road',
      status: 'assigned',
      estimatedDelivery: DateTime.now().add(const Duration(minutes: 30)),
      lat: 12.9344,
      lng: 77.6101,
    ),
  ];
});

class _StatusConfig {
  final IconData icon;
  final Color color;
  final String label;

  const _StatusConfig({
    required this.icon,
    required this.color,
    required this.label,
  });
}

/// Delivery Management Page
class DeliveryTrackingPage extends ConsumerWidget {
  const DeliveryTrackingPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final deliveries = ref.watch(deliveryOrdersProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Delivery Management'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () {}),
        ],
      ),
      body: deliveries.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.delivery_dining,
                        size: 48,
                        color: Colors.grey[400],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'No active deliveries',
                      style: theme.textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Orders ready for delivery will appear here',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
            )
          : RefreshIndicator(
              onRefresh: () async {},
              child: ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: deliveries.length,
                itemBuilder: (context, index) {
                  final delivery = deliveries[index];
                  return _buildDeliveryCard(context, theme, delivery);
                },
              ),
            ),
    );
  }

  Widget _buildDeliveryCard(
    BuildContext context,
    ThemeData theme,
    DeliveryOrder delivery,
  ) {
    final statusConfig = _getStatusConfig(delivery.status);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header: Order number and status
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: statusConfig.color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        statusConfig.icon,
                        size: 16,
                        color: statusConfig.color,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        statusConfig.label,
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: statusConfig.color,
                        ),
                      ),
                    ],
                  ),
                ),
                const Spacer(),
                Text(
                  delivery.orderNumber,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Customer info
            Row(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: theme.colorScheme.primary.withValues(
                    alpha: 0.1,
                  ),
                  child: Text(
                    delivery.customerName[0],
                    style: TextStyle(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        delivery.customerName,
                        style: const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      Text(
                        delivery.customerAddress,
                        style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Delivery partner info (if assigned)
            if (delivery.deliveryPartnerName != null) ...[
              const Divider(),
              Row(
                children: [
                  Icon(Icons.person, size: 18, color: Colors.grey[600]),
                  const SizedBox(width: 8),
                  Text(
                    delivery.deliveryPartnerName!,
                    style: const TextStyle(fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(width: 12),
                  Icon(Icons.phone, size: 16, color: Colors.grey[500]),
                  const SizedBox(width: 4),
                  Text(
                    delivery.deliveryPartnerPhone ?? '',
                    style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                  ),
                ],
              ),
            ],

            const SizedBox(height: 12),

            // ETA
            Row(
              children: [
                Icon(Icons.access_time, size: 18, color: Colors.grey[600]),
                const SizedBox(width: 8),
                Text(
                  'ETA: ${_formatTime(delivery.estimatedDelivery)}',
                  style: TextStyle(
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const Spacer(),
                // Action buttons based on status
                if (delivery.status == 'assigned')
                  ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.done, size: 18),
                    label: const Text('Mark Picked Up'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      textStyle: const TextStyle(fontSize: 12),
                    ),
                  ),
                if (delivery.status == 'in_transit')
                  ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.check_circle, size: 18),
                    label: const Text('Delivered'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      textStyle: const TextStyle(fontSize: 12),
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                    ),
                  ),
                if (delivery.status == 'picked_up')
                  OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.local_shipping, size: 18),
                    label: const Text('In Transit'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      textStyle: const TextStyle(fontSize: 12),
                    ),
                  ),
              ],
            ),

            // Map preview placeholder
            if (delivery.partnerLat != null) ...[
              const SizedBox(height: 12),
              Container(
                height: 100,
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.map,
                        color: theme.colorScheme.primary,
                        size: 24,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Live tracking map',
                        style: TextStyle(color: Colors.grey[600], fontSize: 13),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  _StatusConfig _getStatusConfig(String status) {
    switch (status) {
      case 'assigned':
        return _StatusConfig(
          icon: Icons.person_outline,
          color: Colors.blue,
          label: 'Assigned',
        );
      case 'picked_up':
        return _StatusConfig(
          icon: Icons.inventory,
          color: Colors.orange,
          label: 'Picked Up',
        );
      case 'in_transit':
        return _StatusConfig(
          icon: Icons.local_shipping,
          color: Colors.deepPurple,
          label: 'In Transit',
        );
      case 'delivered':
        return _StatusConfig(
          icon: Icons.check_circle,
          color: Colors.green,
          label: 'Delivered',
        );
      case 'failed':
        return _StatusConfig(
          icon: Icons.error,
          color: Colors.red,
          label: 'Failed',
        );
      default:
        return _StatusConfig(
          icon: Icons.help_outline,
          color: Colors.grey,
          label: status,
        );
    }
  }

  String _formatTime(DateTime dateTime) {
    final hour = dateTime.hour > 12 ? dateTime.hour - 12 : dateTime.hour;
    final minute = dateTime.minute.toString().padLeft(2, '0');
    final amPm = dateTime.hour >= 12 ? 'PM' : 'AM';
    return '$hour:$minute $amPm';
  }
}
