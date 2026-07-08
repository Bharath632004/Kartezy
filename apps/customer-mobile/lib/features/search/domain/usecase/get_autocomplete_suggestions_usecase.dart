// lib/features/search/domain/usecase/get_autocomplete_suggestions_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetAutocompleteSuggestionsUseCase {
  final SearchRepository _repository;

  GetAutocompleteSuggestionsUseCase(this._repository);

  Future<List<String>> call(String query) {
    return _repository.getAutocompleteSuggestions(query);
  }
}

/// Provider for get autocomplete suggestions use case
final getAutocompleteSuggestionsUseCaseProvider = Provider<GetAutocompleteSuggestionsUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return GetAutocompleteSuggestionsUseCase(repository);
});