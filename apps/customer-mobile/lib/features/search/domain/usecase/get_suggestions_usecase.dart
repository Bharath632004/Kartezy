// lib/features/search/domain/usecase/get_suggestions_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetSuggestionsUseCase {
  final SearchRepository _repository;

  GetSuggestionsUseCase(this._repository);

  Future<List<String>> call(String query) {
    return _repository.getAutocompleteSuggestions(query);
  }
}

/// Provider for get suggestions use case
final getSuggestionsUseCaseProvider = Provider<GetSuggestionsUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return GetSuggestionsUseCase(repository);
});