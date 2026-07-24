// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'delivery_order.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

DeliveryOrder _$DeliveryOrderFromJson(Map<String, dynamic> json) {
  return _DeliveryOrder.fromJson(json);
}

/// @nodoc
mixin _$DeliveryOrder {
  String get id => throw _privateConstructorUsedError;
  String get orderNumber => throw _privateConstructorUsedError;
  String get customerName => throw _privateConstructorUsedError;
  String get customerPhone => throw _privateConstructorUsedError;
  String get storeName => throw _privateConstructorUsedError;
  String get storePhone => throw _privateConstructorUsedError;
  double get storeLatitude => throw _privateConstructorUsedError;
  double get storeLongitude => throw _privateConstructorUsedError;
  Address get deliveryAddress => throw _privateConstructorUsedError;
  List<OrderItem> get items => throw _privateConstructorUsedError;
  int get itemCount => throw _privateConstructorUsedError;
  double get orderAmount => throw _privateConstructorUsedError;
  double get deliveryFee => throw _privateConstructorUsedError;
  double get tipAmount => throw _privateConstructorUsedError;
  double get totalEarning => throw _privateConstructorUsedError;
  String get orderStatus => throw _privateConstructorUsedError;
  DeliveryPhase get phase => throw _privateConstructorUsedError;
  DateTime get assignedAt => throw _privateConstructorUsedError;
  DateTime get estimatedPickupTime => throw _privateConstructorUsedError;
  DateTime get estimatedDeliveryTime => throw _privateConstructorUsedError;
  String? get pickupOtp => throw _privateConstructorUsedError;
  String? get deliveryOtp => throw _privateConstructorUsedError;
  String? get deliveryInstructions => throw _privateConstructorUsedError;
  String? get merchantNotes => throw _privateConstructorUsedError;
  double? get distanceToStore => throw _privateConstructorUsedError;
  double? get distanceToCustomer => throw _privateConstructorUsedError;
  Duration? get etaToStore => throw _privateConstructorUsedError;
  Duration? get etaToCustomer => throw _privateConstructorUsedError;
  bool? get isExpress => throw _privateConstructorUsedError;
  bool? get isStacked => throw _privateConstructorUsedError;
  String? get stackedWithOrderId => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $DeliveryOrderCopyWith<DeliveryOrder> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DeliveryOrderCopyWith<$Res> {
  factory $DeliveryOrderCopyWith(
          DeliveryOrder value, $Res Function(DeliveryOrder) then) =
      _$DeliveryOrderCopyWithImpl<$Res, DeliveryOrder>;
  @useResult
  $Res call(
      {String id,
      String orderNumber,
      String customerName,
      String customerPhone,
      String storeName,
      String storePhone,
      double storeLatitude,
      double storeLongitude,
      Address deliveryAddress,
      List<OrderItem> items,
      int itemCount,
      double orderAmount,
      double deliveryFee,
      double tipAmount,
      double totalEarning,
      String orderStatus,
      DeliveryPhase phase,
      DateTime assignedAt,
      DateTime estimatedPickupTime,
      DateTime estimatedDeliveryTime,
      String? pickupOtp,
      String? deliveryOtp,
      String? deliveryInstructions,
      String? merchantNotes,
      double? distanceToStore,
      double? distanceToCustomer,
      Duration? etaToStore,
      Duration? etaToCustomer,
      bool? isExpress,
      bool? isStacked,
      String? stackedWithOrderId,
      DateTime createdAt,
      DateTime updatedAt});

  $AddressCopyWith<$Res> get deliveryAddress;
}

/// @nodoc
class _$DeliveryOrderCopyWithImpl<$Res, $Val extends DeliveryOrder>
    implements $DeliveryOrderCopyWith<$Res> {
  _$DeliveryOrderCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? orderNumber = null,
    Object? customerName = null,
    Object? customerPhone = null,
    Object? storeName = null,
    Object? storePhone = null,
    Object? storeLatitude = null,
    Object? storeLongitude = null,
    Object? deliveryAddress = null,
    Object? items = null,
    Object? itemCount = null,
    Object? orderAmount = null,
    Object? deliveryFee = null,
    Object? tipAmount = null,
    Object? totalEarning = null,
    Object? orderStatus = null,
    Object? phase = null,
    Object? assignedAt = null,
    Object? estimatedPickupTime = null,
    Object? estimatedDeliveryTime = null,
    Object? pickupOtp = freezed,
    Object? deliveryOtp = freezed,
    Object? deliveryInstructions = freezed,
    Object? merchantNotes = freezed,
    Object? distanceToStore = freezed,
    Object? distanceToCustomer = freezed,
    Object? etaToStore = freezed,
    Object? etaToCustomer = freezed,
    Object? isExpress = freezed,
    Object? isStacked = freezed,
    Object? stackedWithOrderId = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      orderNumber: null == orderNumber
          ? _value.orderNumber
          : orderNumber // ignore: cast_nullable_to_non_nullable
              as String,
      customerName: null == customerName
          ? _value.customerName
          : customerName // ignore: cast_nullable_to_non_nullable
              as String,
      customerPhone: null == customerPhone
          ? _value.customerPhone
          : customerPhone // ignore: cast_nullable_to_non_nullable
              as String,
      storeName: null == storeName
          ? _value.storeName
          : storeName // ignore: cast_nullable_to_non_nullable
              as String,
      storePhone: null == storePhone
          ? _value.storePhone
          : storePhone // ignore: cast_nullable_to_non_nullable
              as String,
      storeLatitude: null == storeLatitude
          ? _value.storeLatitude
          : storeLatitude // ignore: cast_nullable_to_non_nullable
              as double,
      storeLongitude: null == storeLongitude
          ? _value.storeLongitude
          : storeLongitude // ignore: cast_nullable_to_non_nullable
              as double,
      deliveryAddress: null == deliveryAddress
          ? _value.deliveryAddress
          : deliveryAddress // ignore: cast_nullable_to_non_nullable
              as Address,
      items: null == items
          ? _value.items
          : items // ignore: cast_nullable_to_non_nullable
              as List<OrderItem>,
      itemCount: null == itemCount
          ? _value.itemCount
          : itemCount // ignore: cast_nullable_to_non_nullable
              as int,
      orderAmount: null == orderAmount
          ? _value.orderAmount
          : orderAmount // ignore: cast_nullable_to_non_nullable
              as double,
      deliveryFee: null == deliveryFee
          ? _value.deliveryFee
          : deliveryFee // ignore: cast_nullable_to_non_nullable
              as double,
      tipAmount: null == tipAmount
          ? _value.tipAmount
          : tipAmount // ignore: cast_nullable_to_non_nullable
              as double,
      totalEarning: null == totalEarning
          ? _value.totalEarning
          : totalEarning // ignore: cast_nullable_to_non_nullable
              as double,
      orderStatus: null == orderStatus
          ? _value.orderStatus
          : orderStatus // ignore: cast_nullable_to_non_nullable
              as String,
      phase: null == phase
          ? _value.phase
          : phase // ignore: cast_nullable_to_non_nullable
              as DeliveryPhase,
      assignedAt: null == assignedAt
          ? _value.assignedAt
          : assignedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      estimatedPickupTime: null == estimatedPickupTime
          ? _value.estimatedPickupTime
          : estimatedPickupTime // ignore: cast_nullable_to_non_nullable
              as DateTime,
      estimatedDeliveryTime: null == estimatedDeliveryTime
          ? _value.estimatedDeliveryTime
          : estimatedDeliveryTime // ignore: cast_nullable_to_non_nullable
              as DateTime,
      pickupOtp: freezed == pickupOtp
          ? _value.pickupOtp
          : pickupOtp // ignore: cast_nullable_to_non_nullable
              as String?,
      deliveryOtp: freezed == deliveryOtp
          ? _value.deliveryOtp
          : deliveryOtp // ignore: cast_nullable_to_non_nullable
              as String?,
      deliveryInstructions: freezed == deliveryInstructions
          ? _value.deliveryInstructions
          : deliveryInstructions // ignore: cast_nullable_to_non_nullable
              as String?,
      merchantNotes: freezed == merchantNotes
          ? _value.merchantNotes
          : merchantNotes // ignore: cast_nullable_to_non_nullable
              as String?,
      distanceToStore: freezed == distanceToStore
          ? _value.distanceToStore
          : distanceToStore // ignore: cast_nullable_to_non_nullable
              as double?,
      distanceToCustomer: freezed == distanceToCustomer
          ? _value.distanceToCustomer
          : distanceToCustomer // ignore: cast_nullable_to_non_nullable
              as double?,
      etaToStore: freezed == etaToStore
          ? _value.etaToStore
          : etaToStore // ignore: cast_nullable_to_non_nullable
              as Duration?,
      etaToCustomer: freezed == etaToCustomer
          ? _value.etaToCustomer
          : etaToCustomer // ignore: cast_nullable_to_non_nullable
              as Duration?,
      isExpress: freezed == isExpress
          ? _value.isExpress
          : isExpress // ignore: cast_nullable_to_non_nullable
              as bool?,
      isStacked: freezed == isStacked
          ? _value.isStacked
          : isStacked // ignore: cast_nullable_to_non_nullable
              as bool?,
      stackedWithOrderId: freezed == stackedWithOrderId
          ? _value.stackedWithOrderId
          : stackedWithOrderId // ignore: cast_nullable_to_non_nullable
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
}

/// @nodoc
abstract class _$$DeliveryOrderImplCopyWith<$Res>
    implements $DeliveryOrderCopyWith<$Res> {
  factory _$$DeliveryOrderImplCopyWith(
          _$DeliveryOrderImpl value, $Res Function(_$DeliveryOrderImpl) then) =
      __$$DeliveryOrderImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String orderNumber,
      String customerName,
      String customerPhone,
      String storeName,
      String storePhone,
      double storeLatitude,
      double storeLongitude,
      Address deliveryAddress,
      List<OrderItem> items,
      int itemCount,
      double orderAmount,
      double deliveryFee,
      double tipAmount,
      double totalEarning,
      String orderStatus,
      DeliveryPhase phase,
      DateTime assignedAt,
      DateTime estimatedPickupTime,
      DateTime estimatedDeliveryTime,
      String? pickupOtp,
      String? deliveryOtp,
      String? deliveryInstructions,
      String? merchantNotes,
      double? distanceToStore,
      double? distanceToCustomer,
      Duration? etaToStore,
      Duration? etaToCustomer,
      bool? isExpress,
      bool? isStacked,
      String? stackedWithOrderId,
      DateTime createdAt,
      DateTime updatedAt});

  @override
  $AddressCopyWith<$Res> get deliveryAddress;
}

/// @nodoc
class __$$DeliveryOrderImplCopyWithImpl<$Res>
    extends _$DeliveryOrderCopyWithImpl<$Res, _$DeliveryOrderImpl>
    implements _$$DeliveryOrderImplCopyWith<$Res> {
  __$$DeliveryOrderImplCopyWithImpl(
      _$DeliveryOrderImpl _value, $Res Function(_$DeliveryOrderImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? orderNumber = null,
    Object? customerName = null,
    Object? customerPhone = null,
    Object? storeName = null,
    Object? storePhone = null,
    Object? storeLatitude = null,
    Object? storeLongitude = null,
    Object? deliveryAddress = null,
    Object? items = null,
    Object? itemCount = null,
    Object? orderAmount = null,
    Object? deliveryFee = null,
    Object? tipAmount = null,
    Object? totalEarning = null,
    Object? orderStatus = null,
    Object? phase = null,
    Object? assignedAt = null,
    Object? estimatedPickupTime = null,
    Object? estimatedDeliveryTime = null,
    Object? pickupOtp = freezed,
    Object? deliveryOtp = freezed,
    Object? deliveryInstructions = freezed,
    Object? merchantNotes = freezed,
    Object? distanceToStore = freezed,
    Object? distanceToCustomer = freezed,
    Object? etaToStore = freezed,
    Object? etaToCustomer = freezed,
    Object? isExpress = freezed,
    Object? isStacked = freezed,
    Object? stackedWithOrderId = freezed,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(_$DeliveryOrderImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      orderNumber: null == orderNumber
          ? _value.orderNumber
          : orderNumber // ignore: cast_nullable_to_non_nullable
              as String,
      customerName: null == customerName
          ? _value.customerName
          : customerName // ignore: cast_nullable_to_non_nullable
              as String,
      customerPhone: null == customerPhone
          ? _value.customerPhone
          : customerPhone // ignore: cast_nullable_to_non_nullable
              as String,
      storeName: null == storeName
          ? _value.storeName
          : storeName // ignore: cast_nullable_to_non_nullable
              as String,
      storePhone: null == storePhone
          ? _value.storePhone
          : storePhone // ignore: cast_nullable_to_non_nullable
              as String,
      storeLatitude: null == storeLatitude
          ? _value.storeLatitude
          : storeLatitude // ignore: cast_nullable_to_non_nullable
              as double,
      storeLongitude: null == storeLongitude
          ? _value.storeLongitude
          : storeLongitude // ignore: cast_nullable_to_non_nullable
              as double,
      deliveryAddress: null == deliveryAddress
          ? _value.deliveryAddress
          : deliveryAddress // ignore: cast_nullable_to_non_nullable
              as Address,
      items: null == items
          ? _value._items
          : items // ignore: cast_nullable_to_non_nullable
              as List<OrderItem>,
      itemCount: null == itemCount
          ? _value.itemCount
          : itemCount // ignore: cast_nullable_to_non_nullable
              as int,
      orderAmount: null == orderAmount
          ? _value.orderAmount
          : orderAmount // ignore: cast_nullable_to_non_nullable
              as double,
      deliveryFee: null == deliveryFee
          ? _value.deliveryFee
          : deliveryFee // ignore: cast_nullable_to_non_nullable
              as double,
      tipAmount: null == tipAmount
          ? _value.tipAmount
          : tipAmount // ignore: cast_nullable_to_non_nullable
              as double,
      totalEarning: null == totalEarning
          ? _value.totalEarning
          : totalEarning // ignore: cast_nullable_to_non_nullable
              as double,
      orderStatus: null == orderStatus
          ? _value.orderStatus
          : orderStatus // ignore: cast_nullable_to_non_nullable
              as String,
      phase: null == phase
          ? _value.phase
          : phase // ignore: cast_nullable_to_non_nullable
              as DeliveryPhase,
      assignedAt: null == assignedAt
          ? _value.assignedAt
          : assignedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      estimatedPickupTime: null == estimatedPickupTime
          ? _value.estimatedPickupTime
          : estimatedPickupTime // ignore: cast_nullable_to_non_nullable
              as DateTime,
      estimatedDeliveryTime: null == estimatedDeliveryTime
          ? _value.estimatedDeliveryTime
          : estimatedDeliveryTime // ignore: cast_nullable_to_non_nullable
              as DateTime,
      pickupOtp: freezed == pickupOtp
          ? _value.pickupOtp
          : pickupOtp // ignore: cast_nullable_to_non_nullable
              as String?,
      deliveryOtp: freezed == deliveryOtp
          ? _value.deliveryOtp
          : deliveryOtp // ignore: cast_nullable_to_non_nullable
              as String?,
      deliveryInstructions: freezed == deliveryInstructions
          ? _value.deliveryInstructions
          : deliveryInstructions // ignore: cast_nullable_to_non_nullable
              as String?,
      merchantNotes: freezed == merchantNotes
          ? _value.merchantNotes
          : merchantNotes // ignore: cast_nullable_to_non_nullable
              as String?,
      distanceToStore: freezed == distanceToStore
          ? _value.distanceToStore
          : distanceToStore // ignore: cast_nullable_to_non_nullable
              as double?,
      distanceToCustomer: freezed == distanceToCustomer
          ? _value.distanceToCustomer
          : distanceToCustomer // ignore: cast_nullable_to_non_nullable
              as double?,
      etaToStore: freezed == etaToStore
          ? _value.etaToStore
          : etaToStore // ignore: cast_nullable_to_non_nullable
              as Duration?,
      etaToCustomer: freezed == etaToCustomer
          ? _value.etaToCustomer
          : etaToCustomer // ignore: cast_nullable_to_non_nullable
              as Duration?,
      isExpress: freezed == isExpress
          ? _value.isExpress
          : isExpress // ignore: cast_nullable_to_non_nullable
              as bool?,
      isStacked: freezed == isStacked
          ? _value.isStacked
          : isStacked // ignore: cast_nullable_to_non_nullable
              as bool?,
      stackedWithOrderId: freezed == stackedWithOrderId
          ? _value.stackedWithOrderId
          : stackedWithOrderId // ignore: cast_nullable_to_non_nullable
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
class _$DeliveryOrderImpl implements _DeliveryOrder {
  const _$DeliveryOrderImpl(
      {required this.id,
      required this.orderNumber,
      required this.customerName,
      required this.customerPhone,
      required this.storeName,
      required this.storePhone,
      required this.storeLatitude,
      required this.storeLongitude,
      required this.deliveryAddress,
      required final List<OrderItem> items,
      required this.itemCount,
      required this.orderAmount,
      required this.deliveryFee,
      required this.tipAmount,
      required this.totalEarning,
      required this.orderStatus,
      required this.phase,
      required this.assignedAt,
      required this.estimatedPickupTime,
      required this.estimatedDeliveryTime,
      required this.pickupOtp,
      required this.deliveryOtp,
      this.deliveryInstructions,
      this.merchantNotes,
      this.distanceToStore,
      this.distanceToCustomer,
      this.etaToStore,
      this.etaToCustomer,
      this.isExpress,
      this.isStacked,
      this.stackedWithOrderId,
      required this.createdAt,
      required this.updatedAt})
      : _items = items;

  factory _$DeliveryOrderImpl.fromJson(Map<String, dynamic> json) =>
      _$$DeliveryOrderImplFromJson(json);

  @override
  final String id;
  @override
  final String orderNumber;
  @override
  final String customerName;
  @override
  final String customerPhone;
  @override
  final String storeName;
  @override
  final String storePhone;
  @override
  final double storeLatitude;
  @override
  final double storeLongitude;
  @override
  final Address deliveryAddress;
  final List<OrderItem> _items;
  @override
  List<OrderItem> get items {
    if (_items is EqualUnmodifiableListView) return _items;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_items);
  }

  @override
  final int itemCount;
  @override
  final double orderAmount;
  @override
  final double deliveryFee;
  @override
  final double tipAmount;
  @override
  final double totalEarning;
  @override
  final String orderStatus;
  @override
  final DeliveryPhase phase;
  @override
  final DateTime assignedAt;
  @override
  final DateTime estimatedPickupTime;
  @override
  final DateTime estimatedDeliveryTime;
  @override
  final String? pickupOtp;
  @override
  final String? deliveryOtp;
  @override
  final String? deliveryInstructions;
  @override
  final String? merchantNotes;
  @override
  final double? distanceToStore;
  @override
  final double? distanceToCustomer;
  @override
  final Duration? etaToStore;
  @override
  final Duration? etaToCustomer;
  @override
  final bool? isExpress;
  @override
  final bool? isStacked;
  @override
  final String? stackedWithOrderId;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'DeliveryOrder(id: $id, orderNumber: $orderNumber, customerName: $customerName, customerPhone: $customerPhone, storeName: $storeName, storePhone: $storePhone, storeLatitude: $storeLatitude, storeLongitude: $storeLongitude, deliveryAddress: $deliveryAddress, items: $items, itemCount: $itemCount, orderAmount: $orderAmount, deliveryFee: $deliveryFee, tipAmount: $tipAmount, totalEarning: $totalEarning, orderStatus: $orderStatus, phase: $phase, assignedAt: $assignedAt, estimatedPickupTime: $estimatedPickupTime, estimatedDeliveryTime: $estimatedDeliveryTime, pickupOtp: $pickupOtp, deliveryOtp: $deliveryOtp, deliveryInstructions: $deliveryInstructions, merchantNotes: $merchantNotes, distanceToStore: $distanceToStore, distanceToCustomer: $distanceToCustomer, etaToStore: $etaToStore, etaToCustomer: $etaToCustomer, isExpress: $isExpress, isStacked: $isStacked, stackedWithOrderId: $stackedWithOrderId, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DeliveryOrderImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.orderNumber, orderNumber) ||
                other.orderNumber == orderNumber) &&
            (identical(other.customerName, customerName) ||
                other.customerName == customerName) &&
            (identical(other.customerPhone, customerPhone) ||
                other.customerPhone == customerPhone) &&
            (identical(other.storeName, storeName) ||
                other.storeName == storeName) &&
            (identical(other.storePhone, storePhone) ||
                other.storePhone == storePhone) &&
            (identical(other.storeLatitude, storeLatitude) ||
                other.storeLatitude == storeLatitude) &&
            (identical(other.storeLongitude, storeLongitude) ||
                other.storeLongitude == storeLongitude) &&
            (identical(other.deliveryAddress, deliveryAddress) ||
                other.deliveryAddress == deliveryAddress) &&
            const DeepCollectionEquality().equals(other._items, _items) &&
            (identical(other.itemCount, itemCount) ||
                other.itemCount == itemCount) &&
            (identical(other.orderAmount, orderAmount) ||
                other.orderAmount == orderAmount) &&
            (identical(other.deliveryFee, deliveryFee) ||
                other.deliveryFee == deliveryFee) &&
            (identical(other.tipAmount, tipAmount) ||
                other.tipAmount == tipAmount) &&
            (identical(other.totalEarning, totalEarning) ||
                other.totalEarning == totalEarning) &&
            (identical(other.orderStatus, orderStatus) ||
                other.orderStatus == orderStatus) &&
            (identical(other.phase, phase) || other.phase == phase) &&
            (identical(other.assignedAt, assignedAt) ||
                other.assignedAt == assignedAt) &&
            (identical(other.estimatedPickupTime, estimatedPickupTime) ||
                other.estimatedPickupTime == estimatedPickupTime) &&
            (identical(other.estimatedDeliveryTime, estimatedDeliveryTime) ||
                other.estimatedDeliveryTime == estimatedDeliveryTime) &&
            (identical(other.pickupOtp, pickupOtp) ||
                other.pickupOtp == pickupOtp) &&
            (identical(other.deliveryOtp, deliveryOtp) ||
                other.deliveryOtp == deliveryOtp) &&
            (identical(other.deliveryInstructions, deliveryInstructions) ||
                other.deliveryInstructions == deliveryInstructions) &&
            (identical(other.merchantNotes, merchantNotes) ||
                other.merchantNotes == merchantNotes) &&
            (identical(other.distanceToStore, distanceToStore) ||
                other.distanceToStore == distanceToStore) &&
            (identical(other.distanceToCustomer, distanceToCustomer) ||
                other.distanceToCustomer == distanceToCustomer) &&
            (identical(other.etaToStore, etaToStore) ||
                other.etaToStore == etaToStore) &&
            (identical(other.etaToCustomer, etaToCustomer) ||
                other.etaToCustomer == etaToCustomer) &&
            (identical(other.isExpress, isExpress) ||
                other.isExpress == isExpress) &&
            (identical(other.isStacked, isStacked) ||
                other.isStacked == isStacked) &&
            (identical(other.stackedWithOrderId, stackedWithOrderId) ||
                other.stackedWithOrderId == stackedWithOrderId) &&
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
        orderNumber,
        customerName,
        customerPhone,
        storeName,
        storePhone,
        storeLatitude,
        storeLongitude,
        deliveryAddress,
        const DeepCollectionEquality().hash(_items),
        itemCount,
        orderAmount,
        deliveryFee,
        tipAmount,
        totalEarning,
        orderStatus,
        phase,
        assignedAt,
        estimatedPickupTime,
        estimatedDeliveryTime,
        pickupOtp,
        deliveryOtp,
        deliveryInstructions,
        merchantNotes,
        distanceToStore,
        distanceToCustomer,
        etaToStore,
        etaToCustomer,
        isExpress,
        isStacked,
        stackedWithOrderId,
        createdAt,
        updatedAt
      ]);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$DeliveryOrderImplCopyWith<_$DeliveryOrderImpl> get copyWith =>
      __$$DeliveryOrderImplCopyWithImpl<_$DeliveryOrderImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DeliveryOrderImplToJson(
      this,
    );
  }
}

abstract class _DeliveryOrder implements DeliveryOrder {
  const factory _DeliveryOrder(
      {required final String id,
      required final String orderNumber,
      required final String customerName,
      required final String customerPhone,
      required final String storeName,
      required final String storePhone,
      required final double storeLatitude,
      required final double storeLongitude,
      required final Address deliveryAddress,
      required final List<OrderItem> items,
      required final int itemCount,
      required final double orderAmount,
      required final double deliveryFee,
      required final double tipAmount,
      required final double totalEarning,
      required final String orderStatus,
      required final DeliveryPhase phase,
      required final DateTime assignedAt,
      required final DateTime estimatedPickupTime,
      required final DateTime estimatedDeliveryTime,
      required final String? pickupOtp,
      required final String? deliveryOtp,
      final String? deliveryInstructions,
      final String? merchantNotes,
      final double? distanceToStore,
      final double? distanceToCustomer,
      final Duration? etaToStore,
      final Duration? etaToCustomer,
      final bool? isExpress,
      final bool? isStacked,
      final String? stackedWithOrderId,
      required final DateTime createdAt,
      required final DateTime updatedAt}) = _$DeliveryOrderImpl;

  factory _DeliveryOrder.fromJson(Map<String, dynamic> json) =
      _$DeliveryOrderImpl.fromJson;

  @override
  String get id;
  @override
  String get orderNumber;
  @override
  String get customerName;
  @override
  String get customerPhone;
  @override
  String get storeName;
  @override
  String get storePhone;
  @override
  double get storeLatitude;
  @override
  double get storeLongitude;
  @override
  Address get deliveryAddress;
  @override
  List<OrderItem> get items;
  @override
  int get itemCount;
  @override
  double get orderAmount;
  @override
  double get deliveryFee;
  @override
  double get tipAmount;
  @override
  double get totalEarning;
  @override
  String get orderStatus;
  @override
  DeliveryPhase get phase;
  @override
  DateTime get assignedAt;
  @override
  DateTime get estimatedPickupTime;
  @override
  DateTime get estimatedDeliveryTime;
  @override
  String? get pickupOtp;
  @override
  String? get deliveryOtp;
  @override
  String? get deliveryInstructions;
  @override
  String? get merchantNotes;
  @override
  double? get distanceToStore;
  @override
  double? get distanceToCustomer;
  @override
  Duration? get etaToStore;
  @override
  Duration? get etaToCustomer;
  @override
  bool? get isExpress;
  @override
  bool? get isStacked;
  @override
  String? get stackedWithOrderId;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;
  @override
  @JsonKey(ignore: true)
  _$$DeliveryOrderImplCopyWith<_$DeliveryOrderImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
