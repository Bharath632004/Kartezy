import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:customer_mobile/features/categories/provider/provider.dart';
import 'package:customer_mobile/shared/models/category.dart';

/// Predefined icons and colors for common category names.
/// These are used as visual fallbacks when the backend doesn't provide icons.
final Map<String, IconData> _categoryIcons = {
  'groceries': Icons.shopping_bag_outlined,
  'fruits': Icons.spa_outlined,
  'vegetables': Icons.spa_outlined,
  'fruits & vegetables': Icons.spa_outlined,
  'dairy': Icons.egg_outlined,
  'bakery': Icons.bakery_dining_outlined,
  'pharmacy': Icons.medication_outlined,
  'electronics': Icons.devices_outlined,
  'stationery': Icons.edit_outlined,
  'home': Icons.home_outlined,
  'cosmetics': Icons.face_outlined,
  'fashion': Icons.checkroom_outlined,
  'pet supplies': Icons.pets_outlined,
  'sports': Icons.sports_soccer_outlined,
  'hardware': Icons.build_outlined,
  'books': Icons.menu_book_outlined,
  'toys': Icons.toys_outlined,
  'gifts': Icons.card_giftcard_outlined,
  'beverages': Icons.local_drink_outlined,
  'snacks': Icons.cookie_outlined,
};

final List<Color> _categoryColors = [
  Colors.green,
  Colors.orange,
  Colors.amber,
  Colors.brown,
  Colors.red,
  Colors.blue,
  Colors.indigo,
  Colors.teal,
  Colors.pink,
  Colors.purple,
  Colors.cyan,
  Colors.lime,
  Colors.deepOrange,
  Colors.blueGrey,
  Colors.deepPurple,
];

IconData _iconFor(Category cat) {
  final lower = cat.name.toLowerCase();
  for (final entry in _categoryIcons.entries) {
    if (lower.contains(entry.key)) return entry.value;
  }
  return Icons.category_outlined;
}

Color _colorFor(int index) => _categoryColors[index % _categoryColors.length];

class CategoriesPage extends ConsumerWidget {
  final String? categoryId;

  const CategoriesPage({super.key, this.categoryId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (categoryId != null) {
      return Scaffold(
        appBar: AppBar(title: Text(categoryId!)),
        body: Center(
          child: Text(
            'Products in ${categoryId!} coming soon',
            style: TextStyle(color: Colors.grey[500]),
          ),
        ),
      );
    }

    final categoriesAsync = ref.watch(categoriesProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('All Categories')),
      body: categoriesAsync.when(
        data: (categories) => _buildGrid(context, categories),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.error_outline, size: 48, color: Colors.grey[300]),
              const SizedBox(height: 16),
              Text(
                'Could not load categories',
                style: TextStyle(color: Colors.grey[600], fontSize: 16),
              ),
              const SizedBox(height: 12),
              Text(
                error.toString(),
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[500], fontSize: 12),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () => ref.invalidate(categoriesProvider),
                icon: const Icon(Icons.refresh, size: 18),
                label: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGrid(BuildContext context, List<Category> categories) {
    if (categories.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.category_outlined, size: 64, color: Colors.grey[300]),
            const SizedBox(height: 16),
            Text(
              'No categories available',
              style: TextStyle(color: Colors.grey[600], fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              'Check back later for new categories',
              style: TextStyle(color: Colors.grey[500], fontSize: 13),
            ),
          ],
        ),
      );
    }

    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.85,
      ),
      itemCount: categories.length,
      itemBuilder: (context, index) {
        final cat = categories[index];
        final icon = _iconFor(cat);
        final color = _colorFor(index);
        return GestureDetector(
          onTap: () => context.push('/categories/${cat.id}'),
          child: Column(
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: cat.imageUrl.isNotEmpty
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Image.network(
                          cat.imageUrl,
                          width: 64,
                          height: 64,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) =>
                              Icon(icon, color: color, size: 28),
                        ),
                      )
                    : Icon(icon, color: color, size: 28),
              ),
              const SizedBox(height: 8),
              Text(
                cat.name,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        );
      },
    );
  }
}
