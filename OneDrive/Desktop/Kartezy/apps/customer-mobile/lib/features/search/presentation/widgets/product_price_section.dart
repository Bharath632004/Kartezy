// lib/features/search/presentation/widgets/product_price_section.dart
import 'package:flutter/material.dart';
import 'package:customer_mobile/shared/models/product.dart';

class ProductPriceSection extends StatelessWidget {
  final Product product;

  const ProductPriceSection({required this.product, super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Text(
        '\$${product.price.toStringAsFixed(2)}',
        style: Theme.of(context).textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.bold,
          color: Theme.of(context).colorScheme.primary,
        ),
      ),
    );
  }
}
