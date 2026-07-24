import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

/// Chat list page showing all conversations.
class ChatListPage extends ConsumerWidget {
  const ChatListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages'),
        actions: [IconButton(icon: const Icon(Icons.search), onPressed: () {})],
      ),
      body: DefaultTabController(
        length: 3,
        child: Column(
          children: [
            const TabBar(
              tabs: [
                Tab(text: 'Customers'),
                Tab(text: 'Merchants'),
                Tab(text: 'Support'),
              ],
            ),
            Expanded(
              child: TabBarView(
                children: [
                  _buildChatList(theme, 'customer'),
                  _buildChatList(theme, 'merchant'),
                  _buildChatList(theme, 'support'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChatList(ThemeData theme, String type) {
    // Demo chats
    final chats = [
      {
        'name': type == 'customer'
            ? 'Amit Singh'
            : type == 'merchant'
            ? 'Fresh Mart'
            : 'Support Team',
        'lastMessage': type == 'customer'
            ? 'Please leave at the gate'
            : type == 'merchant'
            ? 'Order ready for pickup'
            : 'How can we help?',
        'time': '2 min ago',
        'unread': type == 'customer' ? 2 : 0,
        'orderId': 'ORD-12345',
      },
    ];

    if (chats.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.chat_bubble_outline, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No conversations yet',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      itemCount: chats.length,
      itemBuilder: (context, index) {
        final chat = chats[index];
        return ListTile(
          leading: Stack(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: type == 'customer'
                    ? Colors.blue.withValues(alpha: 0.1)
                    : type == 'merchant'
                    ? Colors.orange.withValues(alpha: 0.1)
                    : Colors.green.withValues(alpha: 0.1),
                child: Icon(
                  type == 'customer'
                      ? Icons.person
                      : type == 'merchant'
                      ? Icons.store
                      : Icons.support_agent,
                  color: type == 'customer'
                      ? Colors.blue
                      : type == 'merchant'
                      ? Colors.orange
                      : Colors.green,
                ),
              ),
              if (chat['unread'] != 0)
                Positioned(
                  right: 0,
                  top: 0,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '${chat['unread']}',
                      style: const TextStyle(color: Colors.white, fontSize: 10),
                    ),
                  ),
                ),
            ],
          ),
          title: Text(
            chat['name']!,
            style: TextStyle(
              fontWeight: chat['unread'] != 0
                  ? FontWeight.bold
                  : FontWeight.normal,
            ),
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                chat['lastMessage']!,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 13,
                  fontWeight: chat['unread'] != 0
                      ? FontWeight.w500
                      : FontWeight.normal,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2),
              Text(
                '${chat['orderId']} • ${chat['time']}',
                style: TextStyle(color: Colors.grey[400], fontSize: 11),
              ),
            ],
          ),
          trailing: Icon(Icons.chevron_right, color: Colors.grey[400]),
          onTap: () => context.push('/chat/room'),
        );
      },
    );
  }
}
