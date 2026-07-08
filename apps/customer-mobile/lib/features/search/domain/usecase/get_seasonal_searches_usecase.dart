// lib/features/search/domain/usecase/get_seasonal_searches_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetSeasonalSearchesUseCase {
  final SearchRepository _repository;

  GetSeasonalSearchesUseCase(this._repository);

  Future<List<String>> call() {
    return _repository.getSeasonalSearches();
  }
}

/// Provider for get seasonal searches use case
final getSeasonalSearchesUseCaseProvider = Provider<GetSeasonalSearchesUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return GetSeasonalSearchesUseCase(repository);
});