// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'sos_alert.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

SosAlert _$SosAlertFromJson(Map<String, dynamic> json) {
  return _SosAlert.fromJson(json);
}

/// @nodoc
mixin _$SosAlert {
  String get id => throw _privateConstructorUsedError;
  String get partnerId => throw _privateConstructorUsedError;
  SosType get type => throw _privateConstructorUsedError;
  SosStatus get status => throw _privateConstructorUsedError;
  double get latitude => throw _privateConstructorUsedError;
  double get longitude => throw _privateConstructorUsedError;
  String? get message => throw _privateConstructorUsedError;
  String? get responderId => throw _privateConstructorUsedError;
  DateTime? get acknowledgedAt => throw _privateConstructorUsedError;
  DateTime? get resolvedAt => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $SosAlertCopyWith<SosAlert> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SosAlertCopyWith<$Res> {
  factory $SosAlertCopyWith(SosAlert value, $Res Function(SosAlert) then) =
      _$SosAlertCopyWithImpl<$Res, SosAlert>;
  @useResult
  $Res call(
      {String id,
      String partnerId,
      SosType type,
      SosStatus status,
      double latitude,
      double longitude,
      String? message,
      String? responderId,
      DateTime? acknowledgedAt,
      DateTime? resolvedAt,
      DateTime createdAt});
}

/// @nodoc
class _$SosAlertCopyWithImpl<$Res, $Val extends SosAlert>
    implements $SosAlertCopyWith<$Res> {
  _$SosAlertCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partnerId = null,
    Object? type = null,
    Object? status = null,
    Object? latitude = null,
    Object? longitude = null,
    Object? message = freezed,
    Object? responderId = freezed,
    Object? acknowledgedAt = freezed,
    Object? resolvedAt = freezed,
    Object? createdAt = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      partnerId: null == partnerId
          ? _value.partnerId
          : partnerId // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as SosType,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as SosStatus,
      latitude: null == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double,
      longitude: null == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double,
      message: freezed == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String?,
      responderId: freezed == responderId
          ? _value.responderId
          : responderId // ignore: cast_nullable_to_non_nullable
              as String?,
      acknowledgedAt: freezed == acknowledgedAt
          ? _value.acknowledgedAt
          : acknowledgedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      resolvedAt: freezed == resolvedAt
          ? _value.resolvedAt
          : resolvedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$SosAlertImplCopyWith<$Res>
    implements $SosAlertCopyWith<$Res> {
  factory _$$SosAlertImplCopyWith(
          _$SosAlertImpl value, $Res Function(_$SosAlertImpl) then) =
      __$$SosAlertImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String partnerId,
      SosType type,
      SosStatus status,
      double latitude,
      double longitude,
      String? message,
      String? responderId,
      DateTime? acknowledgedAt,
      DateTime? resolvedAt,
      DateTime createdAt});
}

/// @nodoc
class __$$SosAlertImplCopyWithImpl<$Res>
    extends _$SosAlertCopyWithImpl<$Res, _$SosAlertImpl>
    implements _$$SosAlertImplCopyWith<$Res> {
  __$$SosAlertImplCopyWithImpl(
      _$SosAlertImpl _value, $Res Function(_$SosAlertImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partnerId = null,
    Object? type = null,
    Object? status = null,
    Object? latitude = null,
    Object? longitude = null,
    Object? message = freezed,
    Object? responderId = freezed,
    Object? acknowledgedAt = freezed,
    Object? resolvedAt = freezed,
    Object? createdAt = null,
  }) {
    return _then(_$SosAlertImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      partnerId: null == partnerId
          ? _value.partnerId
          : partnerId // ignore: cast_nullable_to_non_nullable
              as String,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as SosType,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as SosStatus,
      latitude: null == latitude
          ? _value.latitude
          : latitude // ignore: cast_nullable_to_non_nullable
              as double,
      longitude: null == longitude
          ? _value.longitude
          : longitude // ignore: cast_nullable_to_non_nullable
              as double,
      message: freezed == message
          ? _value.message
          : message // ignore: cast_nullable_to_non_nullable
              as String?,
      responderId: freezed == responderId
          ? _value.responderId
          : responderId // ignore: cast_nullable_to_non_nullable
              as String?,
      acknowledgedAt: freezed == acknowledgedAt
          ? _value.acknowledgedAt
          : acknowledgedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      resolvedAt: freezed == resolvedAt
          ? _value.resolvedAt
          : resolvedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$SosAlertImpl implements _SosAlert {
  const _$SosAlertImpl(
      {required this.id,
      required this.partnerId,
      required this.type,
      required this.status,
      required this.latitude,
      required this.longitude,
      this.message,
      this.responderId,
      this.acknowledgedAt,
      this.resolvedAt,
      required this.createdAt});

  factory _$SosAlertImpl.fromJson(Map<String, dynamic> json) =>
      _$$SosAlertImplFromJson(json);

  @override
  final String id;
  @override
  final String partnerId;
  @override
  final SosType type;
  @override
  final SosStatus status;
  @override
  final double latitude;
  @override
  final double longitude;
  @override
  final String? message;
  @override
  final String? responderId;
  @override
  final DateTime? acknowledgedAt;
  @override
  final DateTime? resolvedAt;
  @override
  final DateTime createdAt;

  @override
  String toString() {
    return 'SosAlert(id: $id, partnerId: $partnerId, type: $type, status: $status, latitude: $latitude, longitude: $longitude, message: $message, responderId: $responderId, acknowledgedAt: $acknowledgedAt, resolvedAt: $resolvedAt, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SosAlertImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.partnerId, partnerId) ||
                other.partnerId == partnerId) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.responderId, responderId) ||
                other.responderId == responderId) &&
            (identical(other.acknowledgedAt, acknowledgedAt) ||
                other.acknowledgedAt == acknowledgedAt) &&
            (identical(other.resolvedAt, resolvedAt) ||
                other.resolvedAt == resolvedAt) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      partnerId,
      type,
      status,
      latitude,
      longitude,
      message,
      responderId,
      acknowledgedAt,
      resolvedAt,
      createdAt);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$SosAlertImplCopyWith<_$SosAlertImpl> get copyWith =>
      __$$SosAlertImplCopyWithImpl<_$SosAlertImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$SosAlertImplToJson(
      this,
    );
  }
}

abstract class _SosAlert implements SosAlert {
  const factory _SosAlert(
      {required final String id,
      required final String partnerId,
      required final SosType type,
      required final SosStatus status,
      required final double latitude,
      required final double longitude,
      final String? message,
      final String? responderId,
      final DateTime? acknowledgedAt,
      final DateTime? resolvedAt,
      required final DateTime createdAt}) = _$SosAlertImpl;

  factory _SosAlert.fromJson(Map<String, dynamic> json) =
      _$SosAlertImpl.fromJson;

  @override
  String get id;
  @override
  String get partnerId;
  @override
  SosType get type;
  @override
  SosStatus get status;
  @override
  double get latitude;
  @override
  double get longitude;
  @override
  String? get message;
  @override
  String? get responderId;
  @override
  DateTime? get acknowledgedAt;
  @override
  DateTime? get resolvedAt;
  @override
  DateTime get createdAt;
  @override
  @JsonKey(ignore: true)
  _$$SosAlertImplCopyWith<_$SosAlertImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
