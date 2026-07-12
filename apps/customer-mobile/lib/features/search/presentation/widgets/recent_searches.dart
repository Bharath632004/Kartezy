// lib/features/search/presentation/widgets/recent_searches.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/presentation/providers/search_providers.dart';

class RecentSearchesWidget extends ConsumerWidget {
  const RecentSearchesWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final recentSearchesAsync = ref.watch(recentSearchesProvider);

    return recentSearchesAsync.when(
      data: (recentSearches) {
        if (recentSearches.isEmpty) {
          return const SizedBox.shrink();
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Recent Searches',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: recentSearches
                    .map(
                      (search) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: Chip(
                          label: Text(search),
                          onDeleted: () {
                            // In a real app, you might want to remove from history
                          },
                          avatar: const Icon(Icons.history, size: 16),
                        ),
                      ),
                    )
                    .toList(),
              ),
            ),
          ],
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stackTrace) =>
          Center(child: Text('Error loading recent searches: $error')),
    );
  }
}
