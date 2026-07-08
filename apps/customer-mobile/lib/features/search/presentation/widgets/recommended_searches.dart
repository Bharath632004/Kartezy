// lib/features/search/presentation/widgets/recommended_searches.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/domain/usecase/get_personalized_suggestions_usecase.dart';

class RecommendedSearchesWidget extends ConsumerWidget {
  const RecommendedSearchesWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final suggestionsAsync = ref.watch(
      getPersonalizedSuggestionsUseCaseProvider,
    );

    return suggestionsAsync.when(
      data: (suggestions) {
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
              children: suggestions
                  .map(
                    (suggestion) => Chip(
                      label: Text(suggestion),
                      onDeleted: () {
                        // In a real app, you might remove from recommendations
                      },
                      avatar: const Icon(Icons.robot_2, size: 16),
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
