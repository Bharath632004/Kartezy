import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:merchant_mobile/core/api/dio_client.dart';
import 'package:merchant_mobile/core/api/api_constants.dart';
import 'package:merchant_mobile/core/models/product_model.dart';

final productServiceProvider = Provider<ProductService>((ref) {
  final dioClient = ref.read(dioClientProvider);
  return ProductService(dioClient);
});

class ProductService {
  final DioClient _dioClient;

  ProductService(this._dioClient);

  Dio get _dio => _dioClient.instance;

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
    try {
      final response = await _dio.get(
        ApiConstants.product,
        queryParameters: {
          'search': search,
          'category_id': categoryId,
          'brand_id': brandId,
          'is_active': isActive,
          'sort_by': sortBy,
          'ascending': ascending,
          'page': page,
          'limit': limit,
        }..removeWhere((key, value) => value == null),
      );
      final List<dynamic> data = response.data['data'] ?? [];
      return data.map((json) => ProductModel.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Failed to fetch products: $e');
    }
  }

  Future<ProductModel> getProductById(String productId) async {
    try {
      final response = await _dio.get(
        '${ApiConstants.product}/$productId',
      );
      return ProductModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to fetch product: $e');
    }
  }

  Future<ProductModel> createProduct(ProductModel product) async {
    try {
      final response = await _dio.post(
        ApiConstants.product,
        data: product.toJson(),
      );
      return ProductModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to create product: $e');
    }
  }

  Future<ProductModel> updateProduct(
    String productId,
    ProductModel product,
  ) async {
    try {
      final response = await _dio.put(
        '${ApiConstants.product}/$productId',
        data: product.toJson(),
      );
      return ProductModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to update product: $e');
    }
  }

  Future<void> deleteProduct(String productId) async {
    try {
      await _dio.delete(
        '${ApiConstants.product}/$productId',
      );
    } catch (e) {
      throw Exception('Failed to delete product: $e');
    }
  }

  Future<ProductModel> duplicateProduct(String productId) async {
    try {
      final response = await _dio.post(
        '${ApiConstants.product}/$productId/duplicate',
      );
      return ProductModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to duplicate product: $e');
    }
  }

  Future<ProductModel> updateApprovalStatus(
    String productId,
    bool isActive,
  ) async {
    try {
      final response = await _dio.patch(
        '${ApiConstants.product}/$productId/status',
        data: {'is_active': isActive},
      );
      return ProductModel.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to update product approval status: $e');
    }
  }
}
