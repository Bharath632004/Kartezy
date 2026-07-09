// lib/features/search/domain/usecase/get_recent_searches_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetRecentSearchesUseCase {
  final SearchRepository _repository;

  GetRecentSearchesUseCase(this._repository);

  Future<List<String>> call() {
    return _repository.getRecentSearches();
  }
}

/// Provider for get recent searches use case
final getRecentSearchesUseCaseProvider = Provider<GetRecentSearchesUseCase>((
  ref,
) {
  final repository = ref.read(searchRepositoryProvider);
  return GetRecentSearchesUseCase(repository);
});
