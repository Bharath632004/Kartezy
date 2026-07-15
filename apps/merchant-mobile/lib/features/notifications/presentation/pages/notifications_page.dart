import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

final notificationsListProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  return [];
});

class NotificationsPage extends ConsumerWidget {
  const NotificationsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final notificationsAsync = ref.watch(notificationsListProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          TextButton(
            onPressed: () {},
            child: Text('Mark All Read',
                style: TextStyle(fontSize: 12, color: theme.primaryColor)),
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.invalidate(notificationsListProvider),
          ),
        ],
      ),
      body: notificationsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.error_outline, size: 48, color: Colors.red[300]),
                const SizedBox(height: 16),
                Text('Failed to load notifications',
                    style: theme.textTheme.titleMedium),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.invalidate(notificationsListProvider),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
        data: (notifications) {
          if (notifications.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        color: theme.primaryColor.withValues(alpha: 0.08),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(Icons.notifications_none_outlined,
                          size: 48, color: theme.primaryColor),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'No notifications yet',
                      style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'You\'ll see order alerts, inventory updates and more here',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey[600], fontSize: 14),
                    ),
                    const SizedBox(height: 24),
                    OutlinedButton.icon(
                      onPressed: () => context.go('/orders'),
                      icon: const Icon(Icons.shopping_cart),
                      label: const Text('Orders'),
                    ),
                    const SizedBox(width: 12),
                    OutlinedButton.icon(
                      onPressed: () => context.go('/inventory'),
                      icon: const Icon(Icons.inventory),
                      label: const Text('Inventory'),
                    ),
                  ],
                ),
              ),
            );
          }
          return RefreshIndicator(
            onRefresh: () async => ref.invalidate(notificationsListProvider),
            child: ListView.builder(
              padding: const EdgeInsets.all(8),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notification = notifications[index];
                final isRead = notification['is_read'] == true;
                final type = notification['type'] as String? ?? 'info';

                IconData icon;
                Color iconColor;
                switch (type) {
                  case 'order':
                    icon = Icons.shopping_cart;
                    iconColor = Colors.blue;
                    break;
                  case 'inventory':
                    icon = Icons.inventory;
                    iconColor = Colors.orange;
                    break;
                  case 'settlement':
                    icon = Icons.account_balance_wallet;
                    iconColor = Colors.green;
                    break;
                  case 'promotion':
                    icon = Icons.local_offer;
                    iconColor = Colors.purple;
                    break;
                  default:
                    icon = Icons.notifications;
                    iconColor = Colors.grey;
                }

                return Card(
                  margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 8),
                  color: isRead ? null : theme.primaryColor.withValues(alpha: 0.03),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: iconColor.withValues(alpha: 0.1),
                      child: Icon(icon, color: iconColor, size: 20),
                    ),
                    title: Text(
                      notification['title'] ?? 'Notification',
                      style: TextStyle(
                        fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                      ),
                    ),
                    subtitle: Text(
                      notification['message'] ?? '',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          notification['created_at'] ?? '',
                          style: const TextStyle(fontSize: 10, color: Colors.grey),
                        ),
                        if (!isRead)
                          Container(
                            margin: const EdgeInsets.only(top: 4),
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Colors.blue,
                              shape: BoxShape.circle,
                            ),
                          ),
                      ],
                    ),
                    onTap: () => _handleNotificationTap(context, notification),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }

  void _handleNotificationTap(BuildContext context, Map<String, dynamic> notification) {
    final type = notification['type'] as String?;
    switch (type) {
      case 'order':
        context.go('/orders');
        break;
      case 'inventory':
        context.go('/inventory');
        break;
      case 'settlement':
        context.go('/finance');
        break;
      case 'promotion':
        context.go('/promotions');
        break;
      default:
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Notification opened')),
        );
    }
  }
}
