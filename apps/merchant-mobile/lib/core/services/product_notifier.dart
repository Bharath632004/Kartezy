import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:equatable/equatable.dart';
import 'product_service.dart';
import 'package:merchant_mobile/core/models/product_model.dart';

// State for product management
class ProductState extends Equatable {
  final bool isLoading;
  final String? error;
  final List<ProductModel> products;
  final ProductModel? selectedProduct;
  final bool hasMore;
  final int page;

  const ProductState({
    required this.isLoading,
    this.error,
    required this.products,
    this.selectedProduct,
    required this.hasMore,
    required this.page,
  });

  factory ProductState.initial() => const ProductState(
    isLoading: false,
    products: [],
    hasMore: false,
    page: 1,
  );

  ProductState copyWith({
    bool? isLoading,
    String? error,
    List<ProductModel>? products,
    ProductModel? selectedProduct,
    bool? hasMore,
    int? page,
  }) {
    return ProductState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      products: products ?? this.products,
      selectedProduct: selectedProduct ?? this.selectedProduct,
      hasMore: hasMore ?? this.hasMore,
      page: page ?? this.page,
    );
  }

  @override
  List<Object?> get props => [
    isLoading,
    error,
    products,
    selectedProduct,
    hasMore,
    page,
  ];
}

class ProductNotifier extends StateNotifier<ProductState> {
  final ProductService _productService;

  ProductNotifier(this._productService) : super(ProductState.initial());

  Future<void> fetchProducts({
    String? search,
    String? categoryId,
    String? brandId,
    bool? isActive,
    String? sortBy,
    bool? ascending,
    int? page,
  }) async {
    final currentPage = page ?? state.page;
    if (currentPage == 1) {
      state = state.copyWith(isLoading: true, error: null);
    }
    try {
      final products = await _productService.getProducts(
        search: search,
        categoryId: categoryId,
        brandId: brandId,
        isActive: isActive,
        sortBy: sortBy,
        ascending: ascending,
        page: currentPage,
        limit: 20,
      );
      final hasMore = products.length == 20; // assuming 20 per page
      state = state.copyWith(
        isLoading: false,
        products: page == 1 ? products : [...state.products, ...products],
        hasMore: hasMore,
        page: currentPage,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> fetchProductById(String productId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final product = await _productService.getProductById(productId);
      state = state.copyWith(isLoading: false, selectedProduct: product);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> clearSelectedProduct() async {
    state = state.copyWith(selectedProduct: null);
  }

  Future<void> createProduct(ProductModel product) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final newProduct = await _productService.createProduct(product);
      state = state.copyWith(
        isLoading: false,
        products: [newProduct, ...state.products],
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> updateProduct(String productId, ProductModel product) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final updatedProduct = await _productService.updateProduct(
        productId,
        product,
      );
      state = state.copyWith(
        isLoading: false,
        products: state.products
            .map((p) => p.id == productId ? updatedProduct : p)
            .toList(),
        selectedProduct: state.selectedProduct?.id == productId
            ? updatedProduct
            : state.selectedProduct,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> deleteProduct(String productId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _productService.deleteProduct(productId);
      state = state.copyWith(
        isLoading: false,
        products: state.products.where((p) => p.id != productId).toList(),
        selectedProduct: state.selectedProduct?.id == productId
            ? null
            : state.selectedProduct,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> duplicateProduct(String productId) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final duplicatedProduct = await _productService.duplicateProduct(
        productId,
      );
      state = state.copyWith(
        isLoading: false,
        products: [duplicatedProduct, ...state.products],
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> updateApprovalStatus(String productId, bool isActive) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final updatedProduct = await _productService.updateApprovalStatus(
        productId,
        isActive,
      );
      state = state.copyWith(
        isLoading: false,
        products: state.products
            .map((p) => p.id == productId ? updatedProduct : p)
            .toList(),
        selectedProduct: state.selectedProduct?.id == productId
            ? updatedProduct
            : state.selectedProduct,
      );
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }
}

// Provider
final productNotifierProvider =
    StateNotifierProvider<ProductNotifier, ProductState>((ref) {
      return ProductNotifier(ref.read(productServiceProvider));
    });
