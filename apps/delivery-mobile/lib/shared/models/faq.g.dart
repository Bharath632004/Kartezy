// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'faq.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$FaqItemImpl _$$FaqItemImplFromJson(Map<String, dynamic> json) =>
    _$FaqItemImpl(
      id: json['id'] as String,
      question: json['question'] as String,
      answer: json['answer'] as String,
      category: json['category'] as String,
      sortOrder: (json['sortOrder'] as num?)?.toInt(),
    );

Map<String, dynamic> _$$FaqItemImplToJson(_$FaqItemImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'question': instance.question,
      'answer': instance.answer,
      'category': instance.category,
      'sortOrder': instance.sortOrder,
    };

_$TrustedContactImpl _$$TrustedContactImplFromJson(Map<String, dynamic> json) =>
    _$TrustedContactImpl(
      id: json['id'] as String,
      partnerId: json['partnerId'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
      relationship: json['relationship'] as String?,
      isActive: json['isActive'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$TrustedContactImplToJson(
  _$TrustedContactImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'partnerId': instance.partnerId,
  'name': instance.name,
  'phone': instance.phone,
  'relationship': instance.relationship,
  'isActive': instance.isActive,
  'createdAt': instance.createdAt.toIso8601String(),
};

_$IncidentReportImpl _$$IncidentReportImplFromJson(Map<String, dynamic> json) =>
    _$IncidentReportImpl(
      id: json['id'] as String,
      partnerId: json['partnerId'] as String,
      type: json['type'] as String,
      description: json['description'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      orderId: json['orderId'] as String?,
      imageUrls: (json['imageUrls'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList(),
      status: json['status'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$IncidentReportImplToJson(
  _$IncidentReportImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'partnerId': instance.partnerId,
  'type': instance.type,
  'description': instance.description,
  'latitude': instance.latitude,
  'longitude': instance.longitude,
  'orderId': instance.orderId,
  'imageUrls': instance.imageUrls,
  'status': instance.status,
  'createdAt': instance.createdAt.toIso8601String(),
};
