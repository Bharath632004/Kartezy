import 'package:flutter/material.dart';

/// Data model for low stock alerts
class LowStockItem {
  final String productName;
  final String sku;
  final int currentStock;
  final int minimumStock;
  final String unit;

  const LowStockItem({
    required this.productName,
    required this.sku,
    required this.currentStock,
    required this.minimumStock,
    this.unit = 'units',
  });

  bool get isCritical => currentStock == 0;
  bool get isLow => currentStock <= minimumStock;
  double get stockPercent => minimumStock > 0 ? currentStock / minimumStock : 0;
}

/// A banner widget that displays low stock alerts and out-of-stock items.
class LowStockBanner extends StatelessWidget {
  final List<LowStockItem> items;
  final VoidCallback? onViewAll;
  final VoidCallback? onRestock;

  const LowStockBanner({
    super.key,
    required this.items,
    this.onViewAll,
    this.onRestock,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final outOfStock = items.where((i) => i.isCritical).length;
    final lowStock = items.where((i) => i.isLow && !i.isCritical).length;

    if (items.isEmpty) {
      return const SizedBox.shrink();
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: outOfStock > 0 ? Colors.red.shade200 : Colors.orange.shade200,
        ),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Material(
          color: outOfStock > 0 ? Colors.red.shade50 : Colors.orange.shade50,
          child: InkWell(
            onTap: onViewAll,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        outOfStock > 0
                            ? Icons.error_outline
                            : Icons.inventory_2_outlined,
                        color: outOfStock > 0
                            ? Colors.red.shade700
                            : Colors.orange.shade700,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          outOfStock > 0
                              ? '$outOfStock item(s) out of stock'
                              : '$lowStock item(s) running low',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: outOfStock > 0
                                ? Colors.red.shade800
                                : Colors.orange.shade800,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      if (onViewAll != null)
                        Icon(
                          Icons.chevron_right,
                          color: Colors.grey[600],
                          size: 20,
                        ),
                    ],
                  ),
                  if (items.length <= 3)
                    ...items.map(
                      (item) =>
                          _buildItemRow(theme, item, onRestock: onRestock),
                    ),
                  if (items.length > 3) ...[
                    const SizedBox(height: 8),
                    Text(
                      '${items.length - 3} more items need attention',
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildItemRow(
    ThemeData theme,
    LowStockItem item, {
    VoidCallback? onRestock,
  }) {
    return Padding(
      padding: const EdgeInsets.only(top: 8),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: item.isCritical ? Colors.red : Colors.orange,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              '${item.productName} (${item.sku})',
              style: TextStyle(fontSize: 12, color: Colors.grey[700]),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            '${item.currentStock}/${item.minimumStock} ${item.unit}',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: item.isCritical ? Colors.red : Colors.orange,
            ),
          ),
          if (onRestock != null) ...[
            const SizedBox(width: 8),
            SizedBox(
              height: 28,
              child: TextButton(
                onPressed: onRestock,
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  minimumSize: Size.zero,
                ),
                child: const Text('Restock', style: TextStyle(fontSize: 11)),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
