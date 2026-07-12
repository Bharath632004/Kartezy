// lib/shared/repositories/category_repository.dart
import 'package:customer_mobile/shared/models/category.dart';

abstract class CategoryRepository {
  Future<List<Category>> getCategories();
}
