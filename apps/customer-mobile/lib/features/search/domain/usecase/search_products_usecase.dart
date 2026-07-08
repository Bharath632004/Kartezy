// lib/features/search/domain/usecase/search_products_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:customer_mobile/shared/models/search_result.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SearchProductsUseCase {
  final SearchRepository _repository;

  SearchProductsUseCase(this._repository);

  Future<SearchResult> call(String query) {
    return _repository.searchProducts(query);
  }
}

/// Provider for search products use case
final searchProductsUseCaseProvider = Provider<SearchProductsUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return SearchProductsUseCase(repository);
});