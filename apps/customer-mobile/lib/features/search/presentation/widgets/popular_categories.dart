// lib/features/search/presentation/widgets/popular_categories.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/categories/domain/usecase/get_categories_usecase.dart';
import 'package:customer_mobile/shared/models/category.dart';

class PopularCategoriesWidget extends ConsumerStatefulWidget {
  const PopularCategoriesWidget({super.key});

  @override
  ConsumerState<PopularCategoriesWidget> createState() =>
      _PopularCategoriesWidgetState();
}

class _PopularCategoriesWidgetState
    extends ConsumerState<PopularCategoriesWidget> {
  bool _isLoading = true;
  List<Category> _categories = [];
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  @override
  void didUpdateWidget(covariant PopularCategoriesWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    _loadCategories();
  }

  Future<void> _loadCategories() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final useCase = ref.read(getCategoriesUseCaseProvider);
      final categories = await useCase.call();
      if (mounted) {
        setState(() {
          _categories = categories;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(child: Text('Error: $_error'));
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Popular Categories',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: _categories.length,
            itemBuilder: (context, index) {
              final category = _categories[index];
              return Column(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Theme.of(context).dividerColor),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.network(
                        category.imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(
                          color: Theme.of(
                            context,
                          ).colorScheme.secondaryContainer,
                          child: Icon(
                            Icons.category,
                            color: Theme.of(context).iconTheme.color,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    category.name,
                    style: const TextStyle(fontSize: 12),
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              );
            },
          ),
        ),
      ],
    );
  }
}
