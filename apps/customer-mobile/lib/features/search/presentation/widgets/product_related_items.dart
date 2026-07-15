import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';

class ProductRelatedItems extends StatelessWidget {
  final String productId;
  final String categoryId;
  final VoidCallback? onProductTap;

  const ProductRelatedItems({
    super.key,
    required this.productId,
    required this.categoryId,
    this.onProductTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Related Products',
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              TextButton(
                onPressed: () {},
                child: const Text('View All', style: TextStyle(fontSize: 13)),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 220,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: 0, // Will be populated from API
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (context, index) => const SizedBox.shrink(),
          ),
        ),
        // Empty state
        if (true)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
            child: Center(
              child: Column(
                children: [
                  Icon(Icons.category_outlined, size: 40, color: Colors.grey[300]),
                  const SizedBox(height: 8),
                  Text(
                    'Related products will appear here',
                    style: TextStyle(color: Colors.grey[500], fontSize: 13),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
