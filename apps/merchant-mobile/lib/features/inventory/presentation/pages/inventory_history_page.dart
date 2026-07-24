import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Inventory history entry model
class InventoryHistoryEntry {
  final String id;
  final String productName;
  final String sku;
  final String type; // 'adjustment', 'transfer', 'received', 'sold', 'returned'
  final int quantityChange;
  final int quantityAfter;
  final String? reason;
  final String? performedBy;
  final DateTime timestamp;

  const InventoryHistoryEntry({
    required this.id,
    required this.productName,
    required this.sku,
    required this.type,
    required this.quantityChange,
    required this.quantityAfter,
    this.reason,
    this.performedBy,
    required this.timestamp,
  });
}

final inventoryHistoryProvider = Provider<List<InventoryHistoryEntry>>((ref) {
  return [
    InventoryHistoryEntry(
      id: 'h1',
      productName: 'Basmati Rice 5kg',
      sku: 'RICE-BAS-5KG',
      type: 'received',
      quantityChange: 50,
      quantityAfter: 150,
      reason: 'Supplier restock',
      performedBy: 'Store Manager',
      timestamp: DateTime.now().subtract(const Duration(hours: 2)),
    ),
    InventoryHistoryEntry(
      id: 'h2',
      productName: 'Toor Dal 1kg',
      sku: 'DAL-TOOR-1KG',
      type: 'sold',
      quantityChange: -5,
      quantityAfter: 45,
      timestamp: DateTime.now().subtract(const Duration(hours: 4)),
    ),
    InventoryHistoryEntry(
      id: 'h3',
      productName: 'Sunflower Oil 1L',
      sku: 'OIL-SUN-1L',
      type: 'adjustment',
      quantityChange: -2,
      quantityAfter: 18,
      reason: 'Damaged goods',
      performedBy: 'Inventory Manager',
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
    ),
  ];
});

/// Inventory History & Audit Page
class InventoryHistoryPage extends ConsumerStatefulWidget {
  const InventoryHistoryPage({super.key});

  @override
  ConsumerState<InventoryHistoryPage> createState() =>
      _InventoryHistoryPageState();
}

class _InventoryHistoryPageState extends ConsumerState<InventoryHistoryPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
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
        title: const Text('Inventory History'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'History'),
            Tab(text: 'Audit Log'),
          ],
          labelColor: theme.colorScheme.primary,
          unselectedLabelColor: Colors.grey,
          indicatorColor: theme.colorScheme.primary,
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [_buildHistoryTab(theme), _buildAuditTab(theme)],
      ),
    );
  }

  Widget _buildHistoryTab(ThemeData theme) {
    final history = ref.watch(inventoryHistoryProvider);

    if (history.isEmpty) {
      return const Center(child: Text('No inventory history found'));
    }

    return Column(
      children: [
        // Filters
        Container(
          padding: const EdgeInsets.all(12),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip('All', true),
                const SizedBox(width: 8),
                _buildFilterChip('Received', false),
                const SizedBox(width: 8),
                _buildFilterChip('Sold', false),
                const SizedBox(width: 8),
                _buildFilterChip('Adjusted', false),
                const SizedBox(width: 8),
                _buildFilterChip('Transferred', false),
              ],
            ),
          ),
        ),
        Expanded(
          child: RefreshIndicator(
            onRefresh: () async {},
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: history.length,
              itemBuilder: (context, index) {
                final entry = history[index];
                return _buildHistoryCard(theme, entry);
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFilterChip(String label, bool selected) {
    return FilterChip(
      label: Text(label),
      selected: selected,
      onSelected: (value) {},
    );
  }

  Widget _buildHistoryCard(ThemeData theme, InventoryHistoryEntry entry) {
    final isPositive = entry.quantityChange > 0;
    final typeConfig = _getTypeConfig(entry.type);

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: typeConfig.color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(typeConfig.icon, color: typeConfig.color, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    entry.productName,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'SKU: ${entry.sku}',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                  if (entry.reason != null)
                    Text(
                      entry.reason!,
                      style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                    ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '${isPositive ? '+' : ''}${entry.quantityChange}',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: isPositive ? Colors.green : Colors.red,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '→ ${entry.quantityAfter}',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
                const SizedBox(height: 2),
                Text(
                  _formatTimeAgo(entry.timestamp),
                  style: TextStyle(fontSize: 11, color: Colors.grey[400]),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAuditTab(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Summary cards
          Row(
            children: [
              Expanded(
                child: _buildAuditSummaryCard(
                  theme,
                  title: 'Total Audits',
                  value: '24',
                  icon: Icons.assignment,
                  color: Colors.blue,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildAuditSummaryCard(
                  theme,
                  title: 'Discrepancies',
                  value: '3',
                  icon: Icons.warning_amber,
                  color: Colors.orange,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            'Recent Audits',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          ListTile(
            leading: const Icon(Icons.check_circle, color: Colors.green),
            title: const Text('Monthly Stock Count - May 2026'),
            subtitle: const Text('Completed • No discrepancies'),
            trailing: const Text('2 days ago'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.warning, color: Colors.orange),
            title: const Text('Weekly Audit - Week 21'),
            subtitle: const Text('Completed • 3 items with discrepancies'),
            trailing: const Text('5 days ago'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.check_circle, color: Colors.green),
            title: const Text('Random Spot Check'),
            subtitle: const Text('Completed • All clear'),
            trailing: const Text('1 week ago'),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => _startNewAudit(context),
              icon: const Icon(Icons.add),
              label: const Text('Start New Audit'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(48),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAuditSummaryCard(
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
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              title,
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
          ],
        ),
      ),
    );
  }

  ({IconData icon, Color color, String label}) _getTypeConfig(String type) {
    switch (type) {
      case 'received':
        return (icon: Icons.add_circle, color: Colors.green, label: 'Received');
      case 'sold':
        return (icon: Icons.shopping_cart, color: Colors.blue, label: 'Sold');
      case 'adjustment':
        return (icon: Icons.tune, color: Colors.orange, label: 'Adjusted');
      case 'transfer':
        return (
          icon: Icons.swap_horiz,
          color: Colors.purple,
          label: 'Transferred',
        );
      case 'returned':
        return (icon: Icons.replay, color: Colors.teal, label: 'Returned');
      default:
        return (icon: Icons.help, color: Colors.grey, label: type);
    }
  }

  String _formatTimeAgo(DateTime dateTime) {
    final diff = DateTime.now().difference(dateTime);
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return '${dateTime.day}/${dateTime.month}';
  }

  void _startNewAudit(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Start New Audit'),
        content: const Text('Select audit type:'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Audit started - count items in your store'),
                ),
              );
            },
            child: const Text('Full Count'),
          ),
        ],
      ),
    );
  }
}
