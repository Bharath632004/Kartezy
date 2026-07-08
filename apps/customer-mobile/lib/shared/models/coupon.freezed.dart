// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'coupon.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Coupon _$CouponFromJson(Map<String, dynamic> json) {
  return _Coupon.fromJson(json);
}

/// @nodoc
mixin _$Coupon {
  String get id => throw _privateConstructorUsedError;
  String get code => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  double get discountAmount => throw _privateConstructorUsedError;
  String? get discountPercentage => throw _privateConstructorUsedError;
  DateTime? get validFrom => throw _privateConstructorUsedError;
  DateTime? get validUntil => throw _privateConstructorUsedError;
  bool? get isActive => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $CouponCopyWith<Coupon> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CouponCopyWith<$Res> {
  factory $CouponCopyWith(Coupon value, $Res Function(Coupon) then) =
      _$CouponCopyWithImpl<$Res, Coupon>;
  @useResult
  $Res call({
    String id,
    String code,
    String description,
    double discountAmount,
    String? discountPercentage,
    DateTime? validFrom,
    DateTime? validUntil,
    bool? isActive,
  });
}

/// @nodoc
class _$CouponCopyWithImpl<$Res, $Val extends Coupon>
    implements $CouponCopyWith<$Res> {
  _$CouponCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? code = null,
    Object? description = null,
    Object? discountAmount = null,
    Object? discountPercentage = freezed,
    Object? validFrom = freezed,
    Object? validUntil = freezed,
    Object? isActive = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            code: null == code
                ? _value.code
                : code // ignore: cast_nullable_to_non_nullable
                      as String,
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            discountAmount: null == discountAmount
                ? _value.discountAmount
                : discountAmount // ignore: cast_nullable_to_non_nullable
                      as double,
            discountPercentage: freezed == discountPercentage
                ? _value.discountPercentage
                : discountPercentage // ignore: cast_nullable_to_non_nullable
                      as String?,
            validFrom: freezed == validFrom
                ? _value.validFrom
                : validFrom // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            validUntil: freezed == validUntil
                ? _value.validUntil
                : validUntil // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            isActive: freezed == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CouponImplCopyWith<$Res> implements $CouponCopyWith<$Res> {
  factory _$$CouponImplCopyWith(
    _$CouponImpl value,
    $Res Function(_$CouponImpl) then,
  ) = __$$CouponImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String code,
    String description,
    double discountAmount,
    String? discountPercentage,
    DateTime? validFrom,
    DateTime? validUntil,
    bool? isActive,
  });
}

/// @nodoc
class __$$CouponImplCopyWithImpl<$Res>
    extends _$CouponCopyWithImpl<$Res, _$CouponImpl>
    implements _$$CouponImplCopyWith<$Res> {
  __$$CouponImplCopyWithImpl(
    _$CouponImpl _value,
    $Res Function(_$CouponImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? code = null,
    Object? description = null,
    Object? discountAmount = null,
    Object? discountPercentage = freezed,
    Object? validFrom = freezed,
    Object? validUntil = freezed,
    Object? isActive = freezed,
  }) {
    return _then(
      _$CouponImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        code: null == code
            ? _value.code
            : code // ignore: cast_nullable_to_non_nullable
                  as String,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        discountAmount: null == discountAmount
            ? _value.discountAmount
            : discountAmount // ignore: cast_nullable_to_non_nullable
                  as double,
        discountPercentage: freezed == discountPercentage
            ? _value.discountPercentage
            : discountPercentage // ignore: cast_nullable_to_non_nullable
                  as String?,
        validFrom: freezed == validFrom
            ? _value.validFrom
            : validFrom // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        validUntil: freezed == validUntil
            ? _value.validUntil
            : validUntil // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        isActive: freezed == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CouponImpl implements _Coupon {
  const _$CouponImpl({
    required this.id,
    required this.code,
    required this.description,
    required this.discountAmount,
    this.discountPercentage,
    this.validFrom,
    this.validUntil,
    this.isActive,
  });

  factory _$CouponImpl.fromJson(Map<String, dynamic> json) =>
      _$$CouponImplFromJson(json);

  @override
  final String id;
  @override
  final String code;
  @override
  final String description;
  @override
  final double discountAmount;
  @override
  final String? discountPercentage;
  @override
  final DateTime? validFrom;
  @override
  final DateTime? validUntil;
  @override
  final bool? isActive;

  @override
  String toString() {
    return 'Coupon(id: $id, code: $code, description: $description, discountAmount: $discountAmount, discountPercentage: $discountPercentage, validFrom: $validFrom, validUntil: $validUntil, isActive: $isActive)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CouponImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.code, code) || other.code == code) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.discountAmount, discountAmount) ||
                other.discountAmount == discountAmount) &&
            (identical(other.discountPercentage, discountPercentage) ||
                other.discountPercentage == discountPercentage) &&
            (identical(other.validFrom, validFrom) ||
                other.validFrom == validFrom) &&
            (identical(other.validUntil, validUntil) ||
                other.validUntil == validUntil) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    code,
    description,
    discountAmount,
    discountPercentage,
    validFrom,
    validUntil,
    isActive,
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$CouponImplCopyWith<_$CouponImpl> get copyWith =>
      __$$CouponImplCopyWithImpl<_$CouponImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CouponImplToJson(this);
  }
}

abstract class _Coupon implements Coupon {
  const factory _Coupon({
    required final String id,
    required final String code,
    required final String description,
    required final double discountAmount,
    final String? discountPercentage,
    final DateTime? validFrom,
    final DateTime? validUntil,
    final bool? isActive,
  }) = _$CouponImpl;

  factory _Coupon.fromJson(Map<String, dynamic> json) = _$CouponImpl.fromJson;

  @override
  String get id;
  @override
  String get code;
  @override
  String get description;
  @override
  double get discountAmount;
  @override
  String? get discountPercentage;
  @override
  DateTime? get validFrom;
  @override
  DateTime? get validUntil;
  @override
  bool? get isActive;
  @override
  @JsonKey(ignore: true)
  _$$CouponImplCopyWith<_$CouponImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
