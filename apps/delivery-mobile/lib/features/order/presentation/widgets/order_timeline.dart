import 'package:flutter/material.dart';
import 'package:customer_mobile/shared/models/order.dart';
import 'package:intl/intl.dart';

class OrderTimeline extends StatelessWidget {
  final Order order;

  const OrderTimeline({Key? key, required this.order}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Define the timeline steps
    final List<Map<String, dynamic>> steps = [
      {
        'title': 'Order Placed',
        'icon': Icons.shopping_cart,
        'time': order.createdAt,
        'status': _getStepStatus(0),
      },
      {
        'title': 'Order Confirmed',
        'icon': Icons.check_circle_outline,
        'time': order.updatedAt, // We don't have a separate time, use updatedAs approximation
        'status': _getStepStatus(1),
      },
      {
        'title': 'Processing',
        'icon': Icons.restaurant_menu,
        'time': null, // We don't have a time for this step
        'status': _getStepStatus(2),
      },
      {
        'title': 'Ready for Pickup',
        'icon': Icons.local_dining,
        'time': null, // We don't have a time for this step
        'status': _getStepStatus(3),
      },
      {
        'title': 'Out for Delivery',
        'icon': Icons.delivery_dining,
        'time': null, // We don't have a time for this step
        'status': _getStepStatus(4),
      },
      {
        'title': 'Delivered',
        'icon': Icons.check_circle,
        'time': order.orderStatus.toLowerCase() == 'delivered' ? order.updatedAt : null,
        'status': _getStepStatus(5),
      },
    ];

    return Column(
      children: steps.asMap().entries.map((entry) {
        final int index = entry.key;
        final Map<String, dynamic> step = entry.value;
        return _buildTimelineStep(context, step, index == steps.length - 1);
      }).toList(),
    );
  }

  /// Determine the status of a step based on the order status
  String _getStepStatus(int stepIndex) {
    final String status = order.orderStatus.toLowerCase();
    // Map order status to step index
    int currentStep = -1;
    switch (status) {
      case 'pending':
        currentStep = 0;
        break;
      case 'confirmed':
        currentStep = 1;
        break;
      case 'processing':
        currentStep = 2;
        break;
      case 'ready_for_pickup':
        currentStep = 3;
        break;
      case 'out_for_delivery':
        currentStep = 4;
        break;
      case 'delivered':
        currentStep = 5;
        break;
      case 'cancelled':
        // For cancelled, we consider the step before cancellation as completed, and the current step as cancelled?
        // We don't have info on when it was cancelled, so we'll show all steps as completed except the last one as cancelled?
        // For simplicity, we'll show steps up to index 2 as completed and the rest as cancelled.
        // This is arbitrary.
        if (stepIndex < 3) {
          return 'completed';
        } else {
          return 'cancelled';
        }
      case 'returned':
        // Similar to cancelled, but we'll show all steps as completed and the last as returned?
        if (stepIndex < 5) {
          return 'completed';
        } else {
          return 'returned';
        }
      case 'refunded':
        // Similar to returned
        if (stepIndex < 5) {
          return 'completed';
        } else {
          return 'refunded';
        }
      default:
        currentStep = -1;
    }

    if (currentStep == -1) {
      // Unknown status, treat as pending for the first step
      return stepIndex == 0 ? 'active' : 'pending';
    }

    if (stepIndex < currentStep) {
      return 'completed';
    } else if (stepIndex == currentStep) {
      return 'active';
    } else {
      return 'pending';
    }
  }

  Widget _buildTimelineStep(BuildContext context, Map<String, dynamic> step, bool isLast) {
    final String status = step['status'];
    final IconData icon = step['icon'];
    final String title = step['title'];
    final DateTime? time = step['time'];

    // Determine colors based on status
    Color iconColor;
    Color lineColor;
    String timeText = '';

    switch (status) {
      case 'completed':
        iconColor = Colors.green;
        lineColor = Colors.green;
        if (time != null) {
          timeText = DateFormat('hh:mm a').format(time);
        }
        break;
      case 'active':
        iconColor = Theme.of(context).primaryColor;
        lineColor = Theme.of(context).primaryColor;
        if (time != null) {
          timeText = DateFormat('hh:mm a').format(time);
        }
        break;
      case 'pending':
        iconColor = Colors.grey[400]!;
        lineColor = Colors.grey[300]!;
        break;
      case 'cancelled':
        iconColor = Colors.red;
        lineColor = Colors.red;
        break;
      case 'returned':
        iconColor = Colors.orange;
        lineColor = Colors.orange;
        break;
      case 'refunded':
        iconColor = Colors.purple;
        lineColor = Colors.purple;
        break;
      default:
        iconColor = Colors.grey[400]!;
        lineColor = Colors.grey[300]!;
    }

    return Column(
      children: [
        Row(
          children: [
            // Vertical line (except for the first item)
            if (!isLast)
              Container(
                width: 24,
                height: 24,
                alignment: Alignment.center,
                child: Container(
                  width: 2,
                  height: 24,
                  color: lineColor,
                ),
              )
            else
              const SizedBox(width: 24),
            // Circle
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: iconColor,
                  width: 2,
                ),
                color: status == 'completed' || status == 'active'
                    ? iconColor.withOpacity(0.2)
                    : Colors.transparent,
              ),
              child: Icon(
                icon,
                size: 18,
                color: iconColor,
              ),
            ),
            const SizedBox(width: 12),
            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontWeight:
                          status == 'active' || status == 'completed'
                              ? FontWeight.bold
                              : FontWeight.normal,
                      color: status == 'active' || status == 'completed'
                          ? Colors.black
                          : Colors.grey[600],
                    ),
                  ),
                  if (timeText.isNotEmpty)
                    Text(
                      timeText,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
        // Horizontal line to the next step (except for the last item)
        if (!isLast)
          Container(
            margin: const EdgeInsets.only(left: 24, top: 8, bottom: 8),
            width: 1.0,
            color: lineColor,
          ),
      ],
    );
  }
}