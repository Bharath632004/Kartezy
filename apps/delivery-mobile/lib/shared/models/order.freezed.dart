// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'order.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Order _$OrderFromJson(Map<String, dynamic> json) {
  return _Order.fromJson(json);
}

/// @nodoc
mixin _$Order {
  String get id => throw _privateConstructorUsedError;
  String? get userId => throw _privateConstructorUsedError;
  String get cartId => throw _privateConstructorUsedError;
  List<OrderItem> get items => throw _privateConstructorUsedError;
  double get discountAmount => throw _privateConstructorUsedError;
  double get totalAmount => throw _privateConstructorUsedError;
  int get itemCount => throw _privateConstructorUsedError;
  double get platformFee => throw _privateConstructorUsedError;
  double get deliveryCharges => throw _privateConstructorUsedError;
  double get packagingFee => throw _privateConstructorUsedError;
  double get gstAmount => throw _privateConstructorUsedError;
  double get tipAmount => throw _privateConstructorUsedError;
  double get walletAmount => throw _privateConstructorUsedError;
  double get netAmount => throw _privateConstructorUsedError;
  Address get deliveryAddress => throw _privateConstructorUsedError;
  Address? get billingAddress => throw _privateConstructorUsedError;
  String get orderStatus => throw _privateConstructorUsedError;
  String get paymentStatus => throw _privateConstructorUsedError;
  String? get paymentMethod => throw _privateConstructorUsedError;
  String? get deliveryInstructions => throw _privateConstructorUsedError;
  bool get contactlessDelivery => throw _privateConstructorUsedError;
  DateTime? get deliverySlotStart => throw _privateConstructorUsedError;
  DateTime? get deliverySlotEnd => throw _privateConstructorUsedError;
  DateTime get estimatedDeliveryTime => throw _privateConstructorUsedError;
  String? get couponCode => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $OrderCopyWith<Order> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $OrderCopyWith<$Res> {
  factory $OrderCopyWith(Order value, $Res Function(Order) then) =
      _$OrderCopyWithImpl<$Res, Order>;
  @useResult
  $Res call(
      {String id,
      String? userId,
      String cartId,
      List<OrderItem> items,
      double discountAmount,
      double totalAmount,
      int itemCount,
      double platformFee,
      double deliveryCharges,
      double packagingFee,
      double gstAmount,
      double tipAmount,
      double walletAmount,
      double netAmount,
      Address deliveryAddress,
      Address? billingAddress,
      String orderStatus,
      String paymentStatus,
      String? paymentMethod,
      String? deliveryInstructions,
      bool contactlessDelivery,
      DateTime? deliverySlotStart,
      DateTime? deliverySlotEnd,
      DateTime estimatedDeliveryTime,
      String? couponCode,
      DateTime createdAt,
      DateTime updatedAt});

  $AddressCopyWith<$Res> get deliveryAddress;
  $AddressCopyWith<$Res>? get billingAddress;
}

/// @nodoc
class _$OrderCopyWithImpl<$Res, $Val extends Order>
    implements $OrderCopyWith<$Res> {
  _$OrderCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = freezed,
    Object? cartId = null,
    Object? items = null,
    Object? discountAmount = null,
    Object? totalAmount = null,
    Object? itemCount = null,
    Object? platformFee = null,
    Object? deliveryCharges = null,
    Object? packagingFee = null,
    Object? gstAmount = null,
    Object? tipAmount = null,
    Object? walletAmount = null,
    Object? netAmount = null,
    Object? deliveryAddress = null,
    Object? billingAddress = freezed,
    Object? orderStatus = null,
    Object? paymentStatus = null,
    Object? paymentMethod = freezed,
    Object? deliveryInstructions = freezed,
    Object? contactlessDelivery = null,
    Object? deliverySlotStart = freezed,
    Object? deliverySlotEnd = freezed,
    Object? estimatedDeliveryTime = null,
    Object? couponCode = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      userId: freezed == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String?,
      cartId: null == cartId
          ? _value.cartId
          : cartId // ignore: cast_nullable_to_non_nullable
              as String,
      items: null == items
          ? _value.items
          : items // ignore: cast_nullable_to_non_nullable
              as List<OrderItem>,
      discountAmount: null == discountAmount
          ? _value.discountAmount
          : discountAmount // ignore: cast_nullable_to_non_nullable
              as double,
      totalAmount: null == totalAmount
          ? _value.totalAmount
          : totalAmount // ignore: cast_nullable_to_non_nullable
              as double,
      itemCount: null == itemCount
          ? _value.itemCount
          : itemCount // ignore: cast_nullable_to_non_nullable
              as int,
      platformFee: null == platformFee
          ? _value.platformFee
          : platformFee // ignore: cast_nullable_to_non_nullable
              as double,
      deliveryCharges: null == deliveryCharges
          ? _value.deliveryCharges
          : deliveryCharges // ignore: cast_nullable_to_non_nullable
              as double,
      packagingFee: null == packagingFee
          ? _value.packagingFee
          : packagingFee // ignore: cast_nullable_to_non_nullable
              as double,
      gstAmount: null == gstAmount
          ? _value.gstAmount
          : gstAmount // ignore: cast_nullable_to_non_nullable
              as double,
      tipAmount: null == tipAmount
          ? _value.tipAmount
          : tipAmount // ignore: cast_nullable_to_non_nullable
              as double,
      walletAmount: null == walletAmount
          ? _value.walletAmount
          : walletAmount // ignore: cast_nullable_to_non_nullable
              as double,
      netAmount: null == netAmount
          ? _value.netAmount
          : netAmount // ignore: cast_nullable_to_non_nullable
              as double,
      deliveryAddress: null == deliveryAddress
          ? _value.deliveryAddress
          : deliveryAddress // ignore: cast_nullable_to_non_nullable
              as Address,
      billingAddress: freezed == billingAddress
          ? _value.billingAddress
          : billingAddress // ignore: cast_nullable_to_non_nullable
              as Address?,
      orderStatus: null == orderStatus
          ? _value.orderStatus
          : orderStatus // ignore: cast_nullable_to_non_nullable
              as String,
      paymentStatus: null == paymentStatus
          ? _value.paymentStatus
          : paymentStatus // ignore: cast_nullable_to_non_nullable
              as String,
      paymentMethod: freezed == paymentMethod
          ? _value.paymentMethod
          : paymentMethod // ignore: cast_nullable_to_non_nullable
              as String?,
      deliveryInstructions: freezed == deliveryInstructions
          ? _value.deliveryInstructions
          : deliveryInstructions // ignore: cast_nullable_to_non_nullable
              as String?,
      contactlessDelivery: null == contactlessDelivery
          ? _value.contactlessDelivery
          : contactlessDelivery // ignore: cast_nullable_to_non_nullable
              as bool,
      deliverySlotStart: freezed == deliverySlotStart
          ? _value.deliverySlotStart
          : deliverySlotStart // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      deliverySlotEnd: freezed == deliverySlotEnd
          ? _value.deliverySlotEnd
          : deliverySlotEnd // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      estimatedDeliveryTime: null == estimatedDeliveryTime
          ? _value.estimatedDeliveryTime
          : estimatedDeliveryTime // ignore: cast_nullable_to_non_nullable
              as DateTime,
      couponCode: freezed == couponCode
          ? _value.couponCode
          : couponCode // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $AddressCopyWith<$Res> get deliveryAddress {
    return $AddressCopyWith<$Res>(_value.deliveryAddress, (value) {
      return _then(_value.copyWith(deliveryAddress: value) as $Val);
    });
  }

  @override
  @pragma('vm:prefer-inline')
  $AddressCopyWith<$Res>? get billingAddress {
    if (_value.billingAddress == null) {
      return null;
    }

    return $AddressCopyWith<$Res>(_value.billingAddress!, (value) {
      return _then(_value.copyWith(billingAddress: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$OrderImplCopyWith<$Res> implements $OrderCopyWith<$Res> {
  factory _$$OrderImplCopyWith(
          _$OrderImpl value, $Res Function(_$OrderImpl) then) =
      __$$OrderImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String? userId,
      String cartId,
      List<OrderItem> items,
      double discountAmount,
      double totalAmount,
      int itemCount,
      double platformFee,
      double deliveryCharges,
      double packagingFee,
      double gstAmount,
      double tipAmount,
      double walletAmount,
      double netAmount,
      Address deliveryAddress,
      Address? billingAddress,
      String orderStatus,
      String paymentStatus,
      String? paymentMethod,
      String? deliveryInstructions,
      bool contactlessDelivery,
      DateTime? deliverySlotStart,
      DateTime? deliverySlotEnd,
      DateTime estimatedDeliveryTime,
      String? couponCode,
      DateTime createdAt,
      DateTime updatedAt});

  @override
  $AddressCopyWith<$Res> get deliveryAddress;
  @override
  $AddressCopyWith<$Res>? get billingAddress;
}

/// @nodoc
class __$$OrderImplCopyWithImpl<$Res>
    extends _$OrderCopyWithImpl<$Res, _$OrderImpl>
    implements _$$OrderImplCopyWith<$Res> {
  __$$OrderImplCopyWithImpl(
      _$OrderImpl _value, $Res Function(_$OrderImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = freezed,
    Object? cartId = null,
    Object? items = null,
    Object? discountAmount = null,
    Object? totalAmount = null,
    Object? itemCount = null,
    Object? platformFee = null,
    Object? deliveryCharges = null,
    Object? packagingFee = null,
    Object? gstAmount = null,
    Object? tipAmount = null,
    Object? walletAmount = null,
    Object? netAmount = null,
    Object? deliveryAddress = null,
    Object? billingAddress = freezed,
    Object? orderStatus = null,
    Object? paymentStatus = null,
    Object? paymentMethod = freezed,
    Object? deliveryInstructions = freezed,
    Object? contactlessDelivery = null,
    Object? deliverySlotStart = freezed,
    Object? deliverySlotEnd = freezed,
    Object? estimatedDeliveryTime = null,
    Object? couponCode = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(_$OrderImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      userId: freezed == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String?,
      cartId: null == cartId
          ? _value.cartId
          : cartId // ignore: cast_nullable_to_non_nullable
              as String,
      items: null == items
          ? _value._items
          : items // ignore: cast_nullable_to_non_nullable
              as List<OrderItem>,
      discountAmount: null == discountAmount
          ? _value.discountAmount
          : discountAmount // ignore: cast_nullable_to_non_nullable
              as double,
      totalAmount: null == totalAmount
          ? _value.totalAmount
          : totalAmount // ignore: cast_nullable_to_non_nullable
              as double,
      itemCount: null == itemCount
          ? _value.itemCount
          : itemCount // ignore: cast_nullable_to_non_nullable
              as int,
      platformFee: null == platformFee
          ? _value.platformFee
          : platformFee // ignore: cast_nullable_to_non_nullable
              as double,
      deliveryCharges: null == deliveryCharges
          ? _value.deliveryCharges
          : deliveryCharges // ignore: cast_nullable_to_non_nullable
              as double,
      packagingFee: null == packagingFee
          ? _value.packagingFee
          : packagingFee // ignore: cast_nullable_to_non_nullable
              as double,
      gstAmount: null == gstAmount
          ? _value.gstAmount
          : gstAmount // ignore: cast_nullable_to_non_nullable
              as double,
      tipAmount: null == tipAmount
          ? _value.tipAmount
          : tipAmount // ignore: cast_nullable_to_non_nullable
              as double,
      walletAmount: null == walletAmount
          ? _value.walletAmount
          : walletAmount // ignore: cast_nullable_to_non_nullable
              as double,
      netAmount: null == netAmount
          ? _value.netAmount
          : netAmount // ignore: cast_nullable_to_non_nullable
              as double,
      deliveryAddress: null == deliveryAddress
          ? _value.deliveryAddress
          : deliveryAddress // ignore: cast_nullable_to_non_nullable
              as Address,
      billingAddress: freezed == billingAddress
          ? _value.billingAddress
          : billingAddress // ignore: cast_nullable_to_non_nullable
              as Address?,
      orderStatus: null == orderStatus
          ? _value.orderStatus
          : orderStatus // ignore: cast_nullable_to_non_nullable
              as String,
      paymentStatus: null == paymentStatus
          ? _value.paymentStatus
          : paymentStatus // ignore: cast_nullable_to_non_nullable
              as String,
      paymentMethod: freezed == paymentMethod
          ? _value.paymentMethod
          : paymentMethod // ignore: cast_nullable_to_non_nullable
              as String?,
      deliveryInstructions: freezed == deliveryInstructions
          ? _value.deliveryInstructions
          : deliveryInstructions // ignore: cast_nullable_to_non_nullable
              as String?,
      contactlessDelivery: null == contactlessDelivery
          ? _value.contactlessDelivery
          : contactlessDelivery // ignore: cast_nullable_to_non_nullable
              as bool,
      deliverySlotStart: freezed == deliverySlotStart
          ? _value.deliverySlotStart
          : deliverySlotStart // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      deliverySlotEnd: freezed == deliverySlotEnd
          ? _value.deliverySlotEnd
          : deliverySlotEnd // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      estimatedDeliveryTime: null == estimatedDeliveryTime
          ? _value.estimatedDeliveryTime
          : estimatedDeliveryTime // ignore: cast_nullable_to_non_nullable
              as DateTime,
      couponCode: freezed == couponCode
          ? _value.couponCode
          : couponCode // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: null == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$OrderImpl implements _Order {
  const _$OrderImpl(
      {required this.id,
      required this.userId,
      required this.cartId,
      required final List<OrderItem> items,
      required this.discountAmount,
      required this.totalAmount,
      required this.itemCount,
      required this.platformFee,
      required this.deliveryCharges,
      required this.packagingFee,
      required this.gstAmount,
      required this.tipAmount,
      required this.walletAmount,
      required this.netAmount,
      required this.deliveryAddress,
      required this.billingAddress,
      required this.orderStatus,
      required this.paymentStatus,
      required this.paymentMethod,
      required this.deliveryInstructions,
      required this.contactlessDelivery,
      required this.deliverySlotStart,
      required this.deliverySlotEnd,
      required this.estimatedDeliveryTime,
      required this.couponCode,
      required this.createdAt,
      required this.updatedAt})
      : _items = items;

  factory _$OrderImpl.fromJson(Map<String, dynamic> json) =>
      _$$OrderImplFromJson(json);

  @override
  final String id;
  @override
  final String? userId;
  @override
  final String cartId;
  final List<OrderItem> _items;
  @override
  List<OrderItem> get items {
    if (_items is EqualUnmodifiableListView) return _items;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_items);
  }

  @override
  final double discountAmount;
  @override
  final double totalAmount;
  @override
  final int itemCount;
  @override
  final double platformFee;
  @override
  final double deliveryCharges;
  @override
  final double packagingFee;
  @override
  final double gstAmount;
  @override
  final double tipAmount;
  @override
  final double walletAmount;
  @override
  final double netAmount;
  @override
  final Address deliveryAddress;
  @override
  final Address? billingAddress;
  @override
  final String orderStatus;
  @override
  final String paymentStatus;
  @override
  final String? paymentMethod;
  @override
  final String? deliveryInstructions;
  @override
  final bool contactlessDelivery;
  @override
  final DateTime? deliverySlotStart;
  @override
  final DateTime? deliverySlotEnd;
  @override
  final DateTime estimatedDeliveryTime;
  @override
  final String? couponCode;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'Order(id: $id, userId: $userId, cartId: $cartId, items: $items, discountAmount: $discountAmount, totalAmount: $totalAmount, itemCount: $itemCount, platformFee: $platformFee, deliveryCharges: $deliveryCharges, packagingFee: $packagingFee, gstAmount: $gstAmount, tipAmount: $tipAmount, walletAmount: $walletAmount, netAmount: $netAmount, deliveryAddress: $deliveryAddress, billingAddress: $billingAddress, orderStatus: $orderStatus, paymentStatus: $paymentStatus, paymentMethod: $paymentMethod, deliveryInstructions: $deliveryInstructions, contactlessDelivery: $contactlessDelivery, deliverySlotStart: $deliverySlotStart, deliverySlotEnd: $deliverySlotEnd, estimatedDeliveryTime: $estimatedDeliveryTime, couponCode: $couponCode, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$OrderImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.cartId, cartId) || other.cartId == cartId) &&
            const DeepCollectionEquality().equals(other._items, _items) &&
            (identical(other.discountAmount, discountAmount) ||
                other.discountAmount == discountAmount) &&
            (identical(other.totalAmount, totalAmount) ||
                other.totalAmount == totalAmount) &&
            (identical(other.itemCount, itemCount) ||
                other.itemCount == itemCount) &&
            (identical(other.platformFee, platformFee) ||
                other.platformFee == platformFee) &&
            (identical(other.deliveryCharges, deliveryCharges) ||
                other.deliveryCharges == deliveryCharges) &&
            (identical(other.packagingFee, packagingFee) ||
                other.packagingFee == packagingFee) &&
            (identical(other.gstAmount, gstAmount) ||
                other.gstAmount == gstAmount) &&
            (identical(other.tipAmount, tipAmount) ||
                other.tipAmount == tipAmount) &&
            (identical(other.walletAmount, walletAmount) ||
                other.walletAmount == walletAmount) &&
            (identical(other.netAmount, netAmount) ||
                other.netAmount == netAmount) &&
            (identical(other.deliveryAddress, deliveryAddress) ||
                other.deliveryAddress == deliveryAddress) &&
            (identical(other.billingAddress, billingAddress) ||
                other.billingAddress == billingAddress) &&
            (identical(other.orderStatus, orderStatus) ||
                other.orderStatus == orderStatus) &&
            (identical(other.paymentStatus, paymentStatus) ||
                other.paymentStatus == paymentStatus) &&
            (identical(other.paymentMethod, paymentMethod) ||
                other.paymentMethod == paymentMethod) &&
            (identical(other.deliveryInstructions, deliveryInstructions) ||
                other.deliveryInstructions == deliveryInstructions) &&
            (identical(other.contactlessDelivery, contactlessDelivery) ||
                other.contactlessDelivery == contactlessDelivery) &&
            (identical(other.deliverySlotStart, deliverySlotStart) ||
                other.deliverySlotStart == deliverySlotStart) &&
            (identical(other.deliverySlotEnd, deliverySlotEnd) ||
                other.deliverySlotEnd == deliverySlotEnd) &&
            (identical(other.estimatedDeliveryTime, estimatedDeliveryTime) ||
                other.estimatedDeliveryTime == estimatedDeliveryTime) &&
            (identical(other.couponCode, couponCode) ||
                other.couponCode == couponCode) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hashAll([
        runtimeType,
        id,
        userId,
        cartId,
        const DeepCollectionEquality().hash(_items),
        discountAmount,
        totalAmount,
        itemCount,
        platformFee,
        deliveryCharges,
        packagingFee,
        gstAmount,
        tipAmount,
        walletAmount,
        netAmount,
        deliveryAddress,
        billingAddress,
        orderStatus,
        paymentStatus,
        paymentMethod,
        deliveryInstructions,
        contactlessDelivery,
        deliverySlotStart,
        deliverySlotEnd,
        estimatedDeliveryTime,
        couponCode,
        createdAt,
        updatedAt
      ]);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$OrderImplCopyWith<_$OrderImpl> get copyWith =>
      __$$OrderImplCopyWithImpl<_$OrderImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$OrderImplToJson(
      this,
    );
  }
}

abstract class _Order implements Order {
  const factory _Order(
      {required final String id,
      required final String? userId,
      required final String cartId,
      required final List<OrderItem> items,
      required final double discountAmount,
      required final double totalAmount,
      required final int itemCount,
      required final double platformFee,
      required final double deliveryCharges,
      required final double packagingFee,
      required final double gstAmount,
      required final double tipAmount,
      required final double walletAmount,
      required final double netAmount,
      required final Address deliveryAddress,
      required final Address? billingAddress,
      required final String orderStatus,
      required final String paymentStatus,
      required final String? paymentMethod,
      required final String? deliveryInstructions,
      required final bool contactlessDelivery,
      required final DateTime? deliverySlotStart,
      required final DateTime? deliverySlotEnd,
      required final DateTime estimatedDeliveryTime,
      required final String? couponCode,
      required final DateTime createdAt,
      required final DateTime updatedAt}) = _$OrderImpl;

  factory _Order.fromJson(Map<String, dynamic> json) = _$OrderImpl.fromJson;

  @override
  String get id;
  @override
  String? get userId;
  @override
  String get cartId;
  @override
  List<OrderItem> get items;
  @override
  double get discountAmount;
  @override
  double get totalAmount;
  @override
  int get itemCount;
  @override
  double get platformFee;
  @override
  double get deliveryCharges;
  @override
  double get packagingFee;
  @override
  double get gstAmount;
  @override
  double get tipAmount;
  @override
  double get walletAmount;
  @override
  double get netAmount;
  @override
  Address get deliveryAddress;
  @override
  Address? get billingAddress;
  @override
  String get orderStatus;
  @override
  String get paymentStatus;
  @override
  String? get paymentMethod;
  @override
  String? get deliveryInstructions;
  @override
  bool get contactlessDelivery;
  @override
  DateTime? get deliverySlotStart;
  @override
  DateTime? get deliverySlotEnd;
  @override
  DateTime get estimatedDeliveryTime;
  @override
  String? get couponCode;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;
  @override
  @JsonKey(ignore: true)
  _$$OrderImplCopyWith<_$OrderImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
