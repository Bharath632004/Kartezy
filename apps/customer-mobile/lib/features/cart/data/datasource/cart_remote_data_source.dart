// lib/features/cart/data/datasource/cart_remote_data_source.dart
import 'package:dio/dio.dart';
import 'package:customer_mobile/shared/models/cart.dart';

abstract class CartRemoteDataSource {
  Future<Cart> getCart(String? userId);
  Future<Cart> addToCart(
    String productId,
    int quantity,
    Map<String, String> variants,
  );
  Future<Cart> updateCartItem(String cartItemId, int quantity);
  Future<Cart> removeCartItem(String cartItemId);
  Future<Cart> clearCart();
  Future<Cart> applyCoupon(String couponCode);
  Future<Cart> removeCoupon();
  Future<Cart> saveForLater(String cartItemId);
  Future<Cart> moveToWishlist(String cartItemId);
  Future<Cart> restoreFromSaveForLater(String cartItemId);
  Future<Cart> updateWalletAmount(double amount);
  Future<Cart> mergeGuestCart(String guestCartId, String userId);
  Future<Cart> updateCartItemVariants(
    String cartItemId,
    Map<String, String> variants,
  );
  Future<Cart> updateCartItemQuantity(String cartItemId, int quantity);
}

class CartRemoteDataSourceImpl implements CartRemoteDataSource {
  final Dio _dio;

  CartRemoteDataSourceImpl(this._dio);

  @override
  Future<Cart> getCart(String? userId) async {
    final response = await _dio.get(
      userId == null ? '/cart/guest' : '/cart/user',
      queryParameters: {'userId': userId},
    );
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> addToCart(
    String productId,
    int quantity,
    Map<String, String> variants,
  ) async {
    final response = await _dio.post(
      '/cart/add',
      data: {
        'productId': productId,
        'quantity': quantity,
        'variants': variants,
      },
    );
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> updateCartItem(String cartItemId, int quantity) async {
    final response = await _dio.put(
      '/cart/item/$cartItemId',
      data: {'quantity': quantity},
    );
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> removeCartItem(String cartItemId) async {
    final response = await _dio.delete('/cart/item/$cartItemId');
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> clearCart() async {
    final response = await _dio.delete('/cart/clear');
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> applyCoupon(String couponCode) async {
    final response = await _dio.post(
      '/cart/apply-coupon',
      data: {'couponCode': couponCode},
    );
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> removeCoupon() async {
    final response = await _dio.post('/cart/remove-coupon');
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> saveForLater(String cartItemId) async {
    final response = await _dio.post(
      '/cart/save-for-later',
      data: {'cartItemId': cartItemId},
    );
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> moveToWishlist(String cartItemId) async {
    final response = await _dio.post(
      '/cart/move-to-wishlist',
      data: {'cartItemId': cartItemId},
    );
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> restoreFromSaveForLater(String cartItemId) async {
    final response = await _dio.post(
      '/cart/restore-from-save-for-later',
      data: {'cartItemId': cartItemId},
    );
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> updateWalletAmount(double amount) async {
    final response = await _dio.post(
      '/cart/update-wallet',
      data: {'amount': amount},
    );
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> mergeGuestCart(String guestCartId, String userId) async {
    final response = await _dio.post(
      '/cart/merge-guest',
      data: {'guestCartId': guestCartId, 'userId': userId},
    );
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> updateCartItemVariants(
    String cartItemId,
    Map<String, String> variants,
  ) async {
    final response = await _dio.put(
      '/cart/item/$cartItemId',
      data: {'variants': variants},
    );
    return Cart.fromJson(response.data);
  }

  @override
  Future<Cart> updateCartItemQuantity(String cartItemId, int quantity) async {
    final response = await _dio.put(
      '/cart/item/$cartItemId',
      data: {'quantity': quantity},
    );
    return Cart.fromJson(response.data);
  }
}
