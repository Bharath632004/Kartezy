// lib/features/search/domain/usecase/get_product_details_usecase.dart
import 'package:customer_mobile/features/search/domain/repository/search_repository.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetProductDetailsUseCase {
  final SearchRepository _repository;

  GetProductDetailsUseCase(this._repository);

  Future<Product> call(String productId) {
    return _repository.getProductById(productId);
  }
}

/// Provider for get product details use case
final getProductDetailsUseCaseProvider = Provider<GetProductDetailsUseCase>((ref) {
  final repository = ref.read(searchRepositoryProvider);
  return GetProductDetailsUseCase(repository);
});