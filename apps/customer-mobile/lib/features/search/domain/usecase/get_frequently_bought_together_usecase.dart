// lib/features/search/domain/usecase/get_frequently_bought_together_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetFrequentlyBoughtTogetherUseCase {
  final SearchRepository _repository;

  GetFrequentlyBoughtTogetherUseCase(this._repository);

  Future<List<Product>> call(String productId) {
    return _repository.getFrequentlyBoughtTogether(productId);
  }
}

/// Provider for get frequently bought together use case
final getFrequentlyBoughtTogetherUseCaseProvider =
    Provider<GetFrequentlyBoughtTogetherUseCase>((ref) {
      final repository = ref.read(searchRepositoryProvider);
      return GetFrequentlyBoughtTogetherUseCase(repository);
    });
