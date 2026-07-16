import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/core/services/product_notifier.dart';

class ProductListPage extends ConsumerWidget {
  const ProductListPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productState = ref.watch(productNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Management'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              context.go('/add-product');
            },
          ),
        ],
      ),
      body: productState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : productState.products.isEmpty
          ? const Center(child: Text('No products found'))
          : RefreshIndicator(
              onRefresh: () =>
                  ref.read(productNotifierProvider.notifier).fetchProducts(),
              child: ListView.builder(
                itemCount: productState.products.length,
                itemBuilder: (context, index) {
                  final product = productState.products[index];
                  return ListTile(
                    leading:
                        product.imageUrl != null && product.imageUrl!.isNotEmpty
                        ? Image.network(
                            product.imageUrl!,
                            width: 50,
                            height: 50,
                            fit: BoxFit.cover,
                          )
                        : null,
                    title: Text(product.name ?? 'Unnamed'),
                    subtitle: Text(
                      'SKU: ${product.sku ?? 'N/A'} | ₹${product.price?.toStringAsFixed(2) ?? '0.00'}',
                    ),
                    trailing: PopupMenuButton<String>(
                      onSelected: (value) async {
                        switch (value) {
                          case 'edit':
                            context.go('/edit-product', extra: product.id);
                            break;
                          case 'duplicate':
                            await ref
                                .read(productNotifierProvider.notifier)
                                .duplicateProduct(product.id!);
                            break;
                          case 'toggleStatus':
                            await ref
                                .read(productNotifierProvider.notifier)
                                .updateApprovalStatus(
                                  product.id!,
                                  !(product.isActive ?? false),
                                );
                            break;
                          case 'delete':
                            await ref
                                .read(productNotifierProvider.notifier)
                                .deleteProduct(product.id!);
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
                          value: 'duplicate',
                          child: ListTile(
                            leading: Icon(Icons.copy),
                            title: Text('Duplicate'),
                          ),
                        ),
                        PopupMenuItem(
                          value: 'toggleStatus',
                          child: ListTile(
                            leading: Icon(
                              product.isActive ?? false
                                  ? Icons.check_circle
                                  : Icons.radio_button_unchecked,
                            ),
                            title: Text(
                              product.isActive ?? false
                                  ? 'Deactivate'
                                  : 'Activate',
                            ),
                          ),
                        ),
                        const PopupMenuItem(
                          value: 'delete',
                          child: ListTile(
                            leading: Icon(Icons.delete),
                            title: Text('Delete'),
                          ),
                        ),
                      ],
                    ),
                    onTap: () {
                      context.go('/product-detail', extra: product.id);
                    },
                  );
                },
              ),
            ),
      floatingActionButton: productState.hasMore
          ? FloatingActionButton(
              onPressed: () => ref
                  .read(productNotifierProvider.notifier)
                  .fetchProducts(page: productState.page + 1),
              child: const Icon(Icons.expand_more),
            )
          : null,
    );
  }
}
