// lib/features/search/presentation/widgets/recommended_searches.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/presentation/providers/search_providers.dart';

class RecommendedSearchesWidget extends ConsumerWidget {
  const RecommendedSearchesWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final recommendationsAsync = ref.watch(personalizedSuggestionsProvider);

    return recommendationsAsync.when(
      data: (recommendations) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Recommended Searches',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: recommendations
                  .map(
                    (recommendation) => Chip(
                      label: Text(recommendation),
                      avatar: const Icon(Icons.search, size: 16),
                    ),
                  )
                  .toList(),
            ),
          ],
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stackTrace) =>
          Center(child: Text('Error loading recommendations: $error')),
    );
  }
}
