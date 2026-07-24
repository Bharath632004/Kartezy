import 'package:freezed_annotation/freezed_annotation.dart';

part 'chat_message.freezed.dart';
part 'chat_message.g.dart';

enum ChatParticipantType { deliveryPartner, customer, merchant, support }

@freezed
class ChatMessage with _$ChatMessage {
  const factory ChatMessage({
    required String id,
    required String senderId,
    required ChatParticipantType senderType,
    required String content,
    required String chatRoomId,
    Map<String, dynamic>? metadata,
    required bool isRead,
    required DateTime createdAt,
  }) = _ChatMessage;

  factory ChatMessage.fromJson(Map<String, dynamic> json) =>
      _$ChatMessageFromJson(json);
}

@freezed
class ChatRoom with _$ChatRoom {
  const factory ChatRoom({
    required String id,
    required String orderId,
    required ChatParticipantType otherParticipantType,
    required String otherParticipantId,
    required String otherParticipantName,
    String? otherParticipantPhoto,
    ChatMessage? lastMessage,
    required int unreadCount,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _ChatRoom;

  factory ChatRoom.fromJson(Map<String, dynamic> json) =>
      _$ChatRoomFromJson(json);
}
