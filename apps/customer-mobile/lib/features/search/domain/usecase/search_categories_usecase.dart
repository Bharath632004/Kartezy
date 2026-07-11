// lib/features/search/domain/usecase/search_categories_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:customer_mobile/shared/models/search_result.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/data/repository/search_repository_impl.dart';

class SearchCategoriesUseCase {
  final SearchRepository _repository;

  SearchCategoriesUseCase(this._repository);

  Future<SearchResult> call(String query) {
    return _repository.searchCategories(query);
  }
}

/// Provider for search categories use case
final searchCategoriesUseCaseProvider = Provider<SearchCategoriesUseCase>((
  ref,
) {
  final repository = ref.read(searchRepositoryProvider);
  return SearchCategoriesUseCase(repository);
});
