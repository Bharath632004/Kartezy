import 'package:customer_mobile/shared/models/cart.dart';
import 'package:customer_mobile/shared/models/cart_item.dart';

abstract class CartRepository {
  Future<Cart> getCart();

  Future<Cart> addToCart(CartItem item);

  Future<Cart> updateCartItemQuantity(String itemId, int quantity);

  Future<Cart> removeFromCart(String itemId);

  Future<Cart> clearCart();

  Future<Cart> applyCoupon(String couponCode);

  Future<Cart> removeCoupon();

  Future<Cart> updateCartItemVariants(String itemId, Map<String, String> variants);

  Future<Cart> saveForLater(String itemId);

  Future<Cart> moveToWishlist(String itemId);

  // Additional methods for wallet deduction, etc. might be in payment/checkout
}