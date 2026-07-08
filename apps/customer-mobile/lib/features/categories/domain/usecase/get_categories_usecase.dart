// lib/features/categories/domain/usecase/get_categories_usecase.dart
import 'package:customer_mobile/features/categories/domain/repository/category_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/categories/provider/provider.dart';

class GetCategoriesUseCase {
  final CategoryRepository _repository;

  GetCategoriesUseCase(this._repository);

  Future<List<Category>> call() {
    return _repository.getCategories();
  }
}

/// Provider for get categories use case
final getCategoriesUseCaseProvider = Provider<GetCategoriesUseCase>((ref) {
  final repository = ref.read(categoryRepositoryProvider);
  return GetCategoriesUseCase(repository);
});
