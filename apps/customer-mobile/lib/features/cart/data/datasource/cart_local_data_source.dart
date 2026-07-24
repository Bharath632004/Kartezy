// lib/features/cart/data/datasource/cart_local_data_source.dart
// Local implementation of CartRemoteDataSource using Hive storage.
// Since the backend has no cart service (order-service only handles orders),
// the cart is managed locally on the device for MVP.

import 'package:hive_flutter/hive_flutter.dart';
import 'package:customer_mobile/shared/models/cart.dart';
import 'package:customer_mobile/shared/models/cart_item.dart';
import 'package:customer_mobile/shared/models/product.dart';
import 'package:customer_mobile/features/cart/data/datasource/cart_remote_data_source.dart';

class CartLocalDataSource implements CartRemoteDataSource {
  static const String _boxName = 'cart_box';

  CartLocalDataSource();

  Box<dynamic>? _box;

  Future<Box<dynamic>> _getBox() async {
    if (_box != null && _box!.isOpen) return _box!;
    _box = await Hive.openBox(_boxName);
    return _box!;
  }

  @override
  Future<Cart> getCart(String? userId) async {
    final box = await _getBox();
    final data = box.get('cart');
    if (data != null) {
      return Cart.fromJson(Map<String, dynamic>.from(data));
    }
    // Return empty cart
    return Cart(
      id: 'local_cart',
      userId: userId,
      items: [],
      couponCode: null,
      discountAmount: 0,
      totalAmount: 0,
      itemCount: 0,
      platformFee: 0,
      deliveryCharges: 0,
      packagingFee: 0,
      gstAmount: 0,
      tipAmount: 0,
      walletAmount: 0,
      netAmount: 0,
    );
  }

  @override
  Future<Cart> addToCart(
    String productId,
    int quantity,
    Map<String, String> variants,
  ) async {
    final box = await _getBox();
    final cart = await getCart(null);

    // Check if item already exists
    final existingIndex = cart.items.indexWhere(
      (item) =>
          item.productId == productId &&
          _mapsEqual(item.selectedVariants, variants),
    );

    final newItems = [...cart.items];
    if (existingIndex >= 0) {
      // Update quantity
      final existing = newItems[existingIndex];
      newItems[existingIndex] = CartItem(
        id: existing.id,
        productId: existing.productId,
        product: existing.product,
        quantity: existing.quantity + quantity,
        selectedVariants: existing.selectedVariants,
      );
    } else {
      // Create cart item with product ID; full details will be populated
      // when the checkout summary is fetched from the order service
      newItems.add(
        CartItem(
          id: 'ci_${DateTime.now().millisecondsSinceEpoch}',
          productId: productId,
          product: Product(
            id: productId,
            name: 'Product',
            description: '',
            shortDescription: '',
            price: 0,
            compareAtPrice: null,
            imageUrl: '',
            images: [],
            stock: 0,
            tags: [],
          ),
          quantity: quantity,
          selectedVariants: variants,
        ),
      );
    }

    final updatedCart = _recalculateCart(cart.copyWith(items: newItems));
    await box.put('cart', updatedCart.toJson());
    return updatedCart;
  }

  @override
  Future<Cart> updateCartItem(String cartItemId, int quantity) async {
    final box = await _getBox();
    final cart = await getCart(null);
    final newItems = cart.items.map((item) {
      if (item.id == cartItemId) {
        return item.copyWith(quantity: quantity);
      }
      return item;
    }).toList();

    final updatedCart = _recalculateCart(cart.copyWith(items: newItems));
    await box.put('cart', updatedCart.toJson());
    return updatedCart;
  }

  @override
  Future<Cart> removeCartItem(String cartItemId) async {
    final box = await _getBox();
    final cart = await getCart(null);
    final newItems = cart.items.where((item) => item.id != cartItemId).toList();
    final updatedCart = _recalculateCart(cart.copyWith(items: newItems));
    await box.put('cart', updatedCart.toJson());
    return updatedCart;
  }

  @override
  Future<Cart> clearCart() async {
    final box = await _getBox();
    await box.delete('cart');
    return getCart(null);
  }

  @override
  Future<Cart> applyCoupon(String couponCode) async {
    final box = await _getBox();
    final cart = await getCart(null);
    // For MVP, apply a flat 10% discount
    final discount = cart.totalAmount * 0.1;
    final updatedCart = cart.copyWith(
      couponCode: couponCode.toUpperCase(),
      discountAmount: discount,
    );
    final recalculated = _recalculateCart(updatedCart);
    await box.put('cart', recalculated.toJson());
    return recalculated;
  }

  @override
  Future<Cart> removeCoupon() async {
    final box = await _getBox();
    final cart = await getCart(null);
    final updatedCart = cart.copyWith(couponCode: null, discountAmount: 0);
    final recalculated = _recalculateCart(updatedCart);
    await box.put('cart', recalculated.toJson());
    return recalculated;
  }

  @override
  Future<Cart> saveForLater(String cartItemId) async {
    final box = await _getBox();
    final cart = await getCart(null);
    final itemToSave = cart.items
        .where((item) => item.id == cartItemId)
        .toList();
    final remainingItems = cart.items
        .where((item) => item.id != cartItemId)
        .toList();
    final savedItems =
        box.get('saved_for_later', defaultValue: <dynamic>[]) as List<dynamic>;
    final updatedSaved = [
      ...savedItems,
      ...itemToSave.map((item) => item.toJson()),
    ];
    await box.put('saved_for_later', updatedSaved);
    final updatedCart = _recalculateCart(cart.copyWith(items: remainingItems));
    await box.put('cart', updatedCart.toJson());
    return updatedCart;
  }

  @override
  Future<Cart> moveToWishlist(String cartItemId) async {
    // Move to wishlist is handled by the wishlist feature;
    // this just removes the item from cart.
    return removeCartItem(cartItemId);
  }

  @override
  Future<Cart> restoreFromSaveForLater(String cartItemId) async {
    final box = await _getBox();
    final cart = await getCart(null);
    final savedItems =
        box.get('saved_for_later', defaultValue: <dynamic>[]) as List<dynamic>;
    final itemIndex = savedItems.indexWhere(
      (item) => (item as Map<String, dynamic>)['id'] == cartItemId,
    );
    if (itemIndex < 0) return cart;
    final restoredItem = CartItem.fromJson(
      Map<String, dynamic>.from(savedItems[itemIndex] as Map),
    );
    savedItems.removeAt(itemIndex);
    await box.put('saved_for_later', savedItems);
    final updatedItems = [...cart.items, restoredItem];
    final updatedCart = _recalculateCart(cart.copyWith(items: updatedItems));
    await box.put('cart', updatedCart.toJson());
    return updatedCart;
  }

  @override
  Future<Cart> updateWalletAmount(double amount) async {
    final box = await _getBox();
    final cart = await getCart(null);
    final updatedCart = cart.copyWith(walletAmount: amount);
    final recalculated = _recalculateCart(updatedCart);
    await box.put('cart', recalculated.toJson());
    return recalculated;
  }

  @override
  Future<Cart> updateCartItemVariants(
    String cartItemId,
    Map<String, String> variants,
  ) async {
    final box = await _getBox();
    final cart = await getCart(null);
    final newItems = cart.items.map((item) {
      if (item.id == cartItemId) {
        return item.copyWith(selectedVariants: variants);
      }
      return item;
    }).toList();
    final updatedCart = cart.copyWith(items: newItems);
    await box.put('cart', updatedCart.toJson());
    return updatedCart;
  }

  @override
  Future<Cart> updateCartItemQuantity(String cartItemId, int quantity) async {
    return updateCartItem(cartItemId, quantity);
  }

  @override
  Future<Cart> mergeGuestCart(String guestCartId, String userId) async {
    final box = await _getBox();
    final guestCart = await getCart(null);
    if (guestCart.items.isEmpty) return guestCart;
    final mergedCart = guestCart.copyWith(userId: userId);
    await box.put('cart', mergedCart.toJson());
    return mergedCart;
  }

  Cart _recalculateCart(Cart cart) {
    final subtotal = cart.items.fold<double>(
      0,
      (sum, item) => sum + (item.product.price * item.quantity),
    );
    final deliveryFee = subtotal > 500 ? 0.0 : 20.0; // Free above ₹500
    final platformFee = 5.0;
    final packagingFee = cart.items.length * 2.0;
    final gst = subtotal * 0.05;
    final tip = cart.tipAmount;
    final wallet = cart.walletAmount;
    final discount = cart.discountAmount;
    final net =
        subtotal +
        deliveryFee +
        platformFee +
        packagingFee +
        gst +
        tip -
        wallet -
        discount;

    return cart.copyWith(
      totalAmount: subtotal,
      itemCount: cart.items.length,
      deliveryCharges: deliveryFee,
      platformFee: platformFee,
      packagingFee: packagingFee,
      gstAmount: gst,
      tipAmount: tip,
      walletAmount: wallet,
      discountAmount: discount,
      netAmount: net > 0 ? net : 0,
    );
  }

  bool _mapsEqual(Map<String, String> a, Map<String, String> b) {
    if (a.length != b.length) return false;
    return a.entries.every((e) => b[e.key] == e.value);
  }
}
