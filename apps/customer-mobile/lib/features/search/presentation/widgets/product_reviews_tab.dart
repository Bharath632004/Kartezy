import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

class ProductReviewsTab extends ConsumerWidget {
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
  Widget build(BuildContext context, WidgetRef ref) {
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
                    children: List.generate(5, (i) => Icon(
                      Icons.star,
                      size: 16,
                      color: i < averageRating.round() ? Colors.amber : Colors.grey[300],
                    )),
                  ),
                  Text(
                    '$totalReviews reviews',
                    style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey[600]),
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
                          Text('50%', style: theme.textTheme.bodySmall),
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
                onPressed: () {},
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
                _buildFilterChip('All', true),
                _buildFilterChip('With Photos', false),
                _buildFilterChip('5 Star', false),
                _buildFilterChip('4 Star', false),
                _buildFilterChip('3 Star', false),
                _buildFilterChip('2 Star', false),
                _buildFilterChip('1 Star', false),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Review list
          ...List.generate(3, (i) => _buildReviewCard(context, i)),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, bool selected) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label, style: const TextStyle(fontSize: 12)),
        selected: selected,
        onSelected: (_) {},
        visualDensity: VisualDensity.compact,
        selectedColor: Theme.of(context).primaryColor.withOpacity(0.1),
        checkmarkColor: Theme.of(context).primaryColor,
      ),
    );
  }

  Widget _buildReviewCard(BuildContext context, int index) {
    final names = ['Rahul S.', 'Priya M.', 'Amit K.'];
    final reviews = [
      'Excellent quality and fast delivery!',
      'Good product but packaging could be better.',
      'Very happy with the purchase. Recommended!',
    ];
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey[200]!),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 16,
                  child: Text(names[index][0], style: const TextStyle(fontSize: 12)),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(names[index], style: const TextStyle(fontWeight: 600, fontSize: 13)),
                      Row(
                        children: [
                          ...List.generate(5, (i) => Icon(
                            Icons.star,
                            size: 14,
                            color: i < 4 ? Colors.amber : Colors.grey[300],
                          )),
                          const SizedBox(width: 8),
                          Text(DateFormat.yMMMd().format(DateTime.now().subtract(Duration(days: index * 5))),
                              style: TextStyle(fontSize: 11, color: Colors.grey[500])),
                        ],
                      ),
                    ],
                  ),
                ),
                Icon(Icons.more_vert, size: 18, color: Colors.grey[400]),
              ],
            ),
            const SizedBox(height: 8),
            Text(reviews[index], style: const TextStyle(fontSize: 13, height: 1.4)),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.thumb_up_outlined, size: 14, color: Colors.grey[500]),
                const SizedBox(width: 4),
                Text('${index + 1}', style: TextStyle(fontSize: 11, color: Colors.grey[500])),
                const SizedBox(width: 16),
                Icon(Icons.thumb_down_outlined, size: 14, color: Colors.grey[500]),
                const SizedBox(width: 4),
                Text('0', style: TextStyle(fontSize: 11, color: Colors.grey[500])),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
