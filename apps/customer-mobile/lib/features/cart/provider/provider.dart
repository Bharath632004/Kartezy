import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:customer_mobile/features/cart/data/datasource/cart_remote_data_source.dart';

import 'package:customer_mobile/features/cart/data/repository/cart_repository_impl.dart';
import 'package:customer_mobile/features/cart/domain/repository/cart_repository.dart';
import 'package:customer_mobile/features/cart/domain/usecase/add_to_cart_usecase.dart';
import 'package:customer_mobile/features/cart/domain/usecase/apply_coupon_usecase.dart';
import 'package:customer_mobile/features/cart/domain/usecase/clear_cart_usecase.dart';
import 'package:customer_mobile/features/cart/domain/usecase/get_cart_usecase.dart';
import 'package:customer_mobile/features/cart/domain/usecase/move_to_wishlist_usecase.dart';
import 'package:customer_mobile/features/cart/domain/usecase/remove_cart_item_usecase.dart';
import 'package:customer_mobile/features/cart/domain/usecase/remove_coupon_usecase.dart';
import 'package:customer_mobile/features/cart/domain/usecase/save_for_later_usecase.dart';
import 'package:customer_mobile/features/cart/domain/usecase/update_cart_item_quantity_usecase.dart';
import 'package:customer_mobile/features/cart/domain/usecase/update_cart_item_variants_usecase.dart';
import 'package:customer_mobile/features/cart/domain/usecase/update_wallet_amount_usecase.dart';
import 'package:customer_mobile/features/cart/domain/usecase/merge_guest_cart_usecase.dart';

import 'package:customer_mobile/core/providers/network_provider.dart';
import 'package:customer_mobile/shared/models/cart.dart';
import 'package:hive/hive.dart';

// Providers for data source and repository
final cartRemoteDataSourceProvider = Provider<CartRemoteDataSource>((ref) {
  final dio = ref.read(dioProvider);
  return CartRemoteDataSourceImpl(dio);
});

final cartRepositoryProvider = Provider<CartRepository>((ref) {
  final remoteDataSource = ref.read(cartRemoteDataSourceProvider);
  return CartRepositoryImpl(remoteDataSource);
});

// Providers for use cases
final getCartUseCaseProvider = Provider<GetCartUseCase>((ref) {
  final repository = ref.read(cartRepositoryProvider);
  return GetCartUseCase(repository);
});

final addToCartUseCaseProvider = Provider<AddToCartUseCase>((ref) {
  final repository = ref.read(cartRepositoryProvider);
  return AddToCartUseCase(repository);
});

final updateCartItemQuantityUseCaseProvider =
    Provider<UpdateCartItemQuantityUseCase>((ref) {
      final repository = ref.read(cartRepositoryProvider);
      return UpdateCartItemQuantityUseCase(repository);
    });

final updateCartItemVariantsUseCaseProvider =
    Provider<UpdateCartItemVariantsUseCase>((ref) {
      final repository = ref.read(cartRepositoryProvider);
      return UpdateCartItemVariantsUseCase(repository);
    });

final removeCartItemUseCaseProvider = Provider<RemoveCartItemUseCase>((ref) {
  final repository = ref.read(cartRepositoryProvider);
  return RemoveCartItemUseCase(repository);
});

final clearCartUseCaseProvider = Provider<ClearCartUseCase>((ref) {
  final repository = ref.read(cartRepositoryProvider);
  return ClearCartUseCase(repository);
});

final applyCouponUseCaseProvider = Provider<ApplyCouponUseCase>((ref) {
  final repository = ref.read(cartRepositoryProvider);
  return ApplyCouponUseCase(repository);
});

final removeCouponUseCaseProvider = Provider<RemoveCouponUseCase>((ref) {
  final repository = ref.read(cartRepositoryProvider);
  return RemoveCouponUseCase(repository);
});

final saveForLaterUseCaseProvider = Provider<SaveForLaterUseCase>((ref) {
  final repository = ref.read(cartRepositoryProvider);
  return SaveForLaterUseCase(repository);
});

final moveToWishlistUseCaseProvider = Provider<MoveToWishlistUseCase>((ref) {
  final repository = ref.read(cartRepositoryProvider);
  return MoveToWishlistUseCase(repository);
});

final updateWalletAmountUseCaseProvider = Provider<UpdateWalletAmountUseCase>((
  ref,
) {
  final repository = ref.read(cartRepositoryProvider);
  return UpdateWalletAmountUseCase(repository);
});

final mergeGuestCartUseCaseProvider = Provider<MergeGuestCartUseCase>((ref) {
  final repository = ref.read(cartRepositoryProvider);
  return MergeGuestCartUseCase(repository);
});

// State holder for the cart.
class CartState {
  final Cart? cart;
  final bool isLoading;
  final String? errorMessage;

  const CartState({this.cart, this.isLoading = false, this.errorMessage});

  CartState copyWith({Cart? cart, bool? isLoading, String? errorMessage}) {
    return CartState(
      cart: cart ?? this.cart,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

// Notifier for managing the cart state.
class CartNotifier extends StateNotifier<CartState> {
  final GetCartUseCase _getCartUseCase;
  final AddToCartUseCase _addToCartUseCase;
  final UpdateCartItemQuantityUseCase _updateCartItemQuantityUseCase;
  final UpdateCartItemVariantsUseCase _updateCartItemVariantsUseCase;
  final RemoveCartItemUseCase _removeCartItemUseCase;
  final ClearCartUseCase _clearCartUseCase;
  final ApplyCouponUseCase _applyCouponUseCase;
  final RemoveCouponUseCase _removeCouponUseCase;
  final SaveForLaterUseCase _saveForLaterUseCase;
  final MoveToWishlistUseCase _moveToWishlistUseCase;
  final UpdateWalletAmountUseCase _updateWalletAmountUseCase;
  final MergeGuestCartUseCase _mergeGuestCartUseCase;

  CartNotifier({
    required this._getCartUseCase,
    required this._addToCartUseCase,
    required this._updateCartItemQuantityUseCase,
    required this._updateCartItemVariantsUseCase,
    required this._removeCartItemUseCase,
    required this._clearCartUseCase,
    required this._applyCouponUseCase,
    required this._removeCouponUseCase,
    required this._saveForLaterUseCase,
    required this._moveToWishlistUseCase,
    required this._updateWalletAmountUseCase,
    required this._mergeGuestCartUseCase,
  }) : super(const CartState());

  // Saves the guest cart ID to local storage.
  Future<void> _saveGuestCartId(String cartId) async {
    final box = await Hive.openBox<String>('guestCart');
    await box.put('cartId', cartId);
  }

  // Fetches the cart for the given userId (null for guest cart).
  Future<void> fetchCart(String? userId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _getCartUseCase(userId);
      // If this is a guest cart, save the cart ID for later merging.
      if (userId == null) {
        await _saveGuestCartId(cart.id);
      }
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  // Adds a product to the cart.
  Future<void> addToCart(
    String productId,
    int quantity,
    Map<String, String> variants,
  ) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _addToCartUseCase(productId, quantity, variants);
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  // Updates the quantity of a cart item.
  Future<void> updateCartItemQuantity(String cartItemId, int quantity) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _updateCartItemQuantityUseCase(cartItemId, quantity);
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  // Updates the variant of a cart item.
  Future<void> updateCartItemVariants(
    String cartItemId,
    Map<String, String> variants,
  ) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _updateCartItemVariantsUseCase(cartItemId, variants);
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  // Removes a cart item.
  Future<void> removeCartItem(String cartItemId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _removeCartItemUseCase(cartItemId);
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  // Clears the entire cart.
  Future<void> clearCart() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _clearCartUseCase();
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  // Applies a coupon to the cart.
  Future<void> applyCoupon(String couponCode) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _applyCouponUseCase(couponCode);
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  // Removes the applied coupon from the cart.
  Future<void> removeCoupon() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _removeCouponUseCase();
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  // Saves a cart item for later.
  Future<void> saveForLater(String cartItemId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _saveForLaterUseCase(cartItemId);
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  // Moves a cart item to the wishlist.
  Future<void> moveToWishlist(String cartItemId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _moveToWishlistUseCase(cartItemId);
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  // Updates the wallet amount to be used for payment.
  Future<void> updateWalletAmount(double amount) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _updateWalletAmountUseCase(amount);
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  // Merges guest cart with user cart after login.
  Future<void> mergeGuestCart(String guestCartId, String userId) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cart = await _mergeGuestCartUseCase(guestCartId, userId);
      state = state.copyWith(cart: cart, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

// Provider for the CartNotifier.
final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) {
  return CartNotifier(
    getCartUseCase: ref.read(getCartUseCaseProvider),
    addToCartUseCase: ref.read(addToCartUseCaseProvider),
    updateCartItemQuantityUseCase: ref.read(
      updateCartItemQuantityUseCaseProvider,
    ),
    updateCartItemVariantsUseCase: ref.read(
      updateCartItemVariantsUseCaseProvider,
    ),
    removeCartItemUseCase: ref.read(removeCartItemUseCaseProvider),
    clearCartUseCase: ref.read(clearCartUseCaseProvider),
    applyCouponUseCase: ref.read(applyCouponUseCaseProvider),
    removeCouponUseCase: ref.read(removeCouponUseCaseProvider),
    saveForLaterUseCase: ref.read(saveForLaterUseCaseProvider),
    moveToWishlistUseCase: ref.read(moveToWishlistUseCaseProvider),
    updateWalletAmountUseCase: ref.read(updateWalletAmountUseCaseProvider),
    mergeGuestCartUseCase: ref.read(mergeGuestCartUseCaseProvider),
  );
});