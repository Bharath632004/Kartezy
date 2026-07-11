// lib/features/search/domain/usecase/get_similar_products_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/search/data/repository/search_repository_impl.dart';

class GetSimilarProductsUseCase {
  final SearchRepository _repository;

  GetSimilarProductsUseCase(this._repository);

  Future<List<Product>> call(String productId) {
    return _repository.getSimilarProducts(productId);
  }
}

/// Provider for get similar products use case
final getSimilarProductsUseCaseProvider = Provider<GetSimilarProductsUseCase>((
  ref,
) {
  final repository = ref.read(searchRepositoryProvider);
  return GetSimilarProductsUseCase(repository);
});
