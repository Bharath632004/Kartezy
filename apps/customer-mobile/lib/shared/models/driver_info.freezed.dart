// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'driver_info.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

DriverInfo _$DriverInfoFromJson(Map<String, dynamic> json) {
  return _DriverInfo.fromJson(json);
}

/// @nodoc
mixin _$DriverInfo {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get photoUrl => throw _privateConstructorUsedError;
  String get vehicleNumber => throw _privateConstructorUsedError;
  String get vehicleType => throw _privateConstructorUsedError;
  double get rating => throw _privateConstructorUsedError;
  String get phoneNumber => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $DriverInfoCopyWith<DriverInfo> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DriverInfoCopyWith<$Res> {
  factory $DriverInfoCopyWith(
    DriverInfo value,
    $Res Function(DriverInfo) then,
  ) = _$DriverInfoCopyWithImpl<$Res, DriverInfo>;
  @useResult
  $Res call({
    String id,
    String name,
    String? photoUrl,
    String vehicleNumber,
    String vehicleType,
    double rating,
    String phoneNumber,
  });
}

/// @nodoc
class _$DriverInfoCopyWithImpl<$Res, $Val extends DriverInfo>
    implements $DriverInfoCopyWith<$Res> {
  _$DriverInfoCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? photoUrl = freezed,
    Object? vehicleNumber = null,
    Object? vehicleType = null,
    Object? rating = null,
    Object? phoneNumber = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            photoUrl: freezed == photoUrl
                ? _value.photoUrl
                : photoUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            vehicleNumber: null == vehicleNumber
                ? _value.vehicleNumber
                : vehicleNumber // ignore: cast_nullable_to_non_nullable
                      as String,
            vehicleType: null == vehicleType
                ? _value.vehicleType
                : vehicleType // ignore: cast_nullable_to_non_nullable
                      as String,
            rating: null == rating
                ? _value.rating
                : rating // ignore: cast_nullable_to_non_nullable
                      as double,
            phoneNumber: null == phoneNumber
                ? _value.phoneNumber
                : phoneNumber // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DriverInfoImplCopyWith<$Res>
    implements $DriverInfoCopyWith<$Res> {
  factory _$$DriverInfoImplCopyWith(
    _$DriverInfoImpl value,
    $Res Function(_$DriverInfoImpl) then,
  ) = __$$DriverInfoImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String? photoUrl,
    String vehicleNumber,
    String vehicleType,
    double rating,
    String phoneNumber,
  });
}

/// @nodoc
class __$$DriverInfoImplCopyWithImpl<$Res>
    extends _$DriverInfoCopyWithImpl<$Res, _$DriverInfoImpl>
    implements _$$DriverInfoImplCopyWith<$Res> {
  __$$DriverInfoImplCopyWithImpl(
    _$DriverInfoImpl _value,
    $Res Function(_$DriverInfoImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? photoUrl = freezed,
    Object? vehicleNumber = null,
    Object? vehicleType = null,
    Object? rating = null,
    Object? phoneNumber = null,
  }) {
    return _then(
      _$DriverInfoImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        photoUrl: freezed == photoUrl
            ? _value.photoUrl
            : photoUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        vehicleNumber: null == vehicleNumber
            ? _value.vehicleNumber
            : vehicleNumber // ignore: cast_nullable_to_non_nullable
                  as String,
        vehicleType: null == vehicleType
            ? _value.vehicleType
            : vehicleType // ignore: cast_nullable_to_non_nullable
                  as String,
        rating: null == rating
            ? _value.rating
            : rating // ignore: cast_nullable_to_non_nullable
                  as double,
        phoneNumber: null == phoneNumber
            ? _value.phoneNumber
            : phoneNumber // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$DriverInfoImpl implements _DriverInfo {
  const _$DriverInfoImpl({
    required this.id,
    required this.name,
    this.photoUrl,
    required this.vehicleNumber,
    required this.vehicleType,
    required this.rating,
    required this.phoneNumber,
  });

  factory _$DriverInfoImpl.fromJson(Map<String, dynamic> json) =>
      _$$DriverInfoImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String? photoUrl;
  @override
  final String vehicleNumber;
  @override
  final String vehicleType;
  @override
  final double rating;
  @override
  final String phoneNumber;

  @override
  String toString() {
    return 'DriverInfo(id: $id, name: $name, photoUrl: $photoUrl, vehicleNumber: $vehicleNumber, vehicleType: $vehicleType, rating: $rating, phoneNumber: $phoneNumber)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DriverInfoImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.photoUrl, photoUrl) ||
                other.photoUrl == photoUrl) &&
            (identical(other.vehicleNumber, vehicleNumber) ||
                other.vehicleNumber == vehicleNumber) &&
            (identical(other.vehicleType, vehicleType) ||
                other.vehicleType == vehicleType) &&
            (identical(other.rating, rating) || other.rating == rating) &&
            (identical(other.phoneNumber, phoneNumber) ||
                other.phoneNumber == phoneNumber));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    name,
    photoUrl,
    vehicleNumber,
    vehicleType,
    rating,
    phoneNumber,
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$DriverInfoImplCopyWith<_$DriverInfoImpl> get copyWith =>
      __$$DriverInfoImplCopyWithImpl<_$DriverInfoImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DriverInfoImplToJson(this);
  }
}

abstract class _DriverInfo implements DriverInfo {
  const factory _DriverInfo({
    required final String id,
    required final String name,
    final String? photoUrl,
    required final String vehicleNumber,
    required final String vehicleType,
    required final double rating,
    required final String phoneNumber,
  }) = _$DriverInfoImpl;

  factory _DriverInfo.fromJson(Map<String, dynamic> json) =
      _$DriverInfoImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String? get photoUrl;
  @override
  String get vehicleNumber;
  @override
  String get vehicleType;
  @override
  double get rating;
  @override
  String get phoneNumber;
  @override
  @JsonKey(ignore: true)
  _$$DriverInfoImplCopyWith<_$DriverInfoImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
