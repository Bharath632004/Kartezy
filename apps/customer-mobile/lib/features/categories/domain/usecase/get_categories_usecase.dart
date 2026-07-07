// lib/features/categories/domain/usecase/get_categories_usecase.dart
import 'package:customer_mobile/features/categories/data/repository/category_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetCategoriesUseCase {
  final CategoryRepository _repository;

  GetCategoriesUseCase(this._repository);

  Future<List<Category>> call() {
    return _repository.getCategories();
  }
}

/// Provider for get categories use case
final getCategoriesUseCaseProvider = Provider<GetCategoriesUseCase>((ref) {
  final repository = _ref.read(categoryRepositoryProvider);
  return GetCategoriesUseCase(repository);
});