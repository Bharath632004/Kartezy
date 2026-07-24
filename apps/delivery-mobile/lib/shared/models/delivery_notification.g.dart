// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delivery_notification.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DeliveryNotificationItemImpl _$$DeliveryNotificationItemImplFromJson(
  Map<String, dynamic> json,
) => _$DeliveryNotificationItemImpl(
  id: json['id'] as String,
  title: json['title'] as String,
  body: json['body'] as String,
  category: $enumDecode(_$NotificationCategoryEnumMap, json['category']),
  priority: $enumDecode(_$NotificationPriorityEnumMap, json['priority']),
  data: json['data'] as Map<String, dynamic>?,
  isRead: json['isRead'] as bool,
  createdAt: DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$$DeliveryNotificationItemImplToJson(
  _$DeliveryNotificationItemImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'body': instance.body,
  'category': _$NotificationCategoryEnumMap[instance.category]!,
  'priority': _$NotificationPriorityEnumMap[instance.priority]!,
  'data': instance.data,
  'isRead': instance.isRead,
  'createdAt': instance.createdAt.toIso8601String(),
};

const _$NotificationCategoryEnumMap = {
  NotificationCategory.order: 'order',
  NotificationCategory.earnings: 'earnings',
  NotificationCategory.wallet: 'wallet',
  NotificationCategory.performance: 'performance',
  NotificationCategory.support: 'support',
  NotificationCategory.announcement: 'announcement',
  NotificationCategory.safety: 'safety',
  NotificationCategory.system: 'system',
};

const _$NotificationPriorityEnumMap = {
  NotificationPriority.low: 'low',
  NotificationPriority.normal: 'normal',
  NotificationPriority.high: 'high',
  NotificationPriority.urgent: 'urgent',
};
