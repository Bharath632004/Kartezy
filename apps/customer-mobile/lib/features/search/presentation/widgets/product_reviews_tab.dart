import 'package:flutter/material.dart';

class ProductReviewsTab extends StatelessWidget {
  final String productId;
  final double averageRating;
  final int totalReviews;

  const ProductReviewsTab({
    super.key,
    required this.productId,
    this.averageRating = 0,
    this.totalReviews = 0,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Rating Summary
          Row(
            children: [
              Column(
                children: [
                  Text(
                    averageRating.toStringAsFixed(1),
                    style: theme.textTheme.displaySmall?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.amber[700],
                    ),
                  ),
                  Row(
                    children: List.generate(
                      5,
                      (i) => Icon(
                        Icons.star,
                        size: 16,
                        color: i < averageRating.round()
                            ? Colors.amber
                            : Colors.grey[300],
                      ),
                    ),
                  ),
                  Text(
                    '$totalReviews reviews',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 24),
              Expanded(
                child: Column(
                  children: List.generate(5, (index) {
                    final star = 5 - index;
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 2),
                      child: Row(
                        children: [
                          Text('$star', style: theme.textTheme.bodySmall),
                          const SizedBox(width: 4),
                          Icon(Icons.star, size: 12, color: Colors.amber),
                          const SizedBox(width: 8),
                          Expanded(
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(4),
                              child: LinearProgressIndicator(
                                value: 0.5,
                                backgroundColor: Colors.grey[200],
                                color: Colors.amber,
                                minHeight: 6,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '${((5 - star + 1) * 20)}%',
                            style: theme.textTheme.bodySmall,
                          ),
                        ],
                      ),
                    );
                  }),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              OutlinedButton.icon(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Review submission coming soon'),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                },
                icon: const Icon(Icons.star_border, size: 18),
                label: const Text('Write a Review'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: theme.primaryColor,
                  side: BorderSide(color: theme.primaryColor),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
              ),
            ],
          ),
          const Divider(height: 32),

          // Filter chips
          SizedBox(
            height: 36,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildFilterChip(context, 'All', true),
                _buildFilterChip(context, 'With Photos', false),
                _buildFilterChip(context, '★★★★★', false),
                _buildFilterChip(context, '★★★★', false),
                _buildFilterChip(context, '★★★', false),
                _buildFilterChip(context, '★★', false),
                _buildFilterChip(context, '★', false),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Empty state when no reviews loaded
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Center(
              child: Column(
                children: [
                  Icon(
                    Icons.rate_review_outlined,
                    size: 48,
                    color: Colors.grey[300],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    totalReviews > 0
                        ? '$totalReviews reviews available'
                        : 'Be the first to review this product',
                    style: TextStyle(color: Colors.grey[500]),
                  ),
                  if (totalReviews > 0)
                    TextButton(
                      onPressed: () {},
                      child: const Text('View all reviews'),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(BuildContext context, String label, bool selected) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label, style: const TextStyle(fontSize: 12)),
        selected: selected,
        onSelected: (_) {},
        visualDensity: VisualDensity.compact,
        selectedColor: Theme.of(context).primaryColor.withValues(alpha: 0.1),
        checkmarkColor: Theme.of(context).primaryColor,
      ),
    );
  }
}
