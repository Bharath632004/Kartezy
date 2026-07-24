import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Message model for order chat
class OrderMessage {
  final String id;
  final String senderName;
  final String message;
  final DateTime timestamp;
  final bool isMerchant;

  const OrderMessage({
    required this.id,
    required this.senderName,
    required this.message,
    required this.timestamp,
    required this.isMerchant,
  });
}

final orderChatsProvider = Provider<List<Map<String, dynamic>>>((ref) {
  return [
    {
      'orderId': 'ORD-001',
      'customerName': 'Rahul Sharma',
      'lastMessage': 'When will my order arrive?',
      'lastMessageTime': DateTime.now().subtract(const Duration(minutes: 5)),
      'unreadCount': 2,
      'messages': [
        OrderMessage(
          id: 'm1',
          senderName: 'Rahul Sharma',
          message: 'Hi, I ordered some items. When will they arrive?',
          timestamp: DateTime.now().subtract(const Duration(minutes: 10)),
          isMerchant: false,
        ),
      ],
    },
  ];
});

/// Customer Communication Page
class CommunicationPage extends ConsumerStatefulWidget {
  const CommunicationPage({super.key});

  @override
  ConsumerState<CommunicationPage> createState() => _CommunicationPageState();
}

class _CommunicationPageState extends ConsumerState<CommunicationPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Customer Communication'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Order Chat'),
            Tab(text: 'Broadcast'),
            Tab(text: 'Tickets'),
          ],
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: Colors.grey,
          indicatorColor: theme.colorScheme.primary,
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildOrderChatTab(theme),
          _buildBroadcastTab(theme),
          _buildTicketsTab(theme),
        ],
      ),
    );
  }

  Widget _buildOrderChatTab(ThemeData theme) {
    final chats = ref.watch(orderChatsProvider);

    if (chats.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.chat_bubble_outline, size: 64, color: Colors.grey[300]),
            const SizedBox(height: 16),
            Text(
              'No conversations',
              style: TextStyle(color: Colors.grey[600], fontSize: 16),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(8),
      itemCount: chats.length,
      itemBuilder: (context, index) {
        final chat = chats[index];
        final unread = chat['unreadCount'] as int? ?? 0;
        final lastTime = chat['lastMessageTime'] as DateTime?;

        return Card(
          margin: const EdgeInsets.symmetric(vertical: 4),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: unread > 0
                  ? theme.colorScheme.primary
                  : Colors.grey.shade200,
              child: Text(
                (chat['customerName'] as String? ?? '?')[0],
                style: TextStyle(
                  color: unread > 0 ? Colors.white : Colors.grey[600],
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            title: Text(
              chat['customerName'] as String? ?? 'Customer',
              style: TextStyle(
                fontWeight: unread > 0 ? FontWeight.bold : FontWeight.normal,
              ),
            ),
            subtitle: Text(
              chat['lastMessage'] as String? ?? '',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                if (lastTime != null)
                  Text(
                    _formatTime(lastTime),
                    style: const TextStyle(fontSize: 11, color: Colors.grey),
                  ),
                if (unread > 0) ...[
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      '$unread',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ],
            ),
            onTap: () {
              _openChat(context, chat);
            },
          ),
        );
      },
    );
  }

  Widget _buildBroadcastTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.campaign, color: theme.colorScheme.primary),
                      const SizedBox(width: 8),
                      Text(
                        'Send Broadcast Message',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const TextField(
                    maxLines: 4,
                    decoration: InputDecoration(
                      hintText: 'Type your broadcast message...',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.people, size: 18),
                          label: const Text('All Customers'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.repeat, size: 18),
                          label: const Text('Repeat Customers'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.send),
                      label: const Text('Send Broadcast'),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Broadcast History',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Center(
            child: Text(
              'No broadcasts sent yet',
              style: TextStyle(color: Colors.grey[500]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTicketsTab(ThemeData theme) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            Text(
              'Support Tickets',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const Spacer(),
            TextButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.add, size: 18),
              label: const Text('New Ticket'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.support_agent, size: 64, color: Colors.grey[300]),
              const SizedBox(height: 16),
              Text(
                'No open tickets',
                style: TextStyle(color: Colors.grey[600], fontSize: 16),
              ),
              const SizedBox(height: 8),
              Text(
                'Customer issues and escalations will appear here',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[500], fontSize: 13),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _openChat(BuildContext context, Map<String, dynamic> chat) {
    final theme = Theme.of(context);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.85,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (context, scrollController) {
          final messages = chat['messages'] as List<OrderMessage>? ?? [];
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom,
            ),
            child: Column(
              children: [
                // Handle
                Padding(
                  padding: const EdgeInsets.only(top: 8, bottom: 4),
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.grey[300],
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                // Header
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: Row(
                    children: [
                      Text(
                        'Chat with ${chat['customerName'] ?? 'Customer'}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(ctx),
                      ),
                    ],
                  ),
                ),
                const Divider(),
                // Messages list
                Expanded(
                  child: ListView.builder(
                    controller: scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: messages.length,
                    itemBuilder: (context, index) {
                      final msg = messages[index];
                      return Align(
                        alignment: msg.isMerchant
                            ? Alignment.centerRight
                            : Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 10,
                          ),
                          decoration: BoxDecoration(
                            color: msg.isMerchant
                                ? theme.colorScheme.primary
                                : Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(16).copyWith(
                              bottomRight: msg.isMerchant
                                  ? const Radius.circular(4)
                                  : const Radius.circular(16),
                              bottomLeft: msg.isMerchant
                                  ? const Radius.circular(16)
                                  : const Radius.circular(4),
                            ),
                          ),
                          child: Text(
                            msg.message,
                            style: TextStyle(
                              color: msg.isMerchant ? Colors.white : null,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                // Message input
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surface,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withValues(alpha: 0.2),
                        blurRadius: 4,
                        offset: const Offset(0, -2),
                      ),
                    ],
                  ),
                  child: SafeArea(
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.add_circle_outline),
                          onPressed: () {},
                        ),
                        Expanded(
                          child: TextField(
                            decoration: InputDecoration(
                              hintText: 'Type a message...',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(24),
                              ),
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 10,
                              ),
                              filled: true,
                              fillColor: Colors.grey.shade50,
                            ),
                          ),
                        ),
                        IconButton(
                          icon: Icon(
                            Icons.send,
                            color: theme.colorScheme.primary,
                          ),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final diff = now.difference(dateTime);

    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${dateTime.day}/${dateTime.month}';
  }
}
