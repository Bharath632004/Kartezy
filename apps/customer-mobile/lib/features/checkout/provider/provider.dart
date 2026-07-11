import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:customer_mobile/features/checkout/data/datasource/checkout_remote_data_source.dart';
import 'package:customer_mobile/features/checkout/data/repository/checkout_repository_impl.dart';
import 'package:customer_mobile/features/checkout/domain/repository/checkout_repository.dart';
import 'package:customer_mobile/features/checkout/domain/usecase/apply_coupon_usecase.dart';
import 'package:customer_mobile/features/checkout/domain/usecase/get_checkout_summary_usecase.dart';
import 'package:customer_mobile/features/checkout/domain/usecase/place_order_usecase.dart';
import 'package:customer_mobile/features/checkout/domain/usecase/remove_coupon_usecase.dart';
import 'package:customer_mobile/features/checkout/domain/usecase/save_address_usecase.dart';
import 'package:customer_mobile/features/checkout/domain/usecase/set_contactless_delivery_usecase.dart';
import 'package:customer_mobile/features/checkout/domain/usecase/set_delivery_instructions_usecase.dart';
import 'package:customer_mobile/features/checkout/domain/usecase/set_instant_delivery_usecase.dart';
import 'package:customer_mobile/features/checkout/domain/usecase/set_scheduled_delivery_usecase.dart';
import 'package:customer_mobile/features/checkout/domain/usecase/select_delivery_slot_usecase.dart';
import 'package:customer_mobile/shared/models/address.dart';
import 'package:customer_mobile/shared/models/checkout_summary.dart';
import 'package:customer_mobile/core/providers/network_provider.dart';

// Providers for data source and repository
final checkoutRemoteDataSourceProvider = Provider<CheckoutRemoteDataSource>((ref) {
  final dioClient = ref.read(dioProvider);
  return CheckoutRemoteDataSourceImpl(dioClient);
});

final checkoutRepositoryProvider = Provider<CheckoutRepository>((ref) {
  final remoteDataSource = ref.read(checkoutRemoteDataSourceProvider);
  return CheckoutRepositoryImpl(remoteDataSource);
});

// Providers for use cases
final getCheckoutSummaryUseCaseProvider = Provider<GetCheckoutSummaryUseCase>((ref) {
  final repository = ref.read(checkoutRepositoryProvider);
  return GetCheckoutSummaryUseCase(repository);
});

final placeOrderUseCaseProvider = Provider<PlaceOrderUseCase>((ref) {
  final repository = ref.read(checkoutRepositoryProvider);
  return PlaceOrderUseCase(repository);
});

final saveAddressUseCaseProvider = Provider<SaveAddressUseCase>((ref) {
  final repository = ref.read(checkoutRepositoryProvider);
  return SaveAddressUseCase(repository);
});

final setDeliveryInstructionsUseCaseProvider = Provider<SetDeliveryInstructionsUseCase>((ref) {
  final repository = ref.read(checkoutRepositoryProvider);
  return SetDeliveryInstructionsUseCase(repository);
});

final setContactlessDeliveryUseCaseProvider = Provider<SetContactlessDeliveryUseCase>((ref) {
  final repository = ref.read(checkoutRepositoryProvider);
  return SetContactlessDeliveryUseCase(repository);
});

final setInstantDeliveryUseCaseProvider = Provider<SetInstantDeliveryUseCase>((ref) {
  final repository = ref.read(checkoutRepositoryProvider);
  return SetInstantDeliveryUseCase(repository);
});

final setScheduledDeliveryUseCaseProvider = Provider<SetScheduledDeliveryUseCase>((ref) {
  final repository = ref.read(checkoutRepositoryProvider);
  return SetScheduledDeliveryUseCase(repository);
});

final selectDeliverySlotUseCaseProvider = Provider<SelectDeliverySlotUseCase>((ref) {
  final repository = ref.read(checkoutRepositoryProvider);
  return SelectDeliverySlotUseCase(repository);
});

final applyCouponUseCaseProvider = Provider<ApplyCouponUseCase>((ref) {
  final repository = ref.read(checkoutRepositoryProvider);
  return ApplyCouponUseCase(repository);
});

final removeCouponUseCaseProvider = Provider<RemoveCouponUseCase>((ref) {
  final repository = ref.read(checkoutRepositoryProvider);
  return RemoveCouponUseCase(repository);
});

// State holder for the checkout.
class CheckoutState {
  final CheckoutSummary? cartSummary;
  final Address? selectedAddress;
  final String? deliveryInstructions;
  final bool contactlessDelivery;
  final bool instantDelivery;
  final DateTime? scheduledDeliveryDateTime;
  final String? deliverySlot;
  final String? orderNotes;
  final bool isLoading;
  final String? errorMessage;

  const CheckoutState({
    this.cartSummary,
    this.selectedAddress,
    this.deliveryInstructions,
    this.contactlessDelivery = false,
    this.instantDelivery = false,
    this.scheduledDeliveryDateTime,
    this.deliverySlot,
    this.orderNotes,
    this.isLoading = false,
    this.errorMessage,
  });

  CheckoutState copyWith({
    CheckoutSummary? cartSummary,
    Address? selectedAddress,
    String? deliveryInstructions,
    bool? contactlessDelivery,
    bool? instantDelivery,
    DateTime? scheduledDeliveryDateTime,
    String? deliverySlot,
    String? orderNotes,
    bool? isLoading,
    String? errorMessage,
  }) {
    return CheckoutState(
      cartSummary: cartSummary ?? this.cartSummary,
      selectedAddress: selectedAddress ?? this.selectedAddress,
      deliveryInstructions: deliveryInstructions ?? this.deliveryInstructions,
      contactlessDelivery: contactlessDelivery ?? this.contactlessDelivery,
      instantDelivery: instantDelivery ?? this.instantDelivery,
      scheduledDeliveryDateTime: scheduledDeliveryDateTime ?? this.scheduledDeliveryDateTime,
      deliverySlot: deliverySlot ?? this.deliverySlot,
      orderNotes: orderNotes ?? this.orderNotes,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

// Notifier for managing the checkout state.
class CheckoutNotifier extends StateNotifier<CheckoutState> {
  final GetCheckoutSummaryUseCase _getCheckoutSummaryUseCase;
  final PlaceOrderUseCase _placeOrderUseCase;
  final SaveAddressUseCase _saveAddressUseCase;
  final SetDeliveryInstructionsUseCase _setDeliveryInstructionsUseCase;
  final SetContactlessDeliveryUseCase _setContactlessDeliveryUseCase;
  final SetInstantDeliveryUseCase _setInstantDeliveryUseCase;
  final SetScheduledDeliveryUseCase _setScheduledDeliveryUseCase;
  final SelectDeliverySlotUseCase _selectDeliverySlotUseCase;
  final ApplyCouponUseCase _applyCouponUseCase;
  final RemoveCouponUseCase _removeCouponUseCase;

  CheckoutNotifier({
    required this._getCheckoutSummaryUseCase,
    required this._placeOrderUseCase,
    required this._saveAddressUseCase,
    required this._setDeliveryInstructionsUseCase,
    required this._setContactlessDeliveryUseCase,
    required this._setInstantDeliveryUseCase,
    required this._setScheduledDeliveryUseCase,
    required this._selectDeliverySlotUseCase,
    required this._applyCouponUseCase,
    required this._removeCouponUseCase,
  }) : super(const CheckoutState());

  /// Loads the cart summary for checkout.
  Future<void> loadCartSummary([String? userId]) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final cartSummary = await _getCheckoutSummaryUseCase.call(userId);
      state = state.copyWith(cartSummary: cartSummary, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  /// Saves the selected address.
  Future<void> saveAddress(Address address) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _saveAddressUseCase.call(address);
      state = state.copyWith(selectedAddress: address, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  /// Sets delivery instructions.
  Future<void> setDeliveryInstructions(String instructions) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _setDeliveryInstructionsUseCase.call(instructions);
      state = state.copyWith(deliveryInstructions: instructions, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  /// Sets contactless delivery preference.
  Future<void> setContactlessDelivery(bool value) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _setContactlessDeliveryUseCase.call(value);
      state = state.copyWith(
        contactlessDelivery: value,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  /// Sets instant delivery preference.
  Future<void> setInstantDelivery(bool value) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _setInstantDeliveryUseCase.call(value);
      state = state.copyWith(
        instantDelivery: value,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  /// Sets scheduled delivery date and time.
  Future<void> setScheduledDelivery(DateTime dateTime) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _setScheduledDeliveryUseCase.call(dateTime);
      state = state.copyWith(
        scheduledDeliveryDateTime: dateTime,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  /// Selects a delivery slot.
  Future<void> selectDeliverySlot(String slot) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _selectDeliverySlotUseCase.call(slot);
      state = state.copyWith(
        deliverySlot: slot,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  /// Applies a coupon.
  Future<void> applyCoupon(String couponCode) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _applyCouponUseCase.call(couponCode);
      // Reload cart summary to reflect coupon
      await loadCartSummary();
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  /// Removes the applied coupon.
  Future<void> removeCoupon() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _removeCouponUseCase.call();
      // Reload cart summary to reflect coupon removal
      await loadCartSummary();
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  /// Places the order.
  Future<void> placeOrder() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      // Prepare order data
      final orderData = {
        'cartId': state.cartSummary?.id,
        'addressId': state.selectedAddress?.id,
        'deliveryInstructions': state.deliveryInstructions,
        'contactlessDelivery': state.contactlessDelivery,
        'instantDelivery': state.instantDelivery,
        'scheduledDeliveryDateTime':
            state.scheduledDeliveryDateTime?.toIso8601String(),
        'deliverySlot': state.deliverySlot,
        'orderNotes': state.orderNotes,
      };
      // Remove null values
      orderData.removeWhere((key, value) => value == null);
      await _placeOrderUseCase.call(orderData);
      // Optionally, you can emit an event or update state with the order
      // For now, we just return the order; the UI can handle navigation.
      state = state.copyWith(isLoading: false);
      // In a real app, you might show a success screen with the order details.
      // We'll leave state as is for now.
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }
}

// Provider for the CheckoutNotifier.
final checkoutProvider =
    StateNotifierProvider<CheckoutNotifier, CheckoutState>((ref) {
  return CheckoutNotifier(
    getCheckoutSummaryUseCase: ref.read(getCheckoutSummaryUseCaseProvider),
    placeOrderUseCase: ref.read(placeOrderUseCaseProvider),
    saveAddressUseCase: ref.read(saveAddressUseCaseProvider),
    setDeliveryInstructionsUseCase:
        ref.read(setDeliveryInstructionsUseCaseProvider),
    setContactlessDeliveryUseCase:
        ref.read(setContactlessDeliveryUseCaseProvider),
    setInstantDeliveryUseCase: ref.read(setInstantDeliveryUseCaseProvider),
    setScheduledDeliveryUseCase:
        ref.read(setScheduledDeliveryUseCaseProvider),
    selectDeliverySlotUseCase: ref.read(selectDeliverySlotUseCaseProvider),
    applyCouponUseCase: ref.read(applyCouponUseCaseProvider),
    removeCouponUseCase: ref.read(removeCouponUseCaseProvider),
  );
});