import '../../../../core/models/product_model.dart';

abstract class ProductRepository {
  Future<List<ProductModel>> getProducts({
    String? search,
    String? categoryId,
    String? brandId,
    bool? isActive,
    String? sortBy,
    bool? ascending,
    int? page,
    int limit = 20,
  });

  Future<ProductModel> getProductById(String productId);

  Future<ProductModel> createProduct(ProductModel product);

  Future<ProductModel> updateProduct(String productId, ProductModel product);

  Future<void> deleteProduct(String productId);

  Future<ProductModel> duplicateProduct(String productId);

  Future<ProductModel> updateApprovalStatus(String productId, bool isActive);
}
