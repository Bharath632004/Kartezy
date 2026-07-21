import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

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

    final categories = [
      _CatData('Groceries', Icons.shopping_bag_outlined, Colors.green),
      _CatData('Fruits & Vegetables', Icons.spa_outlined, Colors.orange),
      _CatData('Dairy & Bakery', Icons.egg_outlined, Colors.amber),
      _CatData('Bakery', Icons.bakery_dining_outlined, Colors.brown),
      _CatData('Pharmacy', Icons.medication_outlined, Colors.red),
      _CatData('Electronics', Icons.devices_outlined, Colors.blue),
      _CatData('Stationery', Icons.edit_outlined, Colors.indigo),
      _CatData('Home Essentials', Icons.home_outlined, Colors.teal),
      _CatData('Cosmetics', Icons.face_outlined, Colors.pink),
      _CatData('Fashion', Icons.checkroom_outlined, Colors.purple),
      _CatData('Pet Supplies', Icons.pets_outlined, Colors.cyan),
      _CatData('Sports', Icons.sports_soccer_outlined, Colors.lime),
      _CatData('Hardware', Icons.build_outlined, Colors.grey),
      _CatData('Books', Icons.menu_book_outlined, Colors.deepOrange),
      _CatData('Toys', Icons.toys_outlined, Colors.amber),
      _CatData('Gifts', Icons.card_giftcard_outlined, Colors.pinkAccent),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('All Categories')),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 0.8,
        ),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final cat = categories[index];
          return GestureDetector(
            onTap: () => context.push('/categories/${cat.name}'),
            child: Column(
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: cat.color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(cat.icon, color: cat.color, size: 28),
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
      ),
    );
  }
}

class _CatData {
  final String name;
  final IconData icon;
  final Color color;
  const _CatData(this.name, this.icon, this.color);
}
