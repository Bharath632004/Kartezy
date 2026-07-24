// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'delivery_notification.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

DeliveryNotificationItem _$DeliveryNotificationItemFromJson(
  Map<String, dynamic> json,
) {
  return _DeliveryNotificationItem.fromJson(json);
}

/// @nodoc
mixin _$DeliveryNotificationItem {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get body => throw _privateConstructorUsedError;
  NotificationCategory get category => throw _privateConstructorUsedError;
  NotificationPriority get priority => throw _privateConstructorUsedError;
  Map<String, dynamic>? get data => throw _privateConstructorUsedError;
  bool get isRead => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $DeliveryNotificationItemCopyWith<DeliveryNotificationItem> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DeliveryNotificationItemCopyWith<$Res> {
  factory $DeliveryNotificationItemCopyWith(
    DeliveryNotificationItem value,
    $Res Function(DeliveryNotificationItem) then,
  ) = _$DeliveryNotificationItemCopyWithImpl<$Res, DeliveryNotificationItem>;
  @useResult
  $Res call({
    String id,
    String title,
    String body,
    NotificationCategory category,
    NotificationPriority priority,
    Map<String, dynamic>? data,
    bool isRead,
    DateTime createdAt,
  });
}

/// @nodoc
class _$DeliveryNotificationItemCopyWithImpl<
  $Res,
  $Val extends DeliveryNotificationItem
>
    implements $DeliveryNotificationItemCopyWith<$Res> {
  _$DeliveryNotificationItemCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? body = null,
    Object? category = null,
    Object? priority = null,
    Object? data = freezed,
    Object? isRead = null,
    Object? createdAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            body: null == body
                ? _value.body
                : body // ignore: cast_nullable_to_non_nullable
                      as String,
            category: null == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as NotificationCategory,
            priority: null == priority
                ? _value.priority
                : priority // ignore: cast_nullable_to_non_nullable
                      as NotificationPriority,
            data: freezed == data
                ? _value.data
                : data // ignore: cast_nullable_to_non_nullable
                      as Map<String, dynamic>?,
            isRead: null == isRead
                ? _value.isRead
                : isRead // ignore: cast_nullable_to_non_nullable
                      as bool,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DeliveryNotificationItemImplCopyWith<$Res>
    implements $DeliveryNotificationItemCopyWith<$Res> {
  factory _$$DeliveryNotificationItemImplCopyWith(
    _$DeliveryNotificationItemImpl value,
    $Res Function(_$DeliveryNotificationItemImpl) then,
  ) = __$$DeliveryNotificationItemImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String title,
    String body,
    NotificationCategory category,
    NotificationPriority priority,
    Map<String, dynamic>? data,
    bool isRead,
    DateTime createdAt,
  });
}

/// @nodoc
class __$$DeliveryNotificationItemImplCopyWithImpl<$Res>
    extends
        _$DeliveryNotificationItemCopyWithImpl<
          $Res,
          _$DeliveryNotificationItemImpl
        >
    implements _$$DeliveryNotificationItemImplCopyWith<$Res> {
  __$$DeliveryNotificationItemImplCopyWithImpl(
    _$DeliveryNotificationItemImpl _value,
    $Res Function(_$DeliveryNotificationItemImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? body = null,
    Object? category = null,
    Object? priority = null,
    Object? data = freezed,
    Object? isRead = null,
    Object? createdAt = null,
  }) {
    return _then(
      _$DeliveryNotificationItemImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        body: null == body
            ? _value.body
            : body // ignore: cast_nullable_to_non_nullable
                  as String,
        category: null == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as NotificationCategory,
        priority: null == priority
            ? _value.priority
            : priority // ignore: cast_nullable_to_non_nullable
                  as NotificationPriority,
        data: freezed == data
            ? _value._data
            : data // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>?,
        isRead: null == isRead
            ? _value.isRead
            : isRead // ignore: cast_nullable_to_non_nullable
                  as bool,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$DeliveryNotificationItemImpl implements _DeliveryNotificationItem {
  const _$DeliveryNotificationItemImpl({
    required this.id,
    required this.title,
    required this.body,
    required this.category,
    required this.priority,
    final Map<String, dynamic>? data,
    required this.isRead,
    required this.createdAt,
  }) : _data = data;

  factory _$DeliveryNotificationItemImpl.fromJson(Map<String, dynamic> json) =>
      _$$DeliveryNotificationItemImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String body;
  @override
  final NotificationCategory category;
  @override
  final NotificationPriority priority;
  final Map<String, dynamic>? _data;
  @override
  Map<String, dynamic>? get data {
    final value = _data;
    if (value == null) return null;
    if (_data is EqualUnmodifiableMapView) return _data;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  final bool isRead;
  @override
  final DateTime createdAt;

  @override
  String toString() {
    return 'DeliveryNotificationItem(id: $id, title: $title, body: $body, category: $category, priority: $priority, data: $data, isRead: $isRead, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DeliveryNotificationItemImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.body, body) || other.body == body) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.priority, priority) ||
                other.priority == priority) &&
            const DeepCollectionEquality().equals(other._data, _data) &&
            (identical(other.isRead, isRead) || other.isRead == isRead) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    title,
    body,
    category,
    priority,
    const DeepCollectionEquality().hash(_data),
    isRead,
    createdAt,
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$DeliveryNotificationItemImplCopyWith<_$DeliveryNotificationItemImpl>
  get copyWith =>
      __$$DeliveryNotificationItemImplCopyWithImpl<
        _$DeliveryNotificationItemImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DeliveryNotificationItemImplToJson(this);
  }
}

abstract class _DeliveryNotificationItem implements DeliveryNotificationItem {
  const factory _DeliveryNotificationItem({
    required final String id,
    required final String title,
    required final String body,
    required final NotificationCategory category,
    required final NotificationPriority priority,
    final Map<String, dynamic>? data,
    required final bool isRead,
    required final DateTime createdAt,
  }) = _$DeliveryNotificationItemImpl;

  factory _DeliveryNotificationItem.fromJson(Map<String, dynamic> json) =
      _$DeliveryNotificationItemImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String get body;
  @override
  NotificationCategory get category;
  @override
  NotificationPriority get priority;
  @override
  Map<String, dynamic>? get data;
  @override
  bool get isRead;
  @override
  DateTime get createdAt;
  @override
  @JsonKey(ignore: true)
  _$$DeliveryNotificationItemImplCopyWith<_$DeliveryNotificationItemImpl>
  get copyWith => throw _privateConstructorUsedError;
}
