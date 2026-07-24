import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Settlement model
class Settlement {
  final String id;
  final String period;
  final double amount;
  final double commission;
  final double netAmount;
  final String status; // 'pending', 'processing', 'completed', 'failed'
  final DateTime expectedDate;
  final String? transactionRef;

  const Settlement({
    required this.id,
    required this.period,
    required this.amount,
    required this.commission,
    required this.netAmount,
    required this.status,
    required this.expectedDate,
    this.transactionRef,
  });
}

final settlementsProvider = Provider<List<Settlement>>((ref) {
  return [
    Settlement(
      id: 'st1',
      period: 'May 18 - May 24, 2026',
      amount: 45280.00,
      commission: 2264.00,
      netAmount: 43016.00,
      status: 'pending',
      expectedDate: DateTime.now().add(const Duration(days: 2)),
    ),
    Settlement(
      id: 'st2',
      period: 'May 11 - May 17, 2026',
      amount: 38150.00,
      commission: 1907.50,
      netAmount: 36242.50,
      status: 'completed',
      expectedDate: DateTime.now().subtract(const Duration(days: 5)),
      transactionRef: 'TXN-2026-0518-001',
    ),
    Settlement(
      id: 'st3',
      period: 'May 4 - May 10, 2026',
      amount: 42100.00,
      commission: 2105.00,
      netAmount: 39995.00,
      status: 'completed',
      expectedDate: DateTime.now().subtract(const Duration(days: 12)),
      transactionRef: 'TXN-2026-0511-002',
    ),
  ];
});

/// Settlements & Payouts Page
class SettlementsPage extends ConsumerWidget {
  const SettlementsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final settlements = ref.watch(settlementsProvider);

    final totalPending = settlements
        .where((s) => s.status == 'pending' || s.status == 'processing')
        .fold<double>(0, (sum, s) => sum + s.netAmount);

    final totalCompleted = settlements
        .where((s) => s.status == 'completed')
        .fold<double>(0, (sum, s) => sum + s.netAmount);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settlements'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: () {}),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Summary
          Row(
            children: [
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Pending',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '₹${totalPending.toStringAsFixed(2)}',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.orange[700],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Completed',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '₹${totalCompleted.toStringAsFixed(2)}',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.green[700],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Bank account info
          Card(
            child: ListTile(
              leading: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.account_balance, color: Colors.blue),
              ),
              title: const Text('HDFC Bank ****1234'),
              subtitle: const Text('Settlements in 2-3 business days'),
              trailing: IconButton(
                icon: const Icon(Icons.edit, size: 20),
                onPressed: () {},
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Settlement list
          Text(
            'Settlement History',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          ...settlements.map((s) => _buildSettlementCard(theme, s)),
        ],
      ),
    );
  }

  Widget _buildSettlementCard(ThemeData theme, Settlement settlement) {
    final statusConfig = _getStatusConfig(settlement.status);

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    settlement.period,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: statusConfig.color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    statusConfig.label,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: statusConfig.color,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildAmountRow(
                    'Gross Amount',
                    settlement.amount,
                    Colors.black87,
                  ),
                ),
                Expanded(
                  child: _buildAmountRow(
                    'Commission',
                    -settlement.commission,
                    Colors.red,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: _buildAmountRow(
                    'Net Amount',
                    settlement.netAmount,
                    Colors.green,
                    bold: true,
                  ),
                ),
                Expanded(
                  child: settlement.transactionRef != null
                      ? _buildAmountRow(
                          'Ref: ${settlement.transactionRef!}',
                          0,
                          Colors.grey,
                        )
                      : const SizedBox(),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.calendar_today, size: 14, color: Colors.grey[500]),
                const SizedBox(width: 4),
                Text(
                  'Expected: ${settlement.expectedDate.day}/${settlement.expectedDate.month}/${settlement.expectedDate.year}',
                  style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAmountRow(
    String label,
    double amount,
    Color color, {
    bool bold = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 11, color: Colors.grey[600])),
        const SizedBox(height: 2),
        Text(
          amount >= 0
              ? '₹${amount.toStringAsFixed(2)}'
              : '-₹${amount.abs().toStringAsFixed(2)}',
          style: TextStyle(
            fontSize: bold ? 16 : 14,
            fontWeight: bold ? FontWeight.bold : FontWeight.w600,
            color: color,
          ),
        ),
      ],
    );
  }

  ({Color color, String label}) _getStatusConfig(String status) {
    switch (status) {
      case 'pending':
        return (color: Colors.orange, label: 'Pending');
      case 'processing':
        return (color: Colors.blue, label: 'Processing');
      case 'completed':
        return (color: Colors.green, label: 'Completed');
      case 'failed':
        return (color: Colors.red, label: 'Failed');
      default:
        return (color: Colors.grey, label: status);
    }
  }
}
