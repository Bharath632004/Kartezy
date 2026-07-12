// lib/features/search/presentation/widgets/product_action_buttons.dart
import 'package:flutter/material.dart';
import 'package:customer_mobile/shared/models/product.dart';

class ProductActionButtons extends StatelessWidget {
  final Product product;

  const ProductActionButtons({super.key, required this.product});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        ElevatedButton.icon(
          onPressed: () {
            // Add to cart logic would go here
          },
          icon: const Icon(Icons.shopping_cart),
          label: const Text('Add to Cart'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Theme.of(context).colorScheme.primary,
            foregroundColor: Colors.white,
          ),
        ),
        ElevatedButton.icon(
          onPressed: () {
            // Buy now logic would go here
          },
          icon: const Icon(Icons.shopping_bag_outlined),
          label: const Text('Buy Now'),
          style: ElevatedButton.styleFrom(
            backgroundColor: Theme.of(context).colorScheme.secondary,
            foregroundColor: Colors.white,
          ),
        ),
      ],
    );
  }
}
