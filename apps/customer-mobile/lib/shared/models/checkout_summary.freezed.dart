// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'checkout_summary.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

CheckoutSummary _$CheckoutSummaryFromJson(Map<String, dynamic> json) {
  return _CheckoutSummary.fromJson(json);
}

/// @nodoc
mixin _$CheckoutSummary {
  String get id => throw _privateConstructorUsedError;
  String? get userId =>
      throw _privateConstructorUsedError; // nullable for guest user
  List<CartItem> get items => throw _privateConstructorUsedError;
  String? get couponCode => throw _privateConstructorUsedError;
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

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $CheckoutSummaryCopyWith<CheckoutSummary> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CheckoutSummaryCopyWith<$Res> {
  factory $CheckoutSummaryCopyWith(
          CheckoutSummary value, $Res Function(CheckoutSummary) then) =
      _$CheckoutSummaryCopyWithImpl<$Res, CheckoutSummary>;
  @useResult
  $Res call(
      {String id,
      String? userId,
      List<CartItem> items,
      String? couponCode,
      double discountAmount,
      double totalAmount,
      int itemCount,
      double platformFee,
      double deliveryCharges,
      double packagingFee,
      double gstAmount,
      double tipAmount,
      double walletAmount,
      double netAmount});
}

/// @nodoc
class _$CheckoutSummaryCopyWithImpl<$Res, $Val extends CheckoutSummary>
    implements $CheckoutSummaryCopyWith<$Res> {
  _$CheckoutSummaryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = freezed,
    Object? items = null,
    Object? couponCode = freezed,
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
      items: null == items
          ? _value.items
          : items // ignore: cast_nullable_to_non_nullable
              as List<CartItem>,
      couponCode: freezed == couponCode
          ? _value.couponCode
          : couponCode // ignore: cast_nullable_to_non_nullable
              as String?,
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
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CheckoutSummaryImplCopyWith<$Res>
    implements $CheckoutSummaryCopyWith<$Res> {
  factory _$$CheckoutSummaryImplCopyWith(_$CheckoutSummaryImpl value,
          $Res Function(_$CheckoutSummaryImpl) then) =
      __$$CheckoutSummaryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String? userId,
      List<CartItem> items,
      String? couponCode,
      double discountAmount,
      double totalAmount,
      int itemCount,
      double platformFee,
      double deliveryCharges,
      double packagingFee,
      double gstAmount,
      double tipAmount,
      double walletAmount,
      double netAmount});
}

/// @nodoc
class __$$CheckoutSummaryImplCopyWithImpl<$Res>
    extends _$CheckoutSummaryCopyWithImpl<$Res, _$CheckoutSummaryImpl>
    implements _$$CheckoutSummaryImplCopyWith<$Res> {
  __$$CheckoutSummaryImplCopyWithImpl(
      _$CheckoutSummaryImpl _value, $Res Function(_$CheckoutSummaryImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = freezed,
    Object? items = null,
    Object? couponCode = freezed,
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
  }) {
    return _then(_$CheckoutSummaryImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      userId: freezed == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String?,
      items: null == items
          ? _value._items
          : items // ignore: cast_nullable_to_non_nullable
              as List<CartItem>,
      couponCode: freezed == couponCode
          ? _value.couponCode
          : couponCode // ignore: cast_nullable_to_non_nullable
              as String?,
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
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CheckoutSummaryImpl implements _CheckoutSummary {
  const _$CheckoutSummaryImpl(
      {required this.id,
      required this.userId,
      required final List<CartItem> items,
      required this.couponCode,
      required this.discountAmount,
      required this.totalAmount,
      required this.itemCount,
      required this.platformFee,
      required this.deliveryCharges,
      required this.packagingFee,
      required this.gstAmount,
      required this.tipAmount,
      required this.walletAmount,
      required this.netAmount})
      : _items = items;

  factory _$CheckoutSummaryImpl.fromJson(Map<String, dynamic> json) =>
      _$$CheckoutSummaryImplFromJson(json);

  @override
  final String id;
  @override
  final String? userId;
// nullable for guest user
  final List<CartItem> _items;
// nullable for guest user
  @override
  List<CartItem> get items {
    if (_items is EqualUnmodifiableListView) return _items;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_items);
  }

  @override
  final String? couponCode;
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
  String toString() {
    return 'CheckoutSummary(id: $id, userId: $userId, items: $items, couponCode: $couponCode, discountAmount: $discountAmount, totalAmount: $totalAmount, itemCount: $itemCount, platformFee: $platformFee, deliveryCharges: $deliveryCharges, packagingFee: $packagingFee, gstAmount: $gstAmount, tipAmount: $tipAmount, walletAmount: $walletAmount, netAmount: $netAmount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CheckoutSummaryImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            const DeepCollectionEquality().equals(other._items, _items) &&
            (identical(other.couponCode, couponCode) ||
                other.couponCode == couponCode) &&
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
                other.netAmount == netAmount));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      userId,
      const DeepCollectionEquality().hash(_items),
      couponCode,
      discountAmount,
      totalAmount,
      itemCount,
      platformFee,
      deliveryCharges,
      packagingFee,
      gstAmount,
      tipAmount,
      walletAmount,
      netAmount);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$CheckoutSummaryImplCopyWith<_$CheckoutSummaryImpl> get copyWith =>
      __$$CheckoutSummaryImplCopyWithImpl<_$CheckoutSummaryImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CheckoutSummaryImplToJson(
      this,
    );
  }
}

abstract class _CheckoutSummary implements CheckoutSummary {
  const factory _CheckoutSummary(
      {required final String id,
      required final String? userId,
      required final List<CartItem> items,
      required final String? couponCode,
      required final double discountAmount,
      required final double totalAmount,
      required final int itemCount,
      required final double platformFee,
      required final double deliveryCharges,
      required final double packagingFee,
      required final double gstAmount,
      required final double tipAmount,
      required final double walletAmount,
      required final double netAmount}) = _$CheckoutSummaryImpl;

  factory _CheckoutSummary.fromJson(Map<String, dynamic> json) =
      _$CheckoutSummaryImpl.fromJson;

  @override
  String get id;
  @override
  String? get userId;
  @override // nullable for guest user
  List<CartItem> get items;
  @override
  String? get couponCode;
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
  @JsonKey(ignore: true)
  _$$CheckoutSummaryImplCopyWith<_$CheckoutSummaryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
