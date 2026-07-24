// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'support_ticket.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$SupportTicketImpl _$$SupportTicketImplFromJson(Map<String, dynamic> json) =>
    _$SupportTicketImpl(
      id: json['id'] as String,
      partnerId: json['partnerId'] as String,
      subject: json['subject'] as String,
      description: json['description'] as String,
      category: $enumDecode(_$TicketCategoryEnumMap, json['category']),
      status: $enumDecode(_$TicketStatusEnumMap, json['status']),
      orderId: json['orderId'] as String?,
      attachmentUrls: (json['attachmentUrls'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      assignedTo: json['assignedTo'] as String?,
      resolution: json['resolution'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
      resolvedAt: json['resolvedAt'] == null
          ? null
          : DateTime.parse(json['resolvedAt'] as String),
    );

Map<String, dynamic> _$$SupportTicketImplToJson(_$SupportTicketImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'partnerId': instance.partnerId,
      'subject': instance.subject,
      'description': instance.description,
      'category': _$TicketCategoryEnumMap[instance.category]!,
      'status': _$TicketStatusEnumMap[instance.status]!,
      'orderId': instance.orderId,
      'attachmentUrls': instance.attachmentUrls,
      'assignedTo': instance.assignedTo,
      'resolution': instance.resolution,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'resolvedAt': instance.resolvedAt?.toIso8601String(),
    };

const _$TicketCategoryEnumMap = {
  TicketCategory.orderIssue: 'orderIssue',
  TicketCategory.paymentIssue: 'paymentIssue',
  TicketCategory.vehicleBreakdown: 'vehicleBreakdown',
  TicketCategory.accident: 'accident',
  TicketCategory.customerIssue: 'customerIssue',
  TicketCategory.merchantIssue: 'merchantIssue',
  TicketCategory.appIssue: 'appIssue',
  TicketCategory.other: 'other',
};

const _$TicketStatusEnumMap = {
  TicketStatus.open: 'open',
  TicketStatus.inProgress: 'inProgress',
  TicketStatus.resolved: 'resolved',
  TicketStatus.closed: 'closed',
};
