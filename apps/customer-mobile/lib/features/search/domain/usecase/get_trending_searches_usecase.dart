// lib/features/search/domain/usecase/get_trending_searches_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetTrendingSearchesUseCase {
  final SearchRepository _repository;

  GetTrendingSearchesUseCase(this._repository);

  Future<List<String>> call() {
    return _repository.getTrendingSearches();
  }
}

/// Provider for get trending searches use case
final getTrendingSearchesUseCaseProvider = Provider<GetTrendingSearchesUseCase>(
  (ref) {
    final repository = ref.read(searchRepositoryProvider);
    return GetTrendingSearchesUseCase(repository);
  },
);
