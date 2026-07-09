// lib/features/search/domain/usecase/save_search_query_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SaveSearchQueryUseCase {
  final SearchRepository _repository;

  SaveSearchQueryUseCase(this._repository);

  Future<void> call(String query) {
    return _repository.saveSearchQuery(query);
  }
}

/// Provider for save search query use case
final saveSearchQueryUseCaseProvider = Provider<SaveSearchQueryUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return SaveSearchQueryUseCase(repository);
});
