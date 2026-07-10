// lib/features/order/presentation/widgets/order_actions.dart
import 'package:flutter/material.dart';
import 'package:customer_mobile/shared/models/order.dart';

class OrderActions extends StatelessWidget {
  final Order order;

  const OrderActions({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Primary actions: Cancel, Reorder, Track
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                context,
                Icons.cancel,
                'Cancel Order',
                order.orderStatus.toLowerCase() == 'pending' ||
                    order.orderStatus.toLowerCase() == 'confirmed',
                onPressed: () {
                  //  Implement cancel order
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildActionButton(
                context,
                Icons.repeat,
                'Reorder',
                true, // Always allow reorder
                onPressed: () {
                  //  Implement reorder
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        // Secondary actions: Download Invoice, Contact Support
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                context,
                Icons.picture_as_pdf,
                'Download Invoice',
                order.orderStatus.toLowerCase() == 'delivered' ||
                    order.orderStatus.toLowerCase() == 'completed',
                onPressed: () {
                  //  Implement download invoice
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildActionButton(
                context,
                Icons.headset,
                'Contact Support',
                true,
                onPressed: () {
                  //  Implement contact support
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        // Tertiary actions: Call Driver, Chat with Driver
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                context,
                Icons.phone,
                'Call Driver',
                order.orderStatus.toLowerCase() == 'out_for_delivery' ||
                    order.orderStatus.toLowerCase() == 'delivered',
                onPressed: () {
                  //  Implement call driver
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildActionButton(
                context,
                Icons.chat_bubble,
                'Chat with Driver',
                order.orderStatus.toLowerCase() == 'out_for_delivery' ||
                    order.orderStatus.toLowerCase() == 'delivered',
                onPressed: () {
                  //  Implement chat with driver
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        // Additional actions: Report Issue, Request Refund, Request Return
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                context,
                Icons.flag,
                'Report Issue',
                order.orderStatus.toLowerCase() == 'delivered',
                onPressed: () {
                  //  Implement report issue
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildActionButton(
                context,
                Icons.refresh,
                'Request Refund',
                order.orderStatus.toLowerCase() == 'delivered',
                onPressed: () {
                  //  Implement request refund
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        // Request Return (only for delivered orders, and maybe within return window)
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                context,
                Icons.restore,
                'Request Return',
                order.orderStatus.toLowerCase() == 'delivered',
                onPressed: () {
                  //  Implement request return
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        // Rating actions: Rate Delivery, Rate Products, Rate Merchant
        // Only show if order is delivered and not yet rated
        // We don't have a rating status in the order, so we'll always show for delivered orders
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                context,
                Icons.star,
                'Rate Delivery',
                order.orderStatus.toLowerCase() == 'delivered',
                onPressed: () {
                  //  Implement rate delivery
                },
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _buildActionButton(
                context,
                Icons.star,
                'Rate Products',
                order.orderStatus.toLowerCase() == 'delivered',
                onPressed: () {
                  //  Implement rate products
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                context,
                Icons.star,
                'Rate Merchant',
                order.orderStatus.toLowerCase() == 'delivered',
                onPressed: () {
                  //  Implement rate merchant
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionButton(
    BuildContext context,
    IconData icon,
    String label,
    bool enabled, {
    VoidCallback? onPressed,
  }) {
    return ElevatedButton.icon(
      onPressed: enabled && onPressed != null ? onPressed : null,
      icon: Icon(icon, size: 18),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        minimumSize: const Size.fromHeight(40),
        // Remove the enabled property here
      ),
    );
  }
}