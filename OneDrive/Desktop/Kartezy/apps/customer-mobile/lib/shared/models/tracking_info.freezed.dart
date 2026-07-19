// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'tracking_info.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

TrackingInfo _$TrackingInfoFromJson(Map<String, dynamic> json) {
  return _TrackingInfo.fromJson(json);
}

/// @nodoc
mixin _$TrackingInfo {
  String get orderId => throw _privateConstructorUsedError;
  DriverInfo get driver => throw _privateConstructorUsedError;
  RouteInfo get route => throw _privateConstructorUsedError;
  String get currentStatus => throw _privateConstructorUsedError;
  DateTime get lastUpdated => throw _privateConstructorUsedError;
  double get distanceRemaining =>
      throw _privateConstructorUsedError; // in kilometers
  Duration get eta =>
      throw _privateConstructorUsedError; // estimated time of arrival
  @LatLngJsonConverter()
  LatLng get currentLocation => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $TrackingInfoCopyWith<TrackingInfo> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TrackingInfoCopyWith<$Res> {
  factory $TrackingInfoCopyWith(
          TrackingInfo value, $Res Function(TrackingInfo) then) =
      _$TrackingInfoCopyWithImpl<$Res, TrackingInfo>;
  @useResult
  $Res call(
      {String orderId,
      DriverInfo driver,
      RouteInfo route,
      String currentStatus,
      DateTime lastUpdated,
      double distanceRemaining,
      Duration eta,
      @LatLngJsonConverter() LatLng currentLocation});

  $DriverInfoCopyWith<$Res> get driver;
}

/// @nodoc
class _$TrackingInfoCopyWithImpl<$Res, $Val extends TrackingInfo>
    implements $TrackingInfoCopyWith<$Res> {
  _$TrackingInfoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? orderId = null,
    Object? driver = null,
    Object? route = null,
    Object? currentStatus = null,
    Object? lastUpdated = null,
    Object? distanceRemaining = null,
    Object? eta = null,
    Object? currentLocation = null,
  }) {
    return _then(_value.copyWith(
      orderId: null == orderId
          ? _value.orderId
          : orderId // ignore: cast_nullable_to_non_nullable
              as String,
      driver: null == driver
          ? _value.driver
          : driver // ignore: cast_nullable_to_non_nullable
              as DriverInfo,
      route: null == route
          ? _value.route
          : route // ignore: cast_nullable_to_non_nullable
              as RouteInfo,
      currentStatus: null == currentStatus
          ? _value.currentStatus
          : currentStatus // ignore: cast_nullable_to_non_nullable
              as String,
      lastUpdated: null == lastUpdated
          ? _value.lastUpdated
          : lastUpdated // ignore: cast_nullable_to_non_nullable
              as DateTime,
      distanceRemaining: null == distanceRemaining
          ? _value.distanceRemaining
          : distanceRemaining // ignore: cast_nullable_to_non_nullable
              as double,
      eta: null == eta
          ? _value.eta
          : eta // ignore: cast_nullable_to_non_nullable
              as Duration,
      currentLocation: null == currentLocation
          ? _value.currentLocation
          : currentLocation // ignore: cast_nullable_to_non_nullable
              as LatLng,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $DriverInfoCopyWith<$Res> get driver {
    return $DriverInfoCopyWith<$Res>(_value.driver, (value) {
      return _then(_value.copyWith(driver: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$TrackingInfoImplCopyWith<$Res>
    implements $TrackingInfoCopyWith<$Res> {
  factory _$$TrackingInfoImplCopyWith(
          _$TrackingInfoImpl value, $Res Function(_$TrackingInfoImpl) then) =
      __$$TrackingInfoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String orderId,
      DriverInfo driver,
      RouteInfo route,
      String currentStatus,
      DateTime lastUpdated,
      double distanceRemaining,
      Duration eta,
      @LatLngJsonConverter() LatLng currentLocation});

  @override
  $DriverInfoCopyWith<$Res> get driver;
}

/// @nodoc
class __$$TrackingInfoImplCopyWithImpl<$Res>
    extends _$TrackingInfoCopyWithImpl<$Res, _$TrackingInfoImpl>
    implements _$$TrackingInfoImplCopyWith<$Res> {
  __$$TrackingInfoImplCopyWithImpl(
      _$TrackingInfoImpl _value, $Res Function(_$TrackingInfoImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? orderId = null,
    Object? driver = null,
    Object? route = null,
    Object? currentStatus = null,
    Object? lastUpdated = null,
    Object? distanceRemaining = null,
    Object? eta = null,
    Object? currentLocation = null,
  }) {
    return _then(_$TrackingInfoImpl(
      orderId: null == orderId
          ? _value.orderId
          : orderId // ignore: cast_nullable_to_non_nullable
              as String,
      driver: null == driver
          ? _value.driver
          : driver // ignore: cast_nullable_to_non_nullable
              as DriverInfo,
      route: null == route
          ? _value.route
          : route // ignore: cast_nullable_to_non_nullable
              as RouteInfo,
      currentStatus: null == currentStatus
          ? _value.currentStatus
          : currentStatus // ignore: cast_nullable_to_non_nullable
              as String,
      lastUpdated: null == lastUpdated
          ? _value.lastUpdated
          : lastUpdated // ignore: cast_nullable_to_non_nullable
              as DateTime,
      distanceRemaining: null == distanceRemaining
          ? _value.distanceRemaining
          : distanceRemaining // ignore: cast_nullable_to_non_nullable
              as double,
      eta: null == eta
          ? _value.eta
          : eta // ignore: cast_nullable_to_non_nullable
              as Duration,
      currentLocation: null == currentLocation
          ? _value.currentLocation
          : currentLocation // ignore: cast_nullable_to_non_nullable
              as LatLng,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$TrackingInfoImpl implements _TrackingInfo {
  const _$TrackingInfoImpl(
      {required this.orderId,
      required this.driver,
      required this.route,
      required this.currentStatus,
      required this.lastUpdated,
      required this.distanceRemaining,
      required this.eta,
      @LatLngJsonConverter() required this.currentLocation});

  factory _$TrackingInfoImpl.fromJson(Map<String, dynamic> json) =>
      _$$TrackingInfoImplFromJson(json);

  @override
  final String orderId;
  @override
  final DriverInfo driver;
  @override
  final RouteInfo route;
  @override
  final String currentStatus;
  @override
  final DateTime lastUpdated;
  @override
  final double distanceRemaining;
// in kilometers
  @override
  final Duration eta;
// estimated time of arrival
  @override
  @LatLngJsonConverter()
  final LatLng currentLocation;

  @override
  String toString() {
    return 'TrackingInfo(orderId: $orderId, driver: $driver, route: $route, currentStatus: $currentStatus, lastUpdated: $lastUpdated, distanceRemaining: $distanceRemaining, eta: $eta, currentLocation: $currentLocation)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TrackingInfoImpl &&
            (identical(other.orderId, orderId) || other.orderId == orderId) &&
            (identical(other.driver, driver) || other.driver == driver) &&
            (identical(other.route, route) || other.route == route) &&
            (identical(other.currentStatus, currentStatus) ||
                other.currentStatus == currentStatus) &&
            (identical(other.lastUpdated, lastUpdated) ||
                other.lastUpdated == lastUpdated) &&
            (identical(other.distanceRemaining, distanceRemaining) ||
                other.distanceRemaining == distanceRemaining) &&
            (identical(other.eta, eta) || other.eta == eta) &&
            (identical(other.currentLocation, currentLocation) ||
                other.currentLocation == currentLocation));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, orderId, driver, route,
      currentStatus, lastUpdated, distanceRemaining, eta, currentLocation);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$TrackingInfoImplCopyWith<_$TrackingInfoImpl> get copyWith =>
      __$$TrackingInfoImplCopyWithImpl<_$TrackingInfoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TrackingInfoImplToJson(
      this,
    );
  }
}

abstract class _TrackingInfo implements TrackingInfo {
  const factory _TrackingInfo(
          {required final String orderId,
          required final DriverInfo driver,
          required final RouteInfo route,
          required final String currentStatus,
          required final DateTime lastUpdated,
          required final double distanceRemaining,
          required final Duration eta,
          @LatLngJsonConverter() required final LatLng currentLocation}) =
      _$TrackingInfoImpl;

  factory _TrackingInfo.fromJson(Map<String, dynamic> json) =
      _$TrackingInfoImpl.fromJson;

  @override
  String get orderId;
  @override
  DriverInfo get driver;
  @override
  RouteInfo get route;
  @override
  String get currentStatus;
  @override
  DateTime get lastUpdated;
  @override
  double get distanceRemaining;
  @override // in kilometers
  Duration get eta;
  @override // estimated time of arrival
  @LatLngJsonConverter()
  LatLng get currentLocation;
  @override
  @JsonKey(ignore: true)
  _$$TrackingInfoImplCopyWith<_$TrackingInfoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
