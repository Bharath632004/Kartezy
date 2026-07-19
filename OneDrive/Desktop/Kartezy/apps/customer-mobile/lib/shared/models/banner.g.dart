// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'banner.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$BannerImpl _$$BannerImplFromJson(Map<String, dynamic> json) => _$BannerImpl(
      id: json['id'] as String,
      imageUrl: json['imageUrl'] as String,
      targetUrl: json['targetUrl'] as String,
      targetType: json['targetType'] as String?,
      title: json['title'] as String?,
    );

Map<String, dynamic> _$$BannerImplToJson(_$BannerImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'imageUrl': instance.imageUrl,
      'targetUrl': instance.targetUrl,
      'targetType': instance.targetType,
      'title': instance.title,
    };
