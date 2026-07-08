// lib/features/search/domain/usecase/get_personalized_suggestions_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetPersonalizedSuggestionsUseCase {
  final SearchRepository _repository;

  GetPersonalizedSuggestionsUseCase(this._repository);

  Future<List<String>> call() {
    return _repository.getPersonalizedSuggestions();
  }
}

/// Provider for get personalized suggestions use case
final getPersonalizedSuggestionsUseCaseProvider =
    Provider<GetPersonalizedSuggestionsUseCase>((ref) {
      final repository = ref.read(searchRepositoryProvider);
      return GetPersonalizedSuggestionsUseCase(repository);
    });
