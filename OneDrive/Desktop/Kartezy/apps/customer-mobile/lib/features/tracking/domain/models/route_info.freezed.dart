// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'route_info.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

RouteInfo _$RouteInfoFromJson(Map<String, dynamic> json) {
  return _RouteInfo.fromJson(json);
}

/// @nodoc
mixin _$RouteInfo {
  String get id => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _latLngListFromJson, toJson: _latLngListToJson)
  List<LatLng> get polylineCoordinates => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
  LatLng get startPoint => throw _privateConstructorUsedError;
  @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
  LatLng get endPoint => throw _privateConstructorUsedError;
  double get totalDistance => throw _privateConstructorUsedError;
  Duration get estimatedDuration => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $RouteInfoCopyWith<RouteInfo> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RouteInfoCopyWith<$Res> {
  factory $RouteInfoCopyWith(RouteInfo value, $Res Function(RouteInfo) then) =
      _$RouteInfoCopyWithImpl<$Res, RouteInfo>;
  @useResult
  $Res call(
      {String id,
      @JsonKey(fromJson: _latLngListFromJson, toJson: _latLngListToJson)
      List<LatLng> polylineCoordinates,
      @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
      LatLng startPoint,
      @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
      LatLng endPoint,
      double totalDistance,
      Duration estimatedDuration});
}

/// @nodoc
class _$RouteInfoCopyWithImpl<$Res, $Val extends RouteInfo>
    implements $RouteInfoCopyWith<$Res> {
  _$RouteInfoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? polylineCoordinates = null,
    Object? startPoint = null,
    Object? endPoint = null,
    Object? totalDistance = null,
    Object? estimatedDuration = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      polylineCoordinates: null == polylineCoordinates
          ? _value.polylineCoordinates
          : polylineCoordinates // ignore: cast_nullable_to_non_nullable
              as List<LatLng>,
      startPoint: null == startPoint
          ? _value.startPoint
          : startPoint // ignore: cast_nullable_to_non_nullable
              as LatLng,
      endPoint: null == endPoint
          ? _value.endPoint
          : endPoint // ignore: cast_nullable_to_non_nullable
              as LatLng,
      totalDistance: null == totalDistance
          ? _value.totalDistance
          : totalDistance // ignore: cast_nullable_to_non_nullable
              as double,
      estimatedDuration: null == estimatedDuration
          ? _value.estimatedDuration
          : estimatedDuration // ignore: cast_nullable_to_non_nullable
              as Duration,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$RouteInfoImplCopyWith<$Res>
    implements $RouteInfoCopyWith<$Res> {
  factory _$$RouteInfoImplCopyWith(
          _$RouteInfoImpl value, $Res Function(_$RouteInfoImpl) then) =
      __$$RouteInfoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      @JsonKey(fromJson: _latLngListFromJson, toJson: _latLngListToJson)
      List<LatLng> polylineCoordinates,
      @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
      LatLng startPoint,
      @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
      LatLng endPoint,
      double totalDistance,
      Duration estimatedDuration});
}

/// @nodoc
class __$$RouteInfoImplCopyWithImpl<$Res>
    extends _$RouteInfoCopyWithImpl<$Res, _$RouteInfoImpl>
    implements _$$RouteInfoImplCopyWith<$Res> {
  __$$RouteInfoImplCopyWithImpl(
      _$RouteInfoImpl _value, $Res Function(_$RouteInfoImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? polylineCoordinates = null,
    Object? startPoint = null,
    Object? endPoint = null,
    Object? totalDistance = null,
    Object? estimatedDuration = null,
  }) {
    return _then(_$RouteInfoImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      polylineCoordinates: null == polylineCoordinates
          ? _value._polylineCoordinates
          : polylineCoordinates // ignore: cast_nullable_to_non_nullable
              as List<LatLng>,
      startPoint: null == startPoint
          ? _value.startPoint
          : startPoint // ignore: cast_nullable_to_non_nullable
              as LatLng,
      endPoint: null == endPoint
          ? _value.endPoint
          : endPoint // ignore: cast_nullable_to_non_nullable
              as LatLng,
      totalDistance: null == totalDistance
          ? _value.totalDistance
          : totalDistance // ignore: cast_nullable_to_non_nullable
              as double,
      estimatedDuration: null == estimatedDuration
          ? _value.estimatedDuration
          : estimatedDuration // ignore: cast_nullable_to_non_nullable
              as Duration,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$RouteInfoImpl implements _RouteInfo {
  const _$RouteInfoImpl(
      {required this.id,
      @JsonKey(fromJson: _latLngListFromJson, toJson: _latLngListToJson)
      required final List<LatLng> polylineCoordinates,
      @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
      required this.startPoint,
      @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
      required this.endPoint,
      required this.totalDistance,
      required this.estimatedDuration})
      : _polylineCoordinates = polylineCoordinates;

  factory _$RouteInfoImpl.fromJson(Map<String, dynamic> json) =>
      _$$RouteInfoImplFromJson(json);

  @override
  final String id;
  final List<LatLng> _polylineCoordinates;
  @override
  @JsonKey(fromJson: _latLngListFromJson, toJson: _latLngListToJson)
  List<LatLng> get polylineCoordinates {
    if (_polylineCoordinates is EqualUnmodifiableListView)
      return _polylineCoordinates;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_polylineCoordinates);
  }

  @override
  @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
  final LatLng startPoint;
  @override
  @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
  final LatLng endPoint;
  @override
  final double totalDistance;
  @override
  final Duration estimatedDuration;

  @override
  String toString() {
    return 'RouteInfo(id: $id, polylineCoordinates: $polylineCoordinates, startPoint: $startPoint, endPoint: $endPoint, totalDistance: $totalDistance, estimatedDuration: $estimatedDuration)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RouteInfoImpl &&
            (identical(other.id, id) || other.id == id) &&
            const DeepCollectionEquality()
                .equals(other._polylineCoordinates, _polylineCoordinates) &&
            (identical(other.startPoint, startPoint) ||
                other.startPoint == startPoint) &&
            (identical(other.endPoint, endPoint) ||
                other.endPoint == endPoint) &&
            (identical(other.totalDistance, totalDistance) ||
                other.totalDistance == totalDistance) &&
            (identical(other.estimatedDuration, estimatedDuration) ||
                other.estimatedDuration == estimatedDuration));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      const DeepCollectionEquality().hash(_polylineCoordinates),
      startPoint,
      endPoint,
      totalDistance,
      estimatedDuration);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$RouteInfoImplCopyWith<_$RouteInfoImpl> get copyWith =>
      __$$RouteInfoImplCopyWithImpl<_$RouteInfoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RouteInfoImplToJson(
      this,
    );
  }
}

abstract class _RouteInfo implements RouteInfo {
  const factory _RouteInfo(
      {required final String id,
      @JsonKey(fromJson: _latLngListFromJson, toJson: _latLngListToJson)
      required final List<LatLng> polylineCoordinates,
      @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
      required final LatLng startPoint,
      @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
      required final LatLng endPoint,
      required final double totalDistance,
      required final Duration estimatedDuration}) = _$RouteInfoImpl;

  factory _RouteInfo.fromJson(Map<String, dynamic> json) =
      _$RouteInfoImpl.fromJson;

  @override
  String get id;
  @override
  @JsonKey(fromJson: _latLngListFromJson, toJson: _latLngListToJson)
  List<LatLng> get polylineCoordinates;
  @override
  @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
  LatLng get startPoint;
  @override
  @JsonKey(fromJson: _latLngFromJson, toJson: _latLngToJson)
  LatLng get endPoint;
  @override
  double get totalDistance;
  @override
  Duration get estimatedDuration;
  @override
  @JsonKey(ignore: true)
  _$$RouteInfoImplCopyWith<_$RouteInfoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
