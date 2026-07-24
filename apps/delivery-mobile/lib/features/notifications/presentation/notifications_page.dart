import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Notifications page for delivery partners.
class NotificationsPage extends ConsumerWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          TextButton(onPressed: () {}, child: const Text('Mark All Read')),
        ],
      ),
      body: DefaultTabController(
        length: 4,
        child: Column(
          children: [
            const TabBar(
              isScrollable: true,
              tabs: [
                Tab(text: 'All'),
                Tab(text: 'Orders'),
                Tab(text: 'Earnings'),
                Tab(text: 'System'),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  _buildNotificationsList(theme, 'all'),
                  _buildNotificationsList(theme, 'orders'),
                  _buildNotificationsList(theme, 'earnings'),
                  _buildNotificationsList(theme, 'system'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationsList(ThemeData theme, String category) {
    final notifications = _getNotifications(category);

    if (notifications.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.notifications_none, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No notifications',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      itemCount: notifications.length,
      itemBuilder: (context, index) {
        final n = notifications[index];
        return _NotificationTile(
          icon: n['icon'] as IconData,
          title: n['title'] as String,
          subtitle: n['subtitle'] as String,
          time: n['time'] as String,
          color: n['color'] as Color,
          isRead: n['isRead'] as bool,
        );
      },
    );
  }

  List<Map<String, dynamic>> _getNotifications(String category) {
    return [
      {
        'icon': Icons.shopping_bag,
        'title': 'New Order Assigned',
        'subtitle': 'Order #ORD-12345 from Fresh Mart - ₹450',
        'time': '2 min ago',
        'color': Colors.blue,
        'isRead': false,
        'type': 'orders',
      },
      {
        'icon': Icons.emoji_events,
        'title': 'Bonus Earned!',
        'subtitle': 'You earned ₹80 bonus for completing 5 orders in a row',
        'time': '15 min ago',
        'color': Colors.amber,
        'isRead': false,
        'type': 'earnings',
      },
      {
        'icon': Icons.account_balance_wallet,
        'title': 'Wallet Credited',
        'subtitle': '₹620 credited to your wallet for today\'s deliveries',
        'time': '1 hour ago',
        'color': Colors.green,
        'isRead': true,
        'type': 'earnings',
      },
      {
        'icon': Icons.star,
        'title': 'New 5-Star Rating',
        'subtitle': 'Customer Amit gave you a 5-star rating!',
        'time': '2 hours ago',
        'color': Colors.amber,
        'isRead': true,
        'type': 'orders',
      },
      {
        'icon': Icons.campaign,
        'title': 'Platform Announcement',
        'subtitle':
            'New incentive program launched! Earn extra for peak hours.',
        'time': '3 hours ago',
        'color': Colors.purple,
        'isRead': true,
        'type': 'system',
      },
      {
        'icon': Icons.speed,
        'title': 'Performance Update',
        'subtitle': 'Your on-time delivery rate improved to 94%!',
        'time': '5 hours ago',
        'color': Colors.teal,
        'isRead': true,
        'type': 'system',
      },
    ].where((n) => category == 'all' || n['type'] == category).toList();
  }
}

class _NotificationTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String time;
  final Color color;
  final bool isRead;

  const _NotificationTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.time,
    required this.color,
    required this.isRead,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: isRead ? null : color.withValues(alpha: 0.03),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withValues(alpha: 0.1),
          child: Icon(icon, color: color, size: 20),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
            fontSize: 14,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: TextStyle(color: Colors.grey[600], fontSize: 13),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(time, style: TextStyle(color: Colors.grey[400], fontSize: 11)),
          ],
        ),
        isThreeLine: true,
        trailing: !isRead
            ? Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              )
            : null,
      ),
    );
  }
}
