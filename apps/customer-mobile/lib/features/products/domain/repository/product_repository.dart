// lib/features/products/domain/repository/product_repository.dart
import 'package:customer_mobile/shared/models/product.dart';

abstract class ProductRepository {
  Future<List<Product>> getProductsByFilter(String filter);
}