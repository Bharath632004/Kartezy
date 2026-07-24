// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'chat_message.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

ChatMessage _$ChatMessageFromJson(Map<String, dynamic> json) {
  return _ChatMessage.fromJson(json);
}

/// @nodoc
mixin _$ChatMessage {
  String get id => throw _privateConstructorUsedError;
  String get senderId => throw _privateConstructorUsedError;
  ChatParticipantType get senderType => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;
  String get chatRoomId => throw _privateConstructorUsedError;
  Map<String, dynamic>? get metadata => throw _privateConstructorUsedError;
  bool get isRead => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $ChatMessageCopyWith<ChatMessage> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ChatMessageCopyWith<$Res> {
  factory $ChatMessageCopyWith(
    ChatMessage value,
    $Res Function(ChatMessage) then,
  ) = _$ChatMessageCopyWithImpl<$Res, ChatMessage>;
  @useResult
  $Res call({
    String id,
    String senderId,
    ChatParticipantType senderType,
    String content,
    String chatRoomId,
    Map<String, dynamic>? metadata,
    bool isRead,
    DateTime createdAt,
  });
}

/// @nodoc
class _$ChatMessageCopyWithImpl<$Res, $Val extends ChatMessage>
    implements $ChatMessageCopyWith<$Res> {
  _$ChatMessageCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? senderId = null,
    Object? senderType = null,
    Object? content = null,
    Object? chatRoomId = null,
    Object? metadata = freezed,
    Object? isRead = null,
    Object? createdAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            senderId: null == senderId
                ? _value.senderId
                : senderId // ignore: cast_nullable_to_non_nullable
                      as String,
            senderType: null == senderType
                ? _value.senderType
                : senderType // ignore: cast_nullable_to_non_nullable
                      as ChatParticipantType,
            content: null == content
                ? _value.content
                : content // ignore: cast_nullable_to_non_nullable
                      as String,
            chatRoomId: null == chatRoomId
                ? _value.chatRoomId
                : chatRoomId // ignore: cast_nullable_to_non_nullable
                      as String,
            metadata: freezed == metadata
                ? _value.metadata
                : metadata // ignore: cast_nullable_to_non_nullable
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
abstract class _$$ChatMessageImplCopyWith<$Res>
    implements $ChatMessageCopyWith<$Res> {
  factory _$$ChatMessageImplCopyWith(
    _$ChatMessageImpl value,
    $Res Function(_$ChatMessageImpl) then,
  ) = __$$ChatMessageImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String senderId,
    ChatParticipantType senderType,
    String content,
    String chatRoomId,
    Map<String, dynamic>? metadata,
    bool isRead,
    DateTime createdAt,
  });
}

/// @nodoc
class __$$ChatMessageImplCopyWithImpl<$Res>
    extends _$ChatMessageCopyWithImpl<$Res, _$ChatMessageImpl>
    implements _$$ChatMessageImplCopyWith<$Res> {
  __$$ChatMessageImplCopyWithImpl(
    _$ChatMessageImpl _value,
    $Res Function(_$ChatMessageImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? senderId = null,
    Object? senderType = null,
    Object? content = null,
    Object? chatRoomId = null,
    Object? metadata = freezed,
    Object? isRead = null,
    Object? createdAt = null,
  }) {
    return _then(
      _$ChatMessageImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        senderId: null == senderId
            ? _value.senderId
            : senderId // ignore: cast_nullable_to_non_nullable
                  as String,
        senderType: null == senderType
            ? _value.senderType
            : senderType // ignore: cast_nullable_to_non_nullable
                  as ChatParticipantType,
        content: null == content
            ? _value.content
            : content // ignore: cast_nullable_to_non_nullable
                  as String,
        chatRoomId: null == chatRoomId
            ? _value.chatRoomId
            : chatRoomId // ignore: cast_nullable_to_non_nullable
                  as String,
        metadata: freezed == metadata
            ? _value._metadata
            : metadata // ignore: cast_nullable_to_non_nullable
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
class _$ChatMessageImpl implements _ChatMessage {
  const _$ChatMessageImpl({
    required this.id,
    required this.senderId,
    required this.senderType,
    required this.content,
    required this.chatRoomId,
    final Map<String, dynamic>? metadata,
    required this.isRead,
    required this.createdAt,
  }) : _metadata = metadata;

  factory _$ChatMessageImpl.fromJson(Map<String, dynamic> json) =>
      _$$ChatMessageImplFromJson(json);

  @override
  final String id;
  @override
  final String senderId;
  @override
  final ChatParticipantType senderType;
  @override
  final String content;
  @override
  final String chatRoomId;
  final Map<String, dynamic>? _metadata;
  @override
  Map<String, dynamic>? get metadata {
    final value = _metadata;
    if (value == null) return null;
    if (_metadata is EqualUnmodifiableMapView) return _metadata;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  final bool isRead;
  @override
  final DateTime createdAt;

  @override
  String toString() {
    return 'ChatMessage(id: $id, senderId: $senderId, senderType: $senderType, content: $content, chatRoomId: $chatRoomId, metadata: $metadata, isRead: $isRead, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ChatMessageImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.senderId, senderId) ||
                other.senderId == senderId) &&
            (identical(other.senderType, senderType) ||
                other.senderType == senderType) &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.chatRoomId, chatRoomId) ||
                other.chatRoomId == chatRoomId) &&
            const DeepCollectionEquality().equals(other._metadata, _metadata) &&
            (identical(other.isRead, isRead) || other.isRead == isRead) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    senderId,
    senderType,
    content,
    chatRoomId,
    const DeepCollectionEquality().hash(_metadata),
    isRead,
    createdAt,
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$ChatMessageImplCopyWith<_$ChatMessageImpl> get copyWith =>
      __$$ChatMessageImplCopyWithImpl<_$ChatMessageImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ChatMessageImplToJson(this);
  }
}

abstract class _ChatMessage implements ChatMessage {
  const factory _ChatMessage({
    required final String id,
    required final String senderId,
    required final ChatParticipantType senderType,
    required final String content,
    required final String chatRoomId,
    final Map<String, dynamic>? metadata,
    required final bool isRead,
    required final DateTime createdAt,
  }) = _$ChatMessageImpl;

  factory _ChatMessage.fromJson(Map<String, dynamic> json) =
      _$ChatMessageImpl.fromJson;

  @override
  String get id;
  @override
  String get senderId;
  @override
  ChatParticipantType get senderType;
  @override
  String get content;
  @override
  String get chatRoomId;
  @override
  Map<String, dynamic>? get metadata;
  @override
  bool get isRead;
  @override
  DateTime get createdAt;
  @override
  @JsonKey(ignore: true)
  _$$ChatMessageImplCopyWith<_$ChatMessageImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ChatRoom _$ChatRoomFromJson(Map<String, dynamic> json) {
  return _ChatRoom.fromJson(json);
}

/// @nodoc
mixin _$ChatRoom {
  String get id => throw _privateConstructorUsedError;
  String get orderId => throw _privateConstructorUsedError;
  ChatParticipantType get otherParticipantType =>
      throw _privateConstructorUsedError;
  String get otherParticipantId => throw _privateConstructorUsedError;
  String get otherParticipantName => throw _privateConstructorUsedError;
  String? get otherParticipantPhoto => throw _privateConstructorUsedError;
  ChatMessage? get lastMessage => throw _privateConstructorUsedError;
  int get unreadCount => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $ChatRoomCopyWith<ChatRoom> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ChatRoomCopyWith<$Res> {
  factory $ChatRoomCopyWith(ChatRoom value, $Res Function(ChatRoom) then) =
      _$ChatRoomCopyWithImpl<$Res, ChatRoom>;
  @useResult
  $Res call({
    String id,
    String orderId,
    ChatParticipantType otherParticipantType,
    String otherParticipantId,
    String otherParticipantName,
    String? otherParticipantPhoto,
    ChatMessage? lastMessage,
    int unreadCount,
    DateTime createdAt,
    DateTime updatedAt,
  });

  $ChatMessageCopyWith<$Res>? get lastMessage;
}

/// @nodoc
class _$ChatRoomCopyWithImpl<$Res, $Val extends ChatRoom>
    implements $ChatRoomCopyWith<$Res> {
  _$ChatRoomCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? orderId = null,
    Object? otherParticipantType = null,
    Object? otherParticipantId = null,
    Object? otherParticipantName = null,
    Object? otherParticipantPhoto = freezed,
    Object? lastMessage = freezed,
    Object? unreadCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            orderId: null == orderId
                ? _value.orderId
                : orderId // ignore: cast_nullable_to_non_nullable
                      as String,
            otherParticipantType: null == otherParticipantType
                ? _value.otherParticipantType
                : otherParticipantType // ignore: cast_nullable_to_non_nullable
                      as ChatParticipantType,
            otherParticipantId: null == otherParticipantId
                ? _value.otherParticipantId
                : otherParticipantId // ignore: cast_nullable_to_non_nullable
                      as String,
            otherParticipantName: null == otherParticipantName
                ? _value.otherParticipantName
                : otherParticipantName // ignore: cast_nullable_to_non_nullable
                      as String,
            otherParticipantPhoto: freezed == otherParticipantPhoto
                ? _value.otherParticipantPhoto
                : otherParticipantPhoto // ignore: cast_nullable_to_non_nullable
                      as String?,
            lastMessage: freezed == lastMessage
                ? _value.lastMessage
                : lastMessage // ignore: cast_nullable_to_non_nullable
                      as ChatMessage?,
            unreadCount: null == unreadCount
                ? _value.unreadCount
                : unreadCount // ignore: cast_nullable_to_non_nullable
                      as int,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            updatedAt: null == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }

  @override
  @pragma('vm:prefer-inline')
  $ChatMessageCopyWith<$Res>? get lastMessage {
    if (_value.lastMessage == null) {
      return null;
    }

    return $ChatMessageCopyWith<$Res>(_value.lastMessage!, (value) {
      return _then(_value.copyWith(lastMessage: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ChatRoomImplCopyWith<$Res>
    implements $ChatRoomCopyWith<$Res> {
  factory _$$ChatRoomImplCopyWith(
    _$ChatRoomImpl value,
    $Res Function(_$ChatRoomImpl) then,
  ) = __$$ChatRoomImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String orderId,
    ChatParticipantType otherParticipantType,
    String otherParticipantId,
    String otherParticipantName,
    String? otherParticipantPhoto,
    ChatMessage? lastMessage,
    int unreadCount,
    DateTime createdAt,
    DateTime updatedAt,
  });

  @override
  $ChatMessageCopyWith<$Res>? get lastMessage;
}

/// @nodoc
class __$$ChatRoomImplCopyWithImpl<$Res>
    extends _$ChatRoomCopyWithImpl<$Res, _$ChatRoomImpl>
    implements _$$ChatRoomImplCopyWith<$Res> {
  __$$ChatRoomImplCopyWithImpl(
    _$ChatRoomImpl _value,
    $Res Function(_$ChatRoomImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? orderId = null,
    Object? otherParticipantType = null,
    Object? otherParticipantId = null,
    Object? otherParticipantName = null,
    Object? otherParticipantPhoto = freezed,
    Object? lastMessage = freezed,
    Object? unreadCount = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$ChatRoomImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        orderId: null == orderId
            ? _value.orderId
            : orderId // ignore: cast_nullable_to_non_nullable
                  as String,
        otherParticipantType: null == otherParticipantType
            ? _value.otherParticipantType
            : otherParticipantType // ignore: cast_nullable_to_non_nullable
                  as ChatParticipantType,
        otherParticipantId: null == otherParticipantId
            ? _value.otherParticipantId
            : otherParticipantId // ignore: cast_nullable_to_non_nullable
                  as String,
        otherParticipantName: null == otherParticipantName
            ? _value.otherParticipantName
            : otherParticipantName // ignore: cast_nullable_to_non_nullable
                  as String,
        otherParticipantPhoto: freezed == otherParticipantPhoto
            ? _value.otherParticipantPhoto
            : otherParticipantPhoto // ignore: cast_nullable_to_non_nullable
                  as String?,
        lastMessage: freezed == lastMessage
            ? _value.lastMessage
            : lastMessage // ignore: cast_nullable_to_non_nullable
                  as ChatMessage?,
        unreadCount: null == unreadCount
            ? _value.unreadCount
            : unreadCount // ignore: cast_nullable_to_non_nullable
                  as int,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        updatedAt: null == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ChatRoomImpl implements _ChatRoom {
  const _$ChatRoomImpl({
    required this.id,
    required this.orderId,
    required this.otherParticipantType,
    required this.otherParticipantId,
    required this.otherParticipantName,
    this.otherParticipantPhoto,
    this.lastMessage,
    required this.unreadCount,
    required this.createdAt,
    required this.updatedAt,
  });

  factory _$ChatRoomImpl.fromJson(Map<String, dynamic> json) =>
      _$$ChatRoomImplFromJson(json);

  @override
  final String id;
  @override
  final String orderId;
  @override
  final ChatParticipantType otherParticipantType;
  @override
  final String otherParticipantId;
  @override
  final String otherParticipantName;
  @override
  final String? otherParticipantPhoto;
  @override
  final ChatMessage? lastMessage;
  @override
  final int unreadCount;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;

  @override
  String toString() {
    return 'ChatRoom(id: $id, orderId: $orderId, otherParticipantType: $otherParticipantType, otherParticipantId: $otherParticipantId, otherParticipantName: $otherParticipantName, otherParticipantPhoto: $otherParticipantPhoto, lastMessage: $lastMessage, unreadCount: $unreadCount, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ChatRoomImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.orderId, orderId) || other.orderId == orderId) &&
            (identical(other.otherParticipantType, otherParticipantType) ||
                other.otherParticipantType == otherParticipantType) &&
            (identical(other.otherParticipantId, otherParticipantId) ||
                other.otherParticipantId == otherParticipantId) &&
            (identical(other.otherParticipantName, otherParticipantName) ||
                other.otherParticipantName == otherParticipantName) &&
            (identical(other.otherParticipantPhoto, otherParticipantPhoto) ||
                other.otherParticipantPhoto == otherParticipantPhoto) &&
            (identical(other.lastMessage, lastMessage) ||
                other.lastMessage == lastMessage) &&
            (identical(other.unreadCount, unreadCount) ||
                other.unreadCount == unreadCount) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    orderId,
    otherParticipantType,
    otherParticipantId,
    otherParticipantName,
    otherParticipantPhoto,
    lastMessage,
    unreadCount,
    createdAt,
    updatedAt,
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$ChatRoomImplCopyWith<_$ChatRoomImpl> get copyWith =>
      __$$ChatRoomImplCopyWithImpl<_$ChatRoomImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ChatRoomImplToJson(this);
  }
}

abstract class _ChatRoom implements ChatRoom {
  const factory _ChatRoom({
    required final String id,
    required final String orderId,
    required final ChatParticipantType otherParticipantType,
    required final String otherParticipantId,
    required final String otherParticipantName,
    final String? otherParticipantPhoto,
    final ChatMessage? lastMessage,
    required final int unreadCount,
    required final DateTime createdAt,
    required final DateTime updatedAt,
  }) = _$ChatRoomImpl;

  factory _ChatRoom.fromJson(Map<String, dynamic> json) =
      _$ChatRoomImpl.fromJson;

  @override
  String get id;
  @override
  String get orderId;
  @override
  ChatParticipantType get otherParticipantType;
  @override
  String get otherParticipantId;
  @override
  String get otherParticipantName;
  @override
  String? get otherParticipantPhoto;
  @override
  ChatMessage? get lastMessage;
  @override
  int get unreadCount;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;
  @override
  @JsonKey(ignore: true)
  _$$ChatRoomImplCopyWith<_$ChatRoomImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
