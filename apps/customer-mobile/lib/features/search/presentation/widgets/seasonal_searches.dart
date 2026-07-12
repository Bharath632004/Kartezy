// lib/features/search/presentation/widgets/seasonal_searches.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/presentation/providers/search_providers.dart';

class SeasonalSearchesWidget extends ConsumerWidget {
  const SeasonalSearchesWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final seasonalAsync = ref.watch(seasonalSearchesProvider);

    return seasonalAsync.when(
      data: (seasonal) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Seasonal Searches',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: seasonal
                  .map(
                    (season) => Chip(
                      label: Text(season),
                    ),
                  )
                  .toList(),
            ),
          ],
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stackTrace) =>
          Center(child: Text('Error loading seasonal searches: $error')),
    );
  }
}