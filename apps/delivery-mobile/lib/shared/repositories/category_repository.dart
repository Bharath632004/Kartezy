// lib/shared/repositories/category_repository.dart
abstract class CategoryRepository {
  Future<List<Category>> getCategories();
}
