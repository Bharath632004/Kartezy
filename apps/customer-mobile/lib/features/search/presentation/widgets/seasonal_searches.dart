// lib/features/search/presentation/widgets/seasonal_searches.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/domain/usecase/get_seasonal_searches_usecase.dart';

class SeasonalSearchesWidget extends ConsumerWidget {
  const SeasonalSearchesWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final suggestionsAsync = ref.watch(getSeasonalSearchesUseCaseProvider);

    return suggestionsAsync.when(
      data: (suggestions) {
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
              children: suggestions
                  .map(
                    (suggestion) => Chip(
                      label: Text(suggestion),
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