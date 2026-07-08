// lib/features/search/presentation/search_results_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/presentation/widgets/search_bar.dart';
import 'package:customer_mobile/features/search/presentation/widgets/product_grid.dart';
import 'package:customer_mobile/features/search/presentation/providers/search_providers.dart';
import 'package:customer_mobile/shared/models/product.dart';

class SearchResultsPage extends ConsumerStatefulWidget {
  final String query;

  const SearchResultsPage({super.key, required this.query});

  @override
  ConsumerState<SearchResultsPage> createState() => _SearchResultsPageState();
}

class _SearchResultsPageState extends ConsumerState<SearchResultsPage> {
  late final ScrollController _scrollController;
  bool _isLoading = false;
  bool _hasMoreResults = true;

  @override
  void initState() {
    super.initState();
    _scrollController = ScrollController()..addListener(_onScroll);
    _loadMoreResults();
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _loadMoreResults();
    }
  }

  void _loadMoreResults() async {
    if (_isLoading || !_hasMoreResults) return;

    setState(() => _isLoading = true);

    // In a real app, you would use pagination with offset
    // For now, we'll just load the same results again
    try {
      final results = await ref.read(searchProductsUseCaseProvider)(
        widget.query,
      );
      // In a real app, you would append to existing results
      // For demo purposes, we'll just update the state
      ref.read(searchResultsProvider.notifier).updateResults(results);
    } catch (e) {
      // Handle error
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: SearchBarWidget(
          initialText: widget.query,
          onSubmitted: (query) {
            if (query.isNotEmpty) {
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(
                  builder: (_) => SearchResultsPage(query: query),
                ),
              );
            }
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // TODO: Show filter bottom sheet
            },
          ),
        ],
      ),
      body: Column(
        children: [
          const SizedBox(height: 8),
          Expanded(
            child: Consumer(
              builder: (context, ref, _) {
                final searchResults = ref.watch(searchResultsProvider);

                if (searchResults.products.isEmpty && !_isLoading) {
                  return _buildNoResults();
                }

                return ProductGrid(
                  products: searchResults.products,
                  isLoading: _isLoading,
                  hasMoreResults: _hasMoreResults,
                );
              },
            ),
          ),
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }

  Widget _buildNoResults() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.search_off,
              size: 64,
              color: Theme.of(context).colorScheme.secondary,
            ),
            const SizedBox(height: 16),
            Text(
              'No results found for "${widget.query}"',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            Text(
              'Try different keywords or check your spelling',
              style: TextStyle(
                fontSize: 14,
                color: Theme.of(context).colorScheme.outline,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: () {
                // TODO: Show suggestions
              },
              icon: const Icon(Icons.lightbulb),
              label: const Text('Get Suggestions'),
            ),
          ],
        ),
      ),
    );
  }
}
