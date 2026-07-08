// lib/features/products/domain/usecase/get_products_by_filter_use_case.dart
import 'package:customer_mobile/features/products/domain/repository/product_repository.dart';
import 'package:customer_mobile/features/products/data/repository/product_repository_impl.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetProductsByFilterUseCase {
  final ProductRepository _repository;

  GetProductsByFilterUseCase(this._repository);

  Future<List<Product>> call(String filter) =>
      _repository.getProductsByFilter(filter);
}

/// Provider for get products by filter use case
final getProductsByFilterUseCaseProvider = Provider<GetProductsByFilterUseCase>(
  (ref) {
    final repository = ref.read(productRepositoryProvider);
    return GetProductsByFilterUseCase(repository);
  },
);
