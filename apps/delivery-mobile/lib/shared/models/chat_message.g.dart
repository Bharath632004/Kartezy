// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_message.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ChatMessageImpl _$$ChatMessageImplFromJson(Map<String, dynamic> json) =>
    _$ChatMessageImpl(
      id: json['id'] as String,
      senderId: json['senderId'] as String,
      senderType: $enumDecode(_$ChatParticipantTypeEnumMap, json['senderType']),
      content: json['content'] as String,
      chatRoomId: json['chatRoomId'] as String,
      metadata: json['metadata'] as Map<String, dynamic>?,
      isRead: json['isRead'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$ChatMessageImplToJson(_$ChatMessageImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'senderId': instance.senderId,
      'senderType': _$ChatParticipantTypeEnumMap[instance.senderType]!,
      'content': instance.content,
      'chatRoomId': instance.chatRoomId,
      'metadata': instance.metadata,
      'isRead': instance.isRead,
      'createdAt': instance.createdAt.toIso8601String(),
    };

const _$ChatParticipantTypeEnumMap = {
  ChatParticipantType.deliveryPartner: 'deliveryPartner',
  ChatParticipantType.customer: 'customer',
  ChatParticipantType.merchant: 'merchant',
  ChatParticipantType.support: 'support',
};

_$ChatRoomImpl _$$ChatRoomImplFromJson(Map<String, dynamic> json) =>
    _$ChatRoomImpl(
      id: json['id'] as String,
      orderId: json['orderId'] as String,
      otherParticipantType: $enumDecode(
        _$ChatParticipantTypeEnumMap,
        json['otherParticipantType'],
      ),
      otherParticipantId: json['otherParticipantId'] as String,
      otherParticipantName: json['otherParticipantName'] as String,
      otherParticipantPhoto: json['otherParticipantPhoto'] as String?,
      lastMessage: json['lastMessage'] == null
          ? null
          : ChatMessage.fromJson(json['lastMessage'] as Map<String, dynamic>),
      unreadCount: (json['unreadCount'] as num).toInt(),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$ChatRoomImplToJson(_$ChatRoomImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'orderId': instance.orderId,
      'otherParticipantType':
          _$ChatParticipantTypeEnumMap[instance.otherParticipantType]!,
      'otherParticipantId': instance.otherParticipantId,
      'otherParticipantName': instance.otherParticipantName,
      'otherParticipantPhoto': instance.otherParticipantPhoto,
      'lastMessage': instance.lastMessage,
      'unreadCount': instance.unreadCount,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
