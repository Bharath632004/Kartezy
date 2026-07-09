import '../../../../core/services/product_service.dart';
import '../../domain/repository/product_repository.dart';

class ProductRepositoryImpl implements ProductRepository {
  final ProductService productService;

  ProductRepositoryImpl(this.productService);

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
    return await productService.getProducts(
      search: search,
      categoryId: categoryId,
      brandId: brandId,
      isActive: isActive,
      sortBy: sortBy,
      ascending: ascending,
      page: page,
      limit: limit,
    );
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
