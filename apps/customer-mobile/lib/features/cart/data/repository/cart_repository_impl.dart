import 'package:customer_mobile/features/cart/data/datasource/cart_remote_data_source.dart';
import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/shared/models/cart.dart';

class CartRepositoryImpl implements CartRepository {
  final CartRemoteDataSource _remoteDataSource;

  CartRepositoryImpl(this._remoteDataSource);

  @override
  Future<Cart> getCart(String? userId) =>
      _remoteDataSource.getCart(userId);

  @override
  Future<Cart> addToCart(String productId, int quantity, Map<String, String> variants) =>
      _remoteDataSource.addToCart(productId, quantity, variants);

  @override
  Future<Cart> updateCartItem(String cartItemId, int quantity) =>
      _remoteDataSource.updateCartItem(cartItemId, quantity);

  @override
  Future<Cart> removeCartItem(String cartItemId) =>
      _remoteDataSource.removeCartItem(cartItemId);

  @override
  Future<Cart> clearCart() =>
      _remoteDataSource.clearCart();

  @override
  Future<Cart> applyCoupon(String couponCode) =>
      _remoteDataSource.applyCoupon(couponCode);

  @override
  Future<Cart> removeCoupon() =>
      _remoteDataSource.removeCoupon();

  @override
  Future<Cart> saveForLater(String cartItemId) =>
      _remoteDataSource.saveForLater(cartItemId);

  @override
  Future<Cart> moveToWishlist(String cartItemId) =>
      _remoteDataSource.moveToWishlist(cartItemId);

  @override
  Future<Cart> restoreFromSaveForLater(String cartItemId) =>
      _remoteDataSource.restoreFromSaveForLater(cartItemId);

  @override
  Future<Cart> updateWalletAmount(double amount) =>
      _remoteDataSource.updateWalletAmount(amount);

  @override
  Future<Cart> updateCartItemVariants(String cartItemId, Map<String, String> variants) =>
      _remoteDataSource.updateCartItemVariants(cartItemId, variants);

  @override
  Future<Cart> updateCartItemQuantity(String cartItemId, int quantity) =>
      _remoteDataSource.updateCartItem(cartItemId, quantity);

  @override
  Future<Cart> mergeGuestCart(String guestCartId, String userId) =>
      _remoteDataSource.mergeGuestCart(guestCartId, userId);
}