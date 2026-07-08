// lib/features/search/domain/usecase/search_brands_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:customer_mobile/shared/models/search_result.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SearchBrandsUseCase {
  final SearchRepository _repository;

  SearchBrandsUseCase(this._repository);

  Future<SearchResult> call(String query) {
    return _repository.searchBrands(query);
  }
}

/// Provider for search brands use case
final searchBrandsUseCaseProvider = Provider<SearchBrandsUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return SearchBrandsUseCase(repository);
});