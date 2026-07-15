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
    final relatedProducts = _getRelatedProducts();

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
            itemCount: relatedProducts.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (context, index) {
              final product = relatedProducts[index];
              return GestureDetector(
                onTap: onProductTap,
                child: Container(
                  width: 150,
                  decoration: BoxDecoration(
                    color: theme.cardColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey[200]!),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Product image
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                        child: CachedNetworkImage(
                          imageUrl: product['image']!,
                          height: 110,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          placeholder: (_, __) => Shimmer.fromColors(
                            baseColor: Colors.grey[300]!, highlightColor: Colors.grey[100]!,
                            child: Container(color: Colors.grey[300]),
                          ),
                          errorWidget: (_, __, ___) => Container(
                            color: Colors.grey[100],
                            child: const Icon(Icons.image, color: Colors.grey),
                          ),
                        ),
                      ),
                      // Product details
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(8),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                product['name']!,
                                style: const TextStyle(fontSize: 12, fontWeight: 600),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const Spacer(),
                              Row(
                                children: [
                                  Text(
                                    '₹${product['price']}',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black87,
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  if (product['mrp'] != product['price'])
                                    Text(
                                      '₹${product['mrp']}',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: Colors.grey[400],
                                        decoration: TextDecoration.lineThrough,
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              if (product['discount'] != null)
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                  decoration: BoxDecoration(
                                    color: Colors.green[50],
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    '${product['discount']}% OFF',
                                    style: TextStyle(fontSize: 10, color: Colors.green[700], fontWeight: 600),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  List<Map<String, dynamic>> _getRelatedProducts() {
    return [
      {'name': 'Premium Quality Product', 'price': '249', 'mrp': '399', 'discount': '38', 'image': 'https://via.placeholder.com/150x150?text=Product+1'},
      {'name': 'Daily Essentials Combo', 'price': '599', 'mrp': '799', 'discount': '25', 'image': 'https://via.placeholder.com/150x150?text=Product+2'},
      {'name': 'Fresh & Organic Item', 'price': '189', 'mrp': '249', 'discount': '24', 'image': 'https://via.placeholder.com/150x150?text=Product+3'},
      {'name': 'Home Care Bundle', 'price': '449', 'mrp': '549', 'discount': '18', 'image': 'https://via.placeholder.com/150x150?text=Product+4'},
      {'name': 'Snacks & Beverages Pack', 'price': '349', 'mrp': '429', 'discount': '19', 'image': 'https://via.placeholder.com/150x150?text=Product+5'},
    ];
  }
}
