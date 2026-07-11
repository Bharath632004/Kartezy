// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'membership.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

MembershipPlan _$MembershipPlanFromJson(Map<String, dynamic> json) {
  return _MembershipPlan.fromJson(json);
}

/// @nodoc
mixin _$MembershipPlan {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  double get price => throw _privateConstructorUsedError;
  String get duration =>
      throw _privateConstructorUsedError; // e.g., 'monthly', 'yearly'
  List<String> get benefits => throw _privateConstructorUsedError;
  bool get isPopular => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $MembershipPlanCopyWith<MembershipPlan> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MembershipPlanCopyWith<$Res> {
  factory $MembershipPlanCopyWith(
          MembershipPlan value, $Res Function(MembershipPlan) then) =
      _$MembershipPlanCopyWithImpl<$Res, MembershipPlan>;
  @useResult
  $Res call(
      {String id,
      String name,
      double price,
      String duration,
      List<String> benefits,
      bool isPopular});
}

/// @nodoc
class _$MembershipPlanCopyWithImpl<$Res, $Val extends MembershipPlan>
    implements $MembershipPlanCopyWith<$Res> {
  _$MembershipPlanCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? price = null,
    Object? duration = null,
    Object? benefits = null,
    Object? isPopular = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      price: null == price
          ? _value.price
          : price // ignore: cast_nullable_to_non_nullable
              as double,
      duration: null == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as String,
      benefits: null == benefits
          ? _value.benefits
          : benefits // ignore: cast_nullable_to_non_nullable
              as List<String>,
      isPopular: null == isPopular
          ? _value.isPopular
          : isPopular // ignore: cast_nullable_to_non_nullable
              as bool,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MembershipPlanImplCopyWith<$Res>
    implements $MembershipPlanCopyWith<$Res> {
  factory _$$MembershipPlanImplCopyWith(_$MembershipPlanImpl value,
          $Res Function(_$MembershipPlanImpl) then) =
      __$$MembershipPlanImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      double price,
      String duration,
      List<String> benefits,
      bool isPopular});
}

/// @nodoc
class __$$MembershipPlanImplCopyWithImpl<$Res>
    extends _$MembershipPlanCopyWithImpl<$Res, _$MembershipPlanImpl>
    implements _$$MembershipPlanImplCopyWith<$Res> {
  __$$MembershipPlanImplCopyWithImpl(
      _$MembershipPlanImpl _value, $Res Function(_$MembershipPlanImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? price = null,
    Object? duration = null,
    Object? benefits = null,
    Object? isPopular = null,
  }) {
    return _then(_$MembershipPlanImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      price: null == price
          ? _value.price
          : price // ignore: cast_nullable_to_non_nullable
              as double,
      duration: null == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as String,
      benefits: null == benefits
          ? _value._benefits
          : benefits // ignore: cast_nullable_to_non_nullable
              as List<String>,
      isPopular: null == isPopular
          ? _value.isPopular
          : isPopular // ignore: cast_nullable_to_non_nullable
              as bool,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MembershipPlanImpl implements _MembershipPlan {
  const _$MembershipPlanImpl(
      {required this.id,
      required this.name,
      required this.price,
      required this.duration,
      required final List<String> benefits,
      required this.isPopular})
      : _benefits = benefits;

  factory _$MembershipPlanImpl.fromJson(Map<String, dynamic> json) =>
      _$$MembershipPlanImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final double price;
  @override
  final String duration;
// e.g., 'monthly', 'yearly'
  final List<String> _benefits;
// e.g., 'monthly', 'yearly'
  @override
  List<String> get benefits {
    if (_benefits is EqualUnmodifiableListView) return _benefits;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_benefits);
  }

  @override
  final bool isPopular;

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$MembershipPlanImplCopyWith<_$MembershipPlanImpl> get copyWith =>
      __$$MembershipPlanImplCopyWithImpl<_$MembershipPlanImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MembershipPlanImplToJson(
      this,
    );
  }
}

abstract class _MembershipPlan implements MembershipPlan {
  const factory _MembershipPlan(
      {required final String id,
      required final String name,
      required final double price,
      required final String duration,
      required final List<String> benefits,
      required final bool isPopular}) = _$MembershipPlanImpl;

  factory _MembershipPlan.fromJson(Map<String, dynamic> json) =
      _$MembershipPlanImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  double get price;
  @override
  String get duration;
  @override // e.g., 'monthly', 'yearly'
  List<String> get benefits;
  @override
  bool get isPopular;
  @override
  @JsonKey(ignore: true)
  _$$MembershipPlanImplCopyWith<_$MembershipPlanImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

Membership _$MembershipFromJson(Map<String, dynamic> json) {
  return _Membership.fromJson(json);
}

/// @nodoc
mixin _$Membership {
  String get planId => throw _privateConstructorUsedError;
  DateTime get startDate => throw _privateConstructorUsedError;
  DateTime get endDate => throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;
  List<String> get usedBenefits => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $MembershipCopyWith<Membership> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MembershipCopyWith<$Res> {
  factory $MembershipCopyWith(
          Membership value, $Res Function(Membership) then) =
      _$MembershipCopyWithImpl<$Res, Membership>;
  @useResult
  $Res call(
      {String planId,
      DateTime startDate,
      DateTime endDate,
      bool isActive,
      List<String> usedBenefits});
}

/// @nodoc
class _$MembershipCopyWithImpl<$Res, $Val extends Membership>
    implements $MembershipCopyWith<$Res> {
  _$MembershipCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? planId = null,
    Object? startDate = null,
    Object? endDate = null,
    Object? isActive = null,
    Object? usedBenefits = null,
  }) {
    return _then(_value.copyWith(
      planId: null == planId
          ? _value.planId
          : planId // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: null == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      isActive: null == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool,
      usedBenefits: null == usedBenefits
          ? _value.usedBenefits
          : usedBenefits // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MembershipImplCopyWith<$Res>
    implements $MembershipCopyWith<$Res> {
  factory _$$MembershipImplCopyWith(
          _$MembershipImpl value, $Res Function(_$MembershipImpl) then) =
      __$$MembershipImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String planId,
      DateTime startDate,
      DateTime endDate,
      bool isActive,
      List<String> usedBenefits});
}

/// @nodoc
class __$$MembershipImplCopyWithImpl<$Res>
    extends _$MembershipCopyWithImpl<$Res, _$MembershipImpl>
    implements _$$MembershipImplCopyWith<$Res> {
  __$$MembershipImplCopyWithImpl(
      _$MembershipImpl _value, $Res Function(_$MembershipImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? planId = null,
    Object? startDate = null,
    Object? endDate = null,
    Object? isActive = null,
    Object? usedBenefits = null,
  }) {
    return _then(_$MembershipImpl(
      planId: null == planId
          ? _value.planId
          : planId // ignore: cast_nullable_to_non_nullable
              as String,
      startDate: null == startDate
          ? _value.startDate
          : startDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      endDate: null == endDate
          ? _value.endDate
          : endDate // ignore: cast_nullable_to_non_nullable
              as DateTime,
      isActive: null == isActive
          ? _value.isActive
          : isActive // ignore: cast_nullable_to_non_nullable
              as bool,
      usedBenefits: null == usedBenefits
          ? _value._usedBenefits
          : usedBenefits // ignore: cast_nullable_to_non_nullable
              as List<String>,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MembershipImpl implements _Membership {
  const _$MembershipImpl(
      {required this.planId,
      required this.startDate,
      required this.endDate,
      required this.isActive,
      required final List<String> usedBenefits})
      : _usedBenefits = usedBenefits;

  factory _$MembershipImpl.fromJson(Map<String, dynamic> json) =>
      _$$MembershipImplFromJson(json);

  @override
  final String planId;
  @override
  final DateTime startDate;
  @override
  final DateTime endDate;
  @override
  final bool isActive;
  final List<String> _usedBenefits;
  @override
  List<String> get usedBenefits {
    if (_usedBenefits is EqualUnmodifiableListView) return _usedBenefits;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_usedBenefits);
  }

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$MembershipImplCopyWith<_$MembershipImpl> get copyWith =>
      __$$MembershipImplCopyWithImpl<_$MembershipImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MembershipImplToJson(
      this,
    );
  }
}

abstract class _Membership implements Membership {
  const factory _Membership(
      {required final String planId,
      required final DateTime startDate,
      required final DateTime endDate,
      required final bool isActive,
      required final List<String> usedBenefits}) = _$MembershipImpl;

  factory _Membership.fromJson(Map<String, dynamic> json) =
      _$MembershipImpl.fromJson;

  @override
  String get planId;
  @override
  DateTime get startDate;
  @override
  DateTime get endDate;
  @override
  bool get isActive;
  @override
  List<String> get usedBenefits;
  @override
  @JsonKey(ignore: true)
  _$$MembershipImplCopyWith<_$MembershipImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

MembershipBenefit _$MembershipBenefitFromJson(Map<String, dynamic> json) {
  return _MembershipBenefit.fromJson(json);
}

/// @nodoc
mixin _$MembershipBenefit {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  String get icon => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $MembershipBenefitCopyWith<MembershipBenefit> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MembershipBenefitCopyWith<$Res> {
  factory $MembershipBenefitCopyWith(
          MembershipBenefit value, $Res Function(MembershipBenefit) then) =
      _$MembershipBenefitCopyWithImpl<$Res, MembershipBenefit>;
  @useResult
  $Res call({String id, String title, String description, String icon});
}

/// @nodoc
class _$MembershipBenefitCopyWithImpl<$Res, $Val extends MembershipBenefit>
    implements $MembershipBenefitCopyWith<$Res> {
  _$MembershipBenefitCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = null,
    Object? icon = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      icon: null == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$MembershipBenefitImplCopyWith<$Res>
    implements $MembershipBenefitCopyWith<$Res> {
  factory _$$MembershipBenefitImplCopyWith(_$MembershipBenefitImpl value,
          $Res Function(_$MembershipBenefitImpl) then) =
      __$$MembershipBenefitImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String title, String description, String icon});
}

/// @nodoc
class __$$MembershipBenefitImplCopyWithImpl<$Res>
    extends _$MembershipBenefitCopyWithImpl<$Res, _$MembershipBenefitImpl>
    implements _$$MembershipBenefitImplCopyWith<$Res> {
  __$$MembershipBenefitImplCopyWithImpl(_$MembershipBenefitImpl _value,
      $Res Function(_$MembershipBenefitImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = null,
    Object? icon = null,
  }) {
    return _then(_$MembershipBenefitImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      icon: null == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MembershipBenefitImpl implements _MembershipBenefit {
  const _$MembershipBenefitImpl(
      {required this.id,
      required this.title,
      required this.description,
      required this.icon});

  factory _$MembershipBenefitImpl.fromJson(Map<String, dynamic> json) =>
      _$$MembershipBenefitImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String description;
  @override
  final String icon;

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$MembershipBenefitImplCopyWith<_$MembershipBenefitImpl> get copyWith =>
      __$$MembershipBenefitImplCopyWithImpl<_$MembershipBenefitImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MembershipBenefitImplToJson(
      this,
    );
  }
}

abstract class _MembershipBenefit implements MembershipBenefit {
  const factory _MembershipBenefit(
      {required final String id,
      required final String title,
      required final String description,
      required final String icon}) = _$MembershipBenefitImpl;

  factory _MembershipBenefit.fromJson(Map<String, dynamic> json) =
      _$MembershipBenefitImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String get description;
  @override
  String get icon;
  @override
  @JsonKey(ignore: true)
  _$$MembershipBenefitImplCopyWith<_$MembershipBenefitImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
