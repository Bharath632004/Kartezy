// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'driver_info.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DriverInfoImpl _$$DriverInfoImplFromJson(Map<String, dynamic> json) =>
    _$DriverInfoImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      photoUrl: json['photoUrl'] as String?,
      vehicleNumber: json['vehicleNumber'] as String,
      vehicleType: json['vehicleType'] as String,
      rating: (json['rating'] as num).toDouble(),
      phoneNumber: json['phoneNumber'] as String,
    );

Map<String, dynamic> _$$DriverInfoImplToJson(_$DriverInfoImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'photoUrl': instance.photoUrl,
      'vehicleNumber': instance.vehicleNumber,
      'vehicleType': instance.vehicleType,
      'rating': instance.rating,
      'phoneNumber': instance.phoneNumber,
    };
