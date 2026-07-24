// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'support_ticket.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

SupportTicket _$SupportTicketFromJson(Map<String, dynamic> json) {
  return _SupportTicket.fromJson(json);
}

/// @nodoc
mixin _$SupportTicket {
  String get id => throw _privateConstructorUsedError;
  String get partnerId => throw _privateConstructorUsedError;
  String get subject => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  TicketCategory get category => throw _privateConstructorUsedError;
  TicketStatus get status => throw _privateConstructorUsedError;
  String? get orderId => throw _privateConstructorUsedError;
  List<String>? get attachmentUrls => throw _privateConstructorUsedError;
  String? get assignedTo => throw _privateConstructorUsedError;
  String? get resolution => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime? get updatedAt => throw _privateConstructorUsedError;
  DateTime? get resolvedAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $SupportTicketCopyWith<SupportTicket> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SupportTicketCopyWith<$Res> {
  factory $SupportTicketCopyWith(
          SupportTicket value, $Res Function(SupportTicket) then) =
      _$SupportTicketCopyWithImpl<$Res, SupportTicket>;
  @useResult
  $Res call(
      {String id,
      String partnerId,
      String subject,
      String description,
      TicketCategory category,
      TicketStatus status,
      String? orderId,
      List<String>? attachmentUrls,
      String? assignedTo,
      String? resolution,
      DateTime createdAt,
      DateTime? updatedAt,
      DateTime? resolvedAt});
}

/// @nodoc
class _$SupportTicketCopyWithImpl<$Res, $Val extends SupportTicket>
    implements $SupportTicketCopyWith<$Res> {
  _$SupportTicketCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partnerId = null,
    Object? subject = null,
    Object? description = null,
    Object? category = null,
    Object? status = null,
    Object? orderId = freezed,
    Object? attachmentUrls = freezed,
    Object? assignedTo = freezed,
    Object? resolution = freezed,
    Object? createdAt = null,
    Object? updatedAt = freezed,
    Object? resolvedAt = freezed,
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
      subject: null == subject
          ? _value.subject
          : subject // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      category: null == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as TicketCategory,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as TicketStatus,
      orderId: freezed == orderId
          ? _value.orderId
          : orderId // ignore: cast_nullable_to_non_nullable
              as String?,
      attachmentUrls: freezed == attachmentUrls
          ? _value.attachmentUrls
          : attachmentUrls // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      assignedTo: freezed == assignedTo
          ? _value.assignedTo
          : assignedTo // ignore: cast_nullable_to_non_nullable
              as String?,
      resolution: freezed == resolution
          ? _value.resolution
          : resolution // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: freezed == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      resolvedAt: freezed == resolvedAt
          ? _value.resolvedAt
          : resolvedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$SupportTicketImplCopyWith<$Res>
    implements $SupportTicketCopyWith<$Res> {
  factory _$$SupportTicketImplCopyWith(
          _$SupportTicketImpl value, $Res Function(_$SupportTicketImpl) then) =
      __$$SupportTicketImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String partnerId,
      String subject,
      String description,
      TicketCategory category,
      TicketStatus status,
      String? orderId,
      List<String>? attachmentUrls,
      String? assignedTo,
      String? resolution,
      DateTime createdAt,
      DateTime? updatedAt,
      DateTime? resolvedAt});
}

/// @nodoc
class __$$SupportTicketImplCopyWithImpl<$Res>
    extends _$SupportTicketCopyWithImpl<$Res, _$SupportTicketImpl>
    implements _$$SupportTicketImplCopyWith<$Res> {
  __$$SupportTicketImplCopyWithImpl(
      _$SupportTicketImpl _value, $Res Function(_$SupportTicketImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partnerId = null,
    Object? subject = null,
    Object? description = null,
    Object? category = null,
    Object? status = null,
    Object? orderId = freezed,
    Object? attachmentUrls = freezed,
    Object? assignedTo = freezed,
    Object? resolution = freezed,
    Object? createdAt = null,
    Object? updatedAt = freezed,
    Object? resolvedAt = freezed,
  }) {
    return _then(_$SupportTicketImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      partnerId: null == partnerId
          ? _value.partnerId
          : partnerId // ignore: cast_nullable_to_non_nullable
              as String,
      subject: null == subject
          ? _value.subject
          : subject // ignore: cast_nullable_to_non_nullable
              as String,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      category: null == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as TicketCategory,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as TicketStatus,
      orderId: freezed == orderId
          ? _value.orderId
          : orderId // ignore: cast_nullable_to_non_nullable
              as String?,
      attachmentUrls: freezed == attachmentUrls
          ? _value._attachmentUrls
          : attachmentUrls // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      assignedTo: freezed == assignedTo
          ? _value.assignedTo
          : assignedTo // ignore: cast_nullable_to_non_nullable
              as String?,
      resolution: freezed == resolution
          ? _value.resolution
          : resolution // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      updatedAt: freezed == updatedAt
          ? _value.updatedAt
          : updatedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      resolvedAt: freezed == resolvedAt
          ? _value.resolvedAt
          : resolvedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$SupportTicketImpl implements _SupportTicket {
  const _$SupportTicketImpl(
      {required this.id,
      required this.partnerId,
      required this.subject,
      required this.description,
      required this.category,
      required this.status,
      this.orderId,
      final List<String>? attachmentUrls,
      this.assignedTo,
      this.resolution,
      required this.createdAt,
      this.updatedAt,
      this.resolvedAt})
      : _attachmentUrls = attachmentUrls;

  factory _$SupportTicketImpl.fromJson(Map<String, dynamic> json) =>
      _$$SupportTicketImplFromJson(json);

  @override
  final String id;
  @override
  final String partnerId;
  @override
  final String subject;
  @override
  final String description;
  @override
  final TicketCategory category;
  @override
  final TicketStatus status;
  @override
  final String? orderId;
  final List<String>? _attachmentUrls;
  @override
  List<String>? get attachmentUrls {
    final value = _attachmentUrls;
    if (value == null) return null;
    if (_attachmentUrls is EqualUnmodifiableListView) return _attachmentUrls;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String? assignedTo;
  @override
  final String? resolution;
  @override
  final DateTime createdAt;
  @override
  final DateTime? updatedAt;
  @override
  final DateTime? resolvedAt;

  @override
  String toString() {
    return 'SupportTicket(id: $id, partnerId: $partnerId, subject: $subject, description: $description, category: $category, status: $status, orderId: $orderId, attachmentUrls: $attachmentUrls, assignedTo: $assignedTo, resolution: $resolution, createdAt: $createdAt, updatedAt: $updatedAt, resolvedAt: $resolvedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SupportTicketImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.partnerId, partnerId) ||
                other.partnerId == partnerId) &&
            (identical(other.subject, subject) || other.subject == subject) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.orderId, orderId) || other.orderId == orderId) &&
            const DeepCollectionEquality()
                .equals(other._attachmentUrls, _attachmentUrls) &&
            (identical(other.assignedTo, assignedTo) ||
                other.assignedTo == assignedTo) &&
            (identical(other.resolution, resolution) ||
                other.resolution == resolution) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            (identical(other.resolvedAt, resolvedAt) ||
                other.resolvedAt == resolvedAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      partnerId,
      subject,
      description,
      category,
      status,
      orderId,
      const DeepCollectionEquality().hash(_attachmentUrls),
      assignedTo,
      resolution,
      createdAt,
      updatedAt,
      resolvedAt);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$SupportTicketImplCopyWith<_$SupportTicketImpl> get copyWith =>
      __$$SupportTicketImplCopyWithImpl<_$SupportTicketImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$SupportTicketImplToJson(
      this,
    );
  }
}

abstract class _SupportTicket implements SupportTicket {
  const factory _SupportTicket(
      {required final String id,
      required final String partnerId,
      required final String subject,
      required final String description,
      required final TicketCategory category,
      required final TicketStatus status,
      final String? orderId,
      final List<String>? attachmentUrls,
      final String? assignedTo,
      final String? resolution,
      required final DateTime createdAt,
      final DateTime? updatedAt,
      final DateTime? resolvedAt}) = _$SupportTicketImpl;

  factory _SupportTicket.fromJson(Map<String, dynamic> json) =
      _$SupportTicketImpl.fromJson;

  @override
  String get id;
  @override
  String get partnerId;
  @override
  String get subject;
  @override
  String get description;
  @override
  TicketCategory get category;
  @override
  TicketStatus get status;
  @override
  String? get orderId;
  @override
  List<String>? get attachmentUrls;
  @override
  String? get assignedTo;
  @override
  String? get resolution;
  @override
  DateTime get createdAt;
  @override
  DateTime? get updatedAt;
  @override
  DateTime? get resolvedAt;
  @override
  @JsonKey(ignore: true)
  _$$SupportTicketImplCopyWith<_$SupportTicketImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
