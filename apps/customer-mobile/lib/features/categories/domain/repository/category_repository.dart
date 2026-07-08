// lib/features/categories/domain/repository/category_repository.dart
import 'package:customer_mobile/shared/models/category.dart';

abstract class CategoryRepository {
  Future<List<Category>> getCategories();
}
