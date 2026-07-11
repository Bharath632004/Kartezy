// lib/features/search/presentation/widgets/product_variant_selector.dart
import 'package:flutter/material.dart';
import 'package:customer_mobile/shared/models/product.dart';

class ProductVariantSelector extends StatelessWidget {
  final Product product;

  const ProductVariantSelector({required this.product, super.key});

  @override
  Widget build(BuildContext context) {
    // For simplicity, we'll show a placeholder if no variants exist.
    // In a real app, you would show a dropdown or swatches for variants.
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Variants',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          const Text('No variants available for this product.'),
        ],
      ),
    );
  }
}
