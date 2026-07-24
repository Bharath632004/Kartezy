import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

/// World-class earnings and wallet page.
class EarningsPage extends ConsumerStatefulWidget {
  const EarningsPage({super.key});

  @override
  ConsumerState<EarningsPage> createState() => _EarningsPageState();
}

class _EarningsPageState extends ConsumerState<EarningsPage>
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
      backgroundColor: theme.colorScheme.surfaceContainerLowest,
      appBar: AppBar(
        title: const Text('Earnings'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Today'),
            Tab(text: 'This Week'),
            Tab(text: 'This Month'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Wallet Balance Card
          _buildWalletCard(theme),
          // Tab Content
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildEarningsList(theme, 'today'),
                _buildEarningsList(theme, 'week'),
                _buildEarningsList(theme, 'month'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWalletCard(ThemeData theme) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF6C3AE1), Color(0xFF9B6BF7)],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6C3AE1).withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Wallet Balance',
            style: TextStyle(color: Colors.white70, fontSize: 14),
          ),
          const SizedBox(height: 4),
          const Text(
            '₹2,450.00',
            style: TextStyle(
              color: Colors.white,
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => context.push('/wallet/withdraw'),
                  icon: const Icon(Icons.account_balance, size: 18),
                  label: const Text('Withdraw'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF6C3AE1),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () => context.push('/wallet/history'),
                  icon: const Icon(Icons.history, size: 18),
                  label: const Text('History'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white38),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildEarningsList(ThemeData theme, String period) {
    final items = _getEarningsItems(period);

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Summary chips
          _buildSummaryChips(theme, period),
          const SizedBox(height: 16),
          // Earnings breakdown
          Text(
            'Earnings Breakdown',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          ...items.map(
            (item) => _EarningsItem(
              icon: item['icon'] as IconData,
              label: item['label'] as String,
              amount: item['amount'] as String,
              color: item['color'] as Color,
              count: item['count'] as int?,
            ),
          ),
          const SizedBox(height: 16),
          // Tax summary
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: ListTile(
              leading: const Icon(Icons.receipt_long, color: Colors.orange),
              title: const Text('Tax Summary'),
              subtitle: const Text('View TDS and tax details'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {},
            ),
          ),
          const SizedBox(height: 80),
        ],
      ),
    );
  }

  Widget _buildSummaryChips(ThemeData theme, String period) {
    final summaryData = {
      'today': {'total': '₹847', 'orders': '12', 'avg': '₹70.6'},
      'week': {'total': '₹5,230', 'orders': '72', 'avg': '₹72.6'},
      'month': {'total': '₹18,450', 'orders': '256', 'avg': '₹72.1'},
    };
    final data = summaryData[period]!;

    return Row(
      children: [
        _SummaryChip(
          label: 'Total',
          value: data['total']!,
          color: Colors.green,
        ),
        const SizedBox(width: 8),
        _SummaryChip(
          label: 'Orders',
          value: data['orders']!,
          color: Colors.blue,
        ),
        const SizedBox(width: 8),
        _SummaryChip(
          label: 'Avg/Order',
          value: data['avg']!,
          color: Colors.purple,
        ),
      ],
    );
  }

  List<Map<String, dynamic>> _getEarningsItems(String period) {
    return [
      {
        'icon': Icons.delivery_dining,
        'label': 'Delivery Fees',
        'amount': '₹620',
        'color': Colors.blue,
        'count': 12,
      },
      {
        'icon': Icons.volunteer_activism,
        'label': 'Tips',
        'amount': '₹147',
        'color': Colors.pink,
        'count': 8,
      },
      {
        'icon': Icons.emoji_events,
        'label': 'Bonuses',
        'amount': '₹80',
        'color': Colors.amber,
        'count': 1,
      },
      {
        'icon': Icons.local_offer,
        'label': 'Incentives',
        'amount': '₹0',
        'color': Colors.green,
        'count': 0,
      },
      {
        'icon': Icons.card_giftcard,
        'label': 'Referral Bonus',
        'amount': '₹0',
        'color': Colors.purple,
        'count': 0,
      },
    ];
  }
}

class _SummaryChip extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  const _SummaryChip({
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: TextStyle(fontSize: 11, color: Colors.grey[600]),
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EarningsItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String amount;
  final Color color;
  final int? count;
  const _EarningsItem({
    required this.icon,
    required this.label,
    required this.amount,
    required this.color,
    this.count,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color, size: 20),
        ),
        title: Text(label, style: const TextStyle(fontWeight: FontWeight.w500)),
        subtitle: count != null
            ? Text('$count transactions', style: const TextStyle(fontSize: 12))
            : null,
        trailing: Text(
          amount,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
    );
  }
}
