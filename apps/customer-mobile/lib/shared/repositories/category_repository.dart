// lib/shared/repositories/category_repository.dart
abstract class CategoryRepository {
  Future<List<Category>> getCategories();
}

class MockCategoryRepository implements CategoryRepository {
  @override
  Future<List<Category>> getCategories() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    return [
      Category(
        id: '1',
        name: 'Fruits & Vegetables',
        imageUrl: 'https://via.placeholder.com/150x150?text=Fruits',
      ),
      Category(
        id: '2',
        name: 'Dairy & Eggs',
        imageUrl: 'https://via.placeholder.com/150x150?text=Dairy',
      ),
      Category(
        id: '3',
        name: 'Meat & Fish',
        imageUrl: 'https://via.placeholder.com/150x150?text=Meat',
      ),
      Category(
        id: '4',
        name: 'Snacks & Beverages',
        imageUrl: 'https://via.placeholder.com/150x150?text=Snacks',
      ),
    ];
  }
}