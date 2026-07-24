import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Transaction model
class Transaction {
  final String id;
  final String type; // 'payment', 'settlement', 'refund', 'withdrawal', 'fee'
  final double amount;
  final String description;
  final String status; // 'completed', 'pending', 'failed'
  final DateTime timestamp;

  const Transaction({
    required this.id,
    required this.type,
    required this.amount,
    required this.description,
    required this.status,
    required this.timestamp,
  });
}

final walletBalanceProvider = StateProvider<double>((ref) => 45280.50);

final transactionsProvider = Provider<List<Transaction>>((ref) {
  return [
    Transaction(
      id: 'tx1',
      type: 'payment',
      amount: 1250.00,
      description: 'Order #ORD-0042 - Customer payment',
      status: 'completed',
      timestamp: DateTime.now().subtract(const Duration(hours: 1)),
    ),
    Transaction(
      id: 'tx2',
      type: 'payment',
      amount: 890.50,
      description: 'Order #ORD-0041 - Customer payment',
      status: 'completed',
      timestamp: DateTime.now().subtract(const Duration(hours: 3)),
    ),
    Transaction(
      id: 'tx3',
      type: 'settlement',
      amount: 15200.00,
      description: 'Weekly settlement - Week 21',
      status: 'pending',
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
    ),
    Transaction(
      id: 'tx4',
      type: 'fee',
      amount: -49.50,
      description: 'Platform fee - May 2026',
      status: 'completed',
      timestamp: DateTime.now().subtract(const Duration(days: 2)),
    ),
    Transaction(
      id: 'tx5',
      type: 'withdrawal',
      amount: -10000.00,
      description: 'Withdrawal to Bank Account ****1234',
      status: 'completed',
      timestamp: DateTime.now().subtract(const Duration(days: 3)),
    ),
  ];
});

/// Wallet & Transaction History Page
class WalletPage extends ConsumerWidget {
  const WalletPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final balance = ref.watch(walletBalanceProvider);
    final transactions = ref.watch(transactionsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Wallet & Transactions')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Balance Card
          Card(
            elevation: 2,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                gradient: LinearGradient(
                  colors: [
                    theme.colorScheme.primary,
                    theme.colorScheme.primary.withValues(alpha: 0.8),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Available Balance',
                    style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.8),
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '₹${balance.toStringAsFixed(2)}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.add, size: 18),
                          label: const Text('Add Funds'),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.white,
                            side: BorderSide(
                              color: Colors.white.withValues(alpha: 0.5),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.arrow_upward, size: 18),
                          label: const Text('Withdraw'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: theme.colorScheme.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Quick Stats
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  theme,
                  title: "Today's Revenue",
                  value: '₹2,140.50',
                  icon: Icons.today,
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                  theme,
                  title: 'Pending Settlement',
                  value: '₹15,200.00',
                  icon: Icons.schedule,
                  color: Colors.orange,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Transactions header
          Row(
            children: [
              Text(
                'Recent Transactions',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              TextButton(onPressed: () {}, child: const Text('View All')),
            ],
          ),
          const SizedBox(height: 8),

          // Transaction list
          ...transactions.map((tx) => _buildTransactionTile(theme, tx)),
        ],
      ),
    );
  }

  Widget _buildStatCard(
    ThemeData theme, {
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 20),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionTile(ThemeData theme, Transaction tx) {
    final isCredit = tx.amount > 0;
    final typeConfig = _getTransactionTypeConfig(tx.type);

    return Card(
      margin: const EdgeInsets.only(bottom: 6),
      child: ListTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: typeConfig.color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(typeConfig.icon, color: typeConfig.color, size: 20),
        ),
        title: Text(
          tx.description,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
        ),
        subtitle: Row(
          children: [
            Text(
              _formatTimestamp(tx.timestamp),
              style: TextStyle(fontSize: 11, color: Colors.grey[500]),
            ),
            const SizedBox(width: 8),
            _buildStatusBadge(tx.status),
          ],
        ),
        trailing: Text(
          '${isCredit ? '+' : ''}₹${tx.amount.abs().toStringAsFixed(2)}',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
            color: isCredit ? Colors.green : Colors.red,
          ),
        ),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    String label;
    switch (status) {
      case 'completed':
        color = Colors.green;
        label = 'Completed';
      case 'pending':
        color = Colors.orange;
        label = 'Pending';
      case 'failed':
        color = Colors.red;
        label = 'Failed';
      default:
        color = Colors.grey;
        label = status;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 10,
          color: color,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  ({IconData icon, Color color}) _getTransactionTypeConfig(String type) {
    switch (type) {
      case 'payment':
        return (icon: Icons.shopping_cart, color: Colors.green);
      case 'settlement':
        return (icon: Icons.account_balance, color: Colors.blue);
      case 'refund':
        return (icon: Icons.replay, color: Colors.orange);
      case 'withdrawal':
        return (icon: Icons.arrow_upward, color: Colors.red);
      case 'fee':
        return (icon: Icons.money_off, color: Colors.grey);
      default:
        return (icon: Icons.receipt, color: Colors.grey);
    }
  }

  String _formatTimestamp(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${dt.day}/${dt.month}/${dt.year}';
  }
}
