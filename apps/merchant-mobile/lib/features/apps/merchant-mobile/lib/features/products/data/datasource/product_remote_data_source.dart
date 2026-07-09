import '../../../../core/services/product_service.dart';
import '../../../../core/models/product_model.dart';

abstract class ProductRemoteDataSource {
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

class ProductRemoteDataSourceImpl implements ProductRemoteDataSource {
  final ProductService productService;

  ProductRemoteDataSourceImpl(this.productService);

  @override
  Future<List<ProductModel>> getProducts({
    String? search,
    String? categoryId,
    String? brandId,
    bool? isActive,
    String? sortBy,
    bool? ascending,
    int? page,
    int limit = 20,
  }) async {
    final productModels = await productService.getProducts(
      search: search,
      categoryId: categoryId,
      brandId: brandId,
      isActive: isActive,
      sortBy: sortBy,
      ascending: ascending,
      page: page,
      limit: limit,
    );
    return productModels;
  }

  @override
  Future<ProductModel> getProductById(String productId) async {
    return await productService.getProductById(productId);
  }

  @override
  Future<ProductModel> createProduct(ProductModel product) async {
    return await productService.createProduct(product);
  }

  @override
  Future<ProductModel> updateProduct(String productId, ProductModel product) async {
    return await productService.updateProduct(productId, product);
  }

  @override
  Future<void> deleteProduct(String productId) async {
    await productService.deleteProduct(productId);
  }

  @override
  Future<ProductModel> duplicateProduct(String productId) async {
    return await productService.duplicateProduct(productId);
  }

  @override
  Future<ProductModel> updateApprovalStatus(String productId, bool isActive) async {
    return await productService.updateApprovalStatus(productId, isActive);
  }
}
