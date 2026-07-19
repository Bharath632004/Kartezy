// lib/features/search/domain/usecase/clear_search_history_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/data/repository/search_repository_impl.dart';

class ClearSearchHistoryUseCase {
  final SearchRepository _repository;

  ClearSearchHistoryUseCase(this._repository);

  Future<void> call() {
    return _repository.clearSearchHistory();
  }
}

/// Provider for clear search history use case
final clearSearchHistoryUseCaseProvider = Provider<ClearSearchHistoryUseCase>((
  ref,
) {
  final repository = ref.read(searchRepositoryProvider);
  return ClearSearchHistoryUseCase(repository);
});
