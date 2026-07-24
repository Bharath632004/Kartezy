import 'package:flutter/material.dart';

/// Result returned from the order action sheet.
class OrderActionResult {
  final String action; // 'accept', 'reject', 'packing', 'ready', 'picked_up'
  final String? reason;
  final int? estimatedMinutes;

  const OrderActionResult({
    required this.action,
    this.reason,
    this.estimatedMinutes,
  });
}

/// Bottom sheet for performing actions on an order (accept, reject, packing, etc.)
class OrderActionSheet extends StatefulWidget {
  final String orderNumber;
  final String customerName;
  final String currentStatus;
  final double orderTotal;

  const OrderActionSheet({
    super.key,
    required this.orderNumber,
    required this.customerName,
    required this.currentStatus,
    required this.orderTotal,
  });

  static Future<OrderActionResult?> show(
    BuildContext context, {
    required String orderNumber,
    required String customerName,
    required String currentStatus,
    required double orderTotal,
  }) {
    return showModalBottomSheet<OrderActionResult>(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => OrderActionSheet(
        orderNumber: orderNumber,
        customerName: customerName,
        currentStatus: currentStatus,
        orderTotal: orderTotal,
      ),
    );
  }

  @override
  State<OrderActionSheet> createState() => _OrderActionSheetState();
}

class _OrderActionSheetState extends State<OrderActionSheet> {
  String? _rejectReason;
  int _estimatedMinutes = 15;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Order info
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Order ${widget.orderNumber}',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Customer: ${widget.customerName}',
                        style: TextStyle(color: Colors.grey[600], fontSize: 13),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    '₹${widget.orderTotal.toStringAsFixed(2)}',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Status badge
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _getStatusColor(
                  widget.currentStatus,
                ).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Icon(
                    _getStatusIcon(widget.currentStatus),
                    color: _getStatusColor(widget.currentStatus),
                    size: 20,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Current: ${_getStatusLabel(widget.currentStatus)}',
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      color: _getStatusColor(widget.currentStatus),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Action buttons based on current status
            if (widget.currentStatus == 'pending') ...[
              const Text(
                'Update Order Status',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildActionButton(
                      theme,
                      label: 'Accept Order',
                      icon: Icons.check_circle,
                      color: Colors.green,
                      onTap: () => Navigator.pop(
                        context,
                        OrderActionResult(action: 'accept'),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionButton(
                      theme,
                      label: 'Reject Order',
                      icon: Icons.cancel,
                      color: Colors.red,
                      onTap: _showRejectDialog,
                    ),
                  ),
                ],
              ),
            ],

            if (widget.currentStatus == 'accepted' ||
                widget.currentStatus == 'processing') ...[
              const Text(
                'Mark as Packing',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: _buildActionButton(
                  theme,
                  label: 'Start Packing',
                  icon: Icons.inventory_2,
                  color: Colors.blue,
                  onTap: () => Navigator.pop(
                    context,
                    OrderActionResult(action: 'packing'),
                  ),
                ),
              ),
            ],

            if (widget.currentStatus == 'packing') ...[
              const Text(
                'Ready for Pickup',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      decoration: const InputDecoration(
                        labelText: 'Est. minutes',
                        border: OutlineInputBorder(),
                        suffixText: 'min',
                      ),
                      keyboardType: TextInputType.number,
                      controller: TextEditingController(
                        text: _estimatedMinutes.toString(),
                      ),
                      onChanged: (v) =>
                          _estimatedMinutes = int.tryParse(v) ?? 15,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionButton(
                      theme,
                      label: 'Ready',
                      icon: Icons.check_circle,
                      color: Colors.green,
                      onTap: () => Navigator.pop(
                        context,
                        OrderActionResult(
                          action: 'ready',
                          estimatedMinutes: _estimatedMinutes,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],

            if (widget.currentStatus == 'ready') ...[
              SizedBox(
                width: double.infinity,
                child: _buildActionButton(
                  theme,
                  label: 'Mark Picked Up',
                  icon: Icons.local_shipping,
                  color: Colors.deepPurple,
                  onTap: () => Navigator.pop(
                    context,
                    OrderActionResult(action: 'picked_up'),
                  ),
                ),
              ),
            ],

            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(
    ThemeData theme, {
    required String label,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return SizedBox(
      height: 48,
      child: ElevatedButton.icon(
        onPressed: onTap,
        icon: Icon(icon, size: 20),
        label: Text(label, style: const TextStyle(fontSize: 13)),
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }

  void _showRejectDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reject Order'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Select a reason for rejection:'),
            const SizedBox(height: 16),
            RadioGroup<String>(
              groupValue: _rejectReason,
              onChanged: (value) {
                setState(() => _rejectReason = value);
                Navigator.pop(ctx);
              },
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children:
                    [
                          'Out of stock',
                          'Store closed',
                          'Delivery area unavailable',
                          'Other',
                        ]
                        .map(
                          (reason) => RadioListTile<String>(
                            title: Text(
                              reason,
                              style: const TextStyle(fontSize: 14),
                            ),
                            value: reason,
                          ),
                        )
                        .toList(),
              ),
            ),
          ],
        ),
      ),
    ).then((_) {
      if (!mounted) return;
      if (_rejectReason != null) {
        Navigator.pop(
          context,
          OrderActionResult(action: 'reject', reason: _rejectReason),
        );
      }
    });
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return Colors.orange;
      case 'accepted':
      case 'processing':
        return Colors.blue;
      case 'packing':
        return Colors.deepPurple;
      case 'ready':
        return Colors.teal;
      case 'picked_up':
      case 'delivered':
        return Colors.green;
      case 'cancelled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'pending':
        return Icons.hourglass_empty;
      case 'accepted':
      case 'processing':
        return Icons.sync;
      case 'packing':
        return Icons.inventory_2;
      case 'ready':
        return Icons.check_circle_outline;
      case 'picked_up':
        return Icons.local_shipping;
      case 'delivered':
        return Icons.check_circle;
      case 'cancelled':
        return Icons.cancel;
      default:
        return Icons.help;
    }
  }

  String _getStatusLabel(String status) {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'processing':
        return 'Processing';
      case 'packing':
        return 'Packing';
      case 'ready':
        return 'Ready for Pickup';
      case 'picked_up':
        return 'Picked Up';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }
}
