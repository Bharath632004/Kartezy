import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/core/services/inventory_notifier.dart';

class InventoryListPage extends ConsumerWidget {
  const InventoryListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final inventoryState = ref.watch(inventoryNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inventory Management'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              context.go('/add-inventory');
            },
          ),
        ],
      ),
      body: inventoryState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : inventoryState.inventories.isEmpty
          ? const Center(child: Text('No inventory items found'))
          : RefreshIndicator(
              onRefresh: () => ref
                  .read(inventoryNotifierProvider.notifier)
                  .fetchInventories(),
              child: ListView.builder(
                itemCount: inventoryState.inventories.length,
                itemBuilder: (context, index) {
                  final inventory = inventoryState.inventories[index];
                  return ListTile(
                    title: Text('Product ID: ${inventory.productId ?? 'N/A'}'),
                    subtitle: Text(
                      'Warehouse: ${inventory.warehouseId ?? 'N/A'} | Qty: ${inventory.quantity ?? 0}',
                    ),
                    trailing: PopupMenuButton<String>(
                      onSelected: (value) async {
                        switch (value) {
                          case 'edit':
                            context.go('/edit-inventory', extra: inventory.id);
                            break;
                          case 'adjust':
                            // Show a dialog to adjust stock
                            break;
                          case 'transfer':
                            // Show a dialog to transfer stock
                            break;
                        }
                      },
                      itemBuilder: (context) => [
                        const PopupMenuItem(
                          value: 'edit',
                          child: ListTile(
                            leading: Icon(Icons.edit),
                            title: Text('Edit'),
                          ),
                        ),
                        const PopupMenuItem(
                          value: 'adjust',
                          child: ListTile(
                            leading: Icon(Icons.add_circle),
                            title: Text('Adjust Stock'),
                          ),
                        ),
                        const PopupMenuItem(
                          value: 'transfer',
                          child: ListTile(
                            leading: Icon(Icons.swap_horiz),
                            title: Text('Transfer Stock'),
                          ),
                        ),
                      ],
                    ),
                    onTap: () {
                      context.go('/inventory-detail', extra: inventory.id);
                    },
                  );
                },
              ),
            ),
      floatingActionButton: inventoryState.hasMore
          ? FloatingActionButton(
              onPressed: () => ref
                  .read(inventoryNotifierProvider.notifier)
                  .fetchInventories(page: inventoryState.page + 1),
              child: const Icon(Icons.expand_more),
            )
          : null,
    );
  }
}
