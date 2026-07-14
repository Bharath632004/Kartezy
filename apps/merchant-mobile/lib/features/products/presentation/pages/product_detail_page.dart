import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/services/product_notifier.dart';

class ProductDetailPage extends ConsumerWidget {
  static const String routeName = '/product-detail';

  const ProductDetailPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final productId = ModalRoute.of(context)!.settings.arguments as String?;
    final productState = ref.watch(productNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Product Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () {
              if (productId != null) {
                Navigator.of(
                  context,
                ).pushNamed('/edit-product', arguments: productId);
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
                    style: Theme.of(context).textTheme.headline6,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'SKU: ${productState.selectedProduct!.sku ?? 'N/A'}',
                    style: Theme.of(context).textTheme.bodyText2,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Price: \$${productState.selectedProduct!.sellingPrice?.toStringAsFixed(2) ?? '0.00'}',
                    style: Theme.of(context).textTheme.bodyText2,
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),
                  Text(
                    'Description',
                    style: Theme.of(context).textTheme.subtitle1,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    productState.selectedProduct!.description ??
                        'No description',
                    style: Theme.of(context).textTheme.bodyText2,
                  ),
                  const SizedBox(height: 16),
                  const Divider(),
                  const SizedBox(height: 8),
                  Text(
                    'Additional Information',
                    style: Theme.of(context).textTheme.subtitle1,
                  ),
                  const SizedBox(height: 4),
                  _buildInfoRow(
                    'Category',
                    productState.selectedProduct!.categoryId ?? 'N/A',
                  ),
                  _buildInfoRow(
                    'Brand',
                    productState.selectedProduct!.brandId ?? 'N/A',
                  ),
                  _buildInfoRow(
                    'Weight',
                    '${productState.selectedProduct!.weight ?? 0} ${productState.selectedProduct!.unit ?? ''}',
                  ),
                  _buildInfoRow(
                    'Dimensions',
                    '${productState.selectedProduct!.dimensions?.length ?? 0} x '
                        '${productState.selectedProduct!.dimensions?.width ?? 0} x '
                        '${productState.selectedProduct!.dimensions?.height ?? 0} ${productState.selectedProduct!.dimensions?.unit ?? ''}',
                  ),
                  _buildInfoRow(
                    'Barcode',
                    productState.selectedProduct!.barcode ?? 'N/A',
                  ),
                  _buildInfoRow(
                    'HSN Code',
                    productState.selectedProduct!.hsnCode ?? 'N/A',
                  ),
                  _buildInfoRow(
                    'MRP',
                    '\$${productState.selectedProduct!.mrp?.toStringAsFixed(2) ?? '0.00'}',
                  ),
                  _buildInfoRow(
                    'Cost Price',
                    '\$${productState.selectedProduct!.costPrice?.toStringAsFixed(2) ?? '0.00'}',
                  ),
                  _buildInfoRow(
                    'Discount',
                    '${productState.selectedProduct!.discount?.toStringAsFixed(2) ?? '0.00'}%',
                  ),
                  _buildInfoRow(
                    'Flash Sale Price',
                    '\$${productState.selectedProduct!.flashSalePrice?.toStringAsFixed(2) ?? '0.00'}',
                  ),
                  _buildInfoRow(
                    'Membership Price',
                    '\$${productState.selectedProduct!.membershipPrice?.toStringAsFixed(2) ?? '0.00'}',
                  ),
                  _buildInfoRow(
                    'Combo Price',
                    '\$${productState.selectedProduct!.comboPrice?.toStringAsFixed(2) ?? '0.00'}',
                  ),
                  _buildInfoRow(
                    'Tax (GST)',
                    '${productState.selectedProduct!.tax?.toStringAsFixed(2) ?? '0.00'}%',
                  ),
                  _buildInfoRow(
                    'Dynamic Pricing',
                    '${productState.selectedProduct!.dynamicPricingEnabled ?? false ? 'Yes' : 'No'}',
                  ),
                  _buildInfoRow(
                    'Is Active',
                    '${productState.selectedProduct!.isActive ?? false ? 'Yes' : 'No'}',
                  ),
                  _buildInfoRow(
                    'Shelf Life (days)',
                    '${productState.selectedProduct!.shelfLife ?? 'N/A'}',
                  ),
                  _buildInfoRow('Expiry Date', 'N/A'),
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

  Widget _buildInfoRow(String label, String value) {
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
              ).textTheme.bodyText2?.copyWith(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: Text(value, style: Theme.of(context).textTheme.bodyText2),
          ),
        ],
      ),
    );
  }
}
