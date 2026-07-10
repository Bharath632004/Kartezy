import 'package:customer_mobile/shared/models/cart.dart';

abstract class CartRepository {
  Future<Cart> getCart(String? userId);

  Future<Cart> addToCart(String productId, int quantity, Map<String, String> variants);

  Future<Cart> updateCartItem(String cartItemId, int quantity);

  Future<Cart> removeCartItem(String cartItemId);

  Future<Cart> clearCart();

  Future<Cart> applyCoupon(String couponCode);

  Future<Cart> removeCoupon();

  Future<Cart> saveForLater(String cartItemId);

  Future<Cart> moveToWishlist(String cartItemId);

  Future<Cart> restoreFromSaveForLater(String cartItemId);

  Future<Cart> updateWalletAmount(double amount);

  Future<Cart> updateCartItemVariants(String cartItemId, Map<String, String> variants);

  Future<Cart> updateCartItemQuantity(String cartItemId, int quantity);

  Future<Cart> mergeGuestCart(String guestCartId, String userId);
}