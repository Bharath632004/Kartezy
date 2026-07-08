// lib/features/products/data/repository/product_repository_impl.dart
import 'package:customer_mobile/features/products/data/datasource/product_remote_data_source.dart';
import 'package:customer_mobile/features/products/domain/repository/product_repository.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ProductRepositoryImpl implements ProductRepository {
  final ProductRemoteDataSource _remoteDataSource;

  ProductRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<Product>> getProductsByFilter(String filter) async {
    return await _remoteDataSource.getProductsByFilter(filter);
  }
}

/// Provider for product repository
final productRepositoryProvider = Provider<ProductRepository>((ref) {
  final remoteDataSource = ref.read(productRemoteDataSourceProvider);
  return ProductRepositoryImpl(remoteDataSource);
});