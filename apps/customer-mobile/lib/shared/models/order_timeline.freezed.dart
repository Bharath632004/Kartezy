// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'order_timeline.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

OrderTimeline _$OrderTimelineFromJson(Map<String, dynamic> json) {
  return _OrderTimeline.fromJson(json);
}

/// @nodoc
mixin _$OrderTimeline {
  String get id => throw _privateConstructorUsedError;
  String get orderId => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  DateTime get timestamp => throw _privateConstructorUsedError;
  String? get updatedBy => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $OrderTimelineCopyWith<OrderTimeline> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $OrderTimelineCopyWith<$Res> {
  factory $OrderTimelineCopyWith(
          OrderTimeline value, $Res Function(OrderTimeline) then) =
      _$OrderTimelineCopyWithImpl<$Res, OrderTimeline>;
  @useResult
  $Res call(
      {String id,
      String orderId,
      String status,
      String description,
      DateTime timestamp,
      String? updatedBy});
}

/// @nodoc
class _$OrderTimelineCopyWithImpl<$Res, $Val extends OrderTimeline>
    implements $OrderTimelineCopyWith<$Res> {
  _$OrderTimelineCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? orderId = null,
    Object? status = null,
    Object? description = null,
    Object? timestamp = null,
    Object? updatedBy = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      orderId: null == orderId
          ? _value.orderId
          : orderId // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedBy: freezed == updatedBy
          ? _value.updatedBy
          : updatedBy // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$OrderTimelineImplCopyWith<$Res>
    implements $OrderTimelineCopyWith<$Res> {
  factory _$$OrderTimelineImplCopyWith(
          _$OrderTimelineImpl value, $Res Function(_$OrderTimelineImpl) then) =
      __$$OrderTimelineImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String orderId,
      String status,
      String description,
      DateTime timestamp,
      String? updatedBy});
}

/// @nodoc
class __$$OrderTimelineImplCopyWithImpl<$Res>
    extends _$OrderTimelineCopyWithImpl<$Res, _$OrderTimelineImpl>
    implements _$$OrderTimelineImplCopyWith<$Res> {
  __$$OrderTimelineImplCopyWithImpl(
      _$OrderTimelineImpl _value, $Res Function(_$OrderTimelineImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? orderId = null,
    Object? status = null,
    Object? description = null,
    Object? timestamp = null,
    Object? updatedBy = freezed,
  }) {
    return _then(_$OrderTimelineImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      orderId: null == orderId
          ? _value.orderId
          : orderId // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      timestamp: null == timestamp
          ? _value.timestamp
          : timestamp // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedBy: freezed == updatedBy
          ? _value.updatedBy
          : updatedBy // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$OrderTimelineImpl implements _OrderTimeline {
  const _$OrderTimelineImpl(
      {required this.id,
      required this.orderId,
      required this.status,
      required this.description,
      required this.timestamp,
      this.updatedBy});

  factory _$OrderTimelineImpl.fromJson(Map<String, dynamic> json) =>
      _$$OrderTimelineImplFromJson(json);

  @override
  final String id;
  @override
  final String orderId;
  @override
  final String status;
  @override
  final String description;
  @override
  final DateTime timestamp;
  @override
  final String? updatedBy;

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$OrderTimelineImplCopyWith<_$OrderTimelineImpl> get copyWith =>
      __$$OrderTimelineImplCopyWithImpl<_$OrderTimelineImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$OrderTimelineImplToJson(
      this,
    );
  }
}

abstract class _OrderTimeline implements OrderTimeline {
  const factory _OrderTimeline(
      {required final String id,
      required final String orderId,
      required final String status,
      required final String description,
      required final DateTime timestamp,
      final String? updatedBy}) = _$OrderTimelineImpl;

  factory _OrderTimeline.fromJson(Map<String, dynamic> json) =
      _$OrderTimelineImpl.fromJson;

  @override
  String get id;
  @override
  String get orderId;
  @override
  String get status;
  @override
  String get description;
  @override
  DateTime get timestamp;
  @override
  String? get updatedBy;
  @override
  @JsonKey(ignore: true)
  _$$OrderTimelineImplCopyWith<_$OrderTimelineImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
