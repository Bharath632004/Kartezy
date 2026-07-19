// lib/features/search/domain/usecase/search_stores_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:customer_mobile/shared/models/search_result.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/data/repository/search_repository_impl.dart';

class SearchStoresUseCase {
  final SearchRepository _repository;

  SearchStoresUseCase(this._repository);

  Future<SearchResult> call(String query) {
    return _repository.searchStores(query);
  }
}

/// Provider for search stores use case
final searchStoresUseCaseProvider = Provider<SearchStoresUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return SearchStoresUseCase(repository);
});
