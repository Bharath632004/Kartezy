import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:merchant_mobile/core/services/product_notifier.dart';

class ProductDetailPage extends ConsumerWidget {
  const ProductDetailPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productState = ref.watch(productNotifierProvider);
    final productId = productState.selectedProduct?.id;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              if (productId != null) {
                GoRouter.of(context).push('/edit-product', extra: productId);
              }
            },
          ),
        ],
      ),
      body: productState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : productState.selectedProduct == null
          ? const Center(child: Text('Product not found'))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (productState.selectedProduct?.imageUrl != null &&
                      productState.selectedProduct!.imageUrl!.isNotEmpty)
                    Center(
                      child: Image.network(
                        productState.selectedProduct!.imageUrl!,
                        height: 200,
                        fit: BoxFit.cover,
                      ),
                    ),
                  const SizedBox(height: 16),
                  Text(
                    productState.selectedProduct!.name ?? 'Unnamed',
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'SKU: ${productState.selectedProduct!.sku ?? 'N/A'}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Price: \$${productState.selectedProduct!.price?.toStringAsFixed(2) ?? '0.00'}',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),
                  Text(
                    'Description',
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    productState.selectedProduct!.description ??
                        'No description',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),
                  Text(
                    'Additional Information',
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                  const SizedBox(height: 4),
                  _buildInfoRow(
                    context,
                    'Category',
                    productState.selectedProduct!.categoryId ?? 'N/A',
                  ),
                  _buildInfoRow(
                    context,
                    'Brand',
                    productState.selectedProduct!.brandId ?? 'N/A',
                  ),
                  _buildInfoRow(
                    context,
                    'Dimensions',
                    productState.selectedProduct!.dimensions ?? 'N/A',
                  ),
                  _buildInfoRow(
                    context,
                    'Barcode',
                    productState.selectedProduct!.barcode ?? 'N/A',
                  ),
                  _buildInfoRow(
                    context,
                    'HSN Code',
                    productState.selectedProduct!.hsnCode ?? 'N/A',
                  ),
                  _buildInfoRow(
                    context,
                    'MRP',
                    '\$${productState.selectedProduct!.mrp?.toStringAsFixed(2) ?? '0.00'}',
                  ),
                  _buildInfoRow(
                    context,
                    'Cost Price',
                    '\$${productState.selectedProduct!.costPrice?.toStringAsFixed(2) ?? '0.00'}',
                  ),
                  _buildInfoRow(
                    context,
                    'Discount',
                    '${productState.selectedProduct!.discount?.toStringAsFixed(2) ?? '0.00'}%',
                  ),
                  _buildInfoRow(
                    context,
                    'Is Active',
                    '${productState.selectedProduct!.isActive ?? false ? 'Yes' : 'No'}',
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: (productState.selectedProduct!.tags ?? [])
                        .map((tag) => Chip(label: Text(tag)))
                        .toList(),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildInfoRow(BuildContext context, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              '$label:',
              style: Theme.of(
                context,
              ).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: Text(value, style: Theme.of(context).textTheme.bodySmall),
          ),
        ],
      ),
    );
  }
}
