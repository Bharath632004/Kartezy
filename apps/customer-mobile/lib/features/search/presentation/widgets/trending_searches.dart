// lib/features/search/presentation/widgets/trending_searches.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/presentation/providers/search_providers.dart';

class TrendingSearchesWidget extends ConsumerWidget {
  const TrendingSearchesWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final trendingSearches = ref.watch(trendingSearchesProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Trending Searches',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: trendingSearches
              .map(
                (search) => Chip(
                  label: Text(search),
                  onDeleted: () {
                    // In a real app, you might want to remove from trending
                  },
                  avatar: const Icon(Icons.trending_up, size: 16),
                  backgroundColor: Theme.of(
                    context,
                  ).colorScheme.primaryContainer,
                ),
              )
              .toList(),
        ),
      ],
    );
  }
}
