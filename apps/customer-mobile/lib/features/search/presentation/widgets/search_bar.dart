// lib/features/search/presentation/widgets/search_bar.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/presentation/providers/search_providers.dart';

class SearchBarWidget extends ConsumerStatefulWidget {
  final String? initialText;
  final ValueChanged<String>? onSubmitted;

  const SearchBarWidget({super.key, this.initialText, this.onSubmitted});

  @override
  ConsumerState<SearchBarWidget> createState() => _SearchBarWidgetState();
}

class _SearchBarWidgetState extends ConsumerState<SearchBarWidget> {
  final TextEditingController _controller = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    if (widget.initialText != null) {
      _controller.text = widget.initialText!;
    }
  }

  @override
  void didUpdateWidget(covariant SearchBarWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.initialText != oldWidget.initialText) {
      _controller.text = widget.initialText ?? '';
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    if (query.isEmpty) {
      ref.read(searchResultsProvider.notifier).clearResults();
      return;
    }

    // Debounce the search
    if (_isLoading) return;

    setState(() => _isLoading = true);

    // Simulate debounce (in real app, use a debouncer)
    Future.delayed(const Duration(milliseconds: 300), () {
      if (_controller.text == query) {
        ref
            .read(searchProductsUseCaseProvider)(query)
            .then((results) {
              ref.read(searchResultsProvider.notifier).updateResults(results);
              setState(() => _isLoading = false);
            })
            .catchError((_) {
              setState(() => _isLoading = false);
            });
      } else {
        setState(() => _isLoading = false);
      }
    });
  }

  void _onSearchSubmitted(String query) {
    if (query.isNotEmpty) {
      if (widget.onSubmitted != null) {
        widget.onSubmitted!(query);
      }
      // Also save the search query
      ref.read(saveSearchQueryUseCaseProvider)(query);
      _onSearchChanged(query);
    }
  }

  void _onClearPressed() {
    _controller.clear();
    ref.read(searchResultsProvider.notifier).clearResults();
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Theme.of(context).dividerColor, width: 1.0),
        borderRadius: BorderRadius.circular(12),
      ),
      child: TextField(
        controller: _controller,
        focusNode: FocusNode(),
        onChanged: _onSearchChanged,
        onSubmitted: _onSearchSubmitted,
        decoration: InputDecoration(
          hintText: 'Search for products, stores, brands...',
          hintStyle: TextStyle(color: Theme.of(context).hintColor),
          prefixIcon: const Icon(Icons.search),
          suffixIcon: _controller.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: _onClearPressed,
                )
              : null,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 12,
          ),
        ),
        // onTap handled via focusNode
      ),
    );
  }
}
