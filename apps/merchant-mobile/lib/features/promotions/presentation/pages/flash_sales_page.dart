import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Flash sale model
class FlashSale {
  final String id;
  final String name;
  final double discountPercent;
  final DateTime startTime;
  final DateTime endTime;
  final String status; // 'scheduled', 'active', 'ended'
  final int productCount;
  final int unitsSold;
  final int maxUnits;

  const FlashSale({
    required this.id,
    required this.name,
    required this.discountPercent,
    required this.startTime,
    required this.endTime,
    required this.status,
    this.productCount = 0,
    this.unitsSold = 0,
    this.maxUnits = 100,
  });

  Duration get remainingTime => endTime.difference(DateTime.now());
  double get progress => maxUnits > 0 ? unitsSold / maxUnits : 0;
}

final flashSalesProvider = Provider<List<FlashSale>>((ref) {
  return [
    FlashSale(
      id: 'fs1',
      name: 'Flash Sale - Evening Special',
      discountPercent: 30,
      startTime: DateTime.now().subtract(const Duration(hours: 1)),
      endTime: DateTime.now().add(const Duration(hours: 3)),
      status: 'active',
      productCount: 15,
      unitsSold: 42,
      maxUnits: 100,
    ),
    FlashSale(
      id: 'fs2',
      name: 'Weekend Mega Sale',
      discountPercent: 40,
      startTime: DateTime.now().add(const Duration(days: 3)),
      endTime: DateTime.now().add(const Duration(days: 4)),
      status: 'scheduled',
      productCount: 50,
      unitsSold: 0,
      maxUnits: 500,
    ),
    FlashSale(
      id: 'fs3',
      name: 'Happy Hours - Morning',
      discountPercent: 20,
      startTime: DateTime.now().subtract(const Duration(days: 1)),
      endTime: DateTime.now().subtract(const Duration(hours: 18)),
      status: 'ended',
      productCount: 25,
      unitsSold: 128,
      maxUnits: 200,
    ),
  ];
});

/// Flash Sales & Promotions Management Page
class FlashSalesPage extends ConsumerStatefulWidget {
  const FlashSalesPage({super.key});

  @override
  ConsumerState<FlashSalesPage> createState() => _FlashSalesPageState();
}

class _FlashSalesPageState extends ConsumerState<FlashSalesPage> {
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final flashSales = ref.watch(flashSalesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Flash Sales & Promotions'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showCreateFlashSaleDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          // Quick create buttons
          Container(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: _buildQuickAction(
                    theme,
                    icon: Icons.flash_on,
                    label: 'Flash Sale',
                    color: Colors.orange,
                    onTap: () {},
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildQuickAction(
                    theme,
                    icon: Icons.local_offer,
                    label: 'Happy Hours',
                    color: Colors.pink,
                    onTap: () {},
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildQuickAction(
                    theme,
                    icon: Icons.discount,
                    label: 'Combo Offer',
                    color: Colors.teal,
                    onTap: () {},
                  ),
                ),
              ],
            ),
          ),

          // Active flash sale banner
          ...flashSales
              .where((fs) => fs.status == 'active')
              .map((fs) => _buildActiveSaleBanner(theme, fs)),

          // All sales
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {},
              child: ListView(
                padding: const EdgeInsets.all(12),
                children: [
                  Text(
                    'All Promotions',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...flashSales.map((fs) => _buildFlashSaleCard(theme, fs)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickAction(
    ThemeData theme, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActiveSaleBanner(ThemeData theme, FlashSale sale) {
    final remaining = sale.remainingTime;
    final hours = remaining.inHours;
    final minutes = remaining.inMinutes % 60;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12),
      child: Card(
        color: Colors.orange.shade50,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              const Icon(Icons.flash_on, color: Colors.orange, size: 32),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '🔥 Flash Sale Active!',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${sale.discountPercent.toStringAsFixed(0)}% off on ${sale.productCount} products',
                      style: TextStyle(fontSize: 12, color: Colors.grey[700]),
                    ),
                    Text(
                      'Ends in ${hours}h ${minutes}m',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.red[600],
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                children: [
                  Text(
                    '${sale.unitsSold}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                    ),
                  ),
                  Text(
                    'sold',
                    style: TextStyle(fontSize: 11, color: Colors.grey[600]),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFlashSaleCard(ThemeData theme, FlashSale sale) {
    final statusConfig = _getStatusConfig(sale.status);

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
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
                const Spacer(),
                Text(
                  '${sale.discountPercent.toStringAsFixed(0)}% OFF',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.red[600],
                    fontSize: 16,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              sale.name,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(Icons.inventory_2, size: 14, color: Colors.grey[500]),
                const SizedBox(width: 4),
                Text(
                  '${sale.productCount} products',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
                const SizedBox(width: 16),
                Icon(Icons.access_time, size: 14, color: Colors.grey[500]),
                const SizedBox(width: 4),
                Text(
                  _formatDateRange(sale.startTime, sale.endTime),
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
            if (sale.status == 'active') ...[
              const SizedBox(height: 12),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: sale.progress,
                  backgroundColor: Colors.grey.shade200,
                  valueColor: const AlwaysStoppedAnimation<Color>(
                    Colors.orange,
                  ),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '${sale.unitsSold}/${sale.maxUnits} units sold',
                style: TextStyle(fontSize: 11, color: Colors.grey[500]),
              ),
            ],
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.edit, size: 16),
                  label: const Text('Edit', style: TextStyle(fontSize: 12)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.analytics, size: 16),
                  label: const Text('Insights', style: TextStyle(fontSize: 12)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  ({Color color, String label}) _getStatusConfig(String status) {
    switch (status) {
      case 'active':
        return (color: Colors.green, label: 'Active');
      case 'scheduled':
        return (color: Colors.blue, label: 'Scheduled');
      case 'ended':
        return (color: Colors.grey, label: 'Ended');
      default:
        return (color: Colors.grey, label: status);
    }
  }

  String _formatDateRange(DateTime start, DateTime end) {
    final s =
        '${start.day}/${start.month} ${start.hour}:${start.minute.toString().padLeft(2, '0')}';
    final e =
        '${end.day}/${end.month} ${end.hour}:${end.minute.toString().padLeft(2, '0')}';
    return '$s - $e';
  }

  void _showCreateFlashSaleDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Create Flash Sale'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Sale Name',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Discount (%)',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 12),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Max Units',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Flash sale created')),
              );
            },
            child: const Text('Create'),
          ),
        ],
      ),
    );
  }
}
