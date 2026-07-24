// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delivery_order.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DeliveryOrderImpl _$$DeliveryOrderImplFromJson(Map<String, dynamic> json) =>
    _$DeliveryOrderImpl(
      id: json['id'] as String,
      orderNumber: json['orderNumber'] as String,
      customerName: json['customerName'] as String,
      customerPhone: json['customerPhone'] as String,
      storeName: json['storeName'] as String,
      storePhone: json['storePhone'] as String,
      storeLatitude: (json['storeLatitude'] as num).toDouble(),
      storeLongitude: (json['storeLongitude'] as num).toDouble(),
      deliveryAddress:
          Address.fromJson(json['deliveryAddress'] as Map<String, dynamic>),
      items: (json['items'] as List<dynamic>)
          .map((e) => OrderItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      itemCount: (json['itemCount'] as num).toInt(),
      orderAmount: (json['orderAmount'] as num).toDouble(),
      deliveryFee: (json['deliveryFee'] as num).toDouble(),
      tipAmount: (json['tipAmount'] as num).toDouble(),
      totalEarning: (json['totalEarning'] as num).toDouble(),
      orderStatus: json['orderStatus'] as String,
      phase: $enumDecode(_$DeliveryPhaseEnumMap, json['phase']),
      assignedAt: DateTime.parse(json['assignedAt'] as String),
      estimatedPickupTime:
          DateTime.parse(json['estimatedPickupTime'] as String),
      estimatedDeliveryTime:
          DateTime.parse(json['estimatedDeliveryTime'] as String),
      pickupOtp: json['pickupOtp'] as String?,
      deliveryOtp: json['deliveryOtp'] as String?,
      deliveryInstructions: json['deliveryInstructions'] as String?,
      merchantNotes: json['merchantNotes'] as String?,
      distanceToStore: (json['distanceToStore'] as num?)?.toDouble(),
      distanceToCustomer: (json['distanceToCustomer'] as num?)?.toDouble(),
      etaToStore: json['etaToStore'] == null
          ? null
          : Duration(microseconds: (json['etaToStore'] as num).toInt()),
      etaToCustomer: json['etaToCustomer'] == null
          ? null
          : Duration(microseconds: (json['etaToCustomer'] as num).toInt()),
      isExpress: json['isExpress'] as bool?,
      isStacked: json['isStacked'] as bool?,
      stackedWithOrderId: json['stackedWithOrderId'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$DeliveryOrderImplToJson(_$DeliveryOrderImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'orderNumber': instance.orderNumber,
      'customerName': instance.customerName,
      'customerPhone': instance.customerPhone,
      'storeName': instance.storeName,
      'storePhone': instance.storePhone,
      'storeLatitude': instance.storeLatitude,
      'storeLongitude': instance.storeLongitude,
      'deliveryAddress': instance.deliveryAddress,
      'items': instance.items,
      'itemCount': instance.itemCount,
      'orderAmount': instance.orderAmount,
      'deliveryFee': instance.deliveryFee,
      'tipAmount': instance.tipAmount,
      'totalEarning': instance.totalEarning,
      'orderStatus': instance.orderStatus,
      'phase': _$DeliveryPhaseEnumMap[instance.phase]!,
      'assignedAt': instance.assignedAt.toIso8601String(),
      'estimatedPickupTime': instance.estimatedPickupTime.toIso8601String(),
      'estimatedDeliveryTime': instance.estimatedDeliveryTime.toIso8601String(),
      'pickupOtp': instance.pickupOtp,
      'deliveryOtp': instance.deliveryOtp,
      'deliveryInstructions': instance.deliveryInstructions,
      'merchantNotes': instance.merchantNotes,
      'distanceToStore': instance.distanceToStore,
      'distanceToCustomer': instance.distanceToCustomer,
      'etaToStore': instance.etaToStore?.inMicroseconds,
      'etaToCustomer': instance.etaToCustomer?.inMicroseconds,
      'isExpress': instance.isExpress,
      'isStacked': instance.isStacked,
      'stackedWithOrderId': instance.stackedWithOrderId,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };

const _$DeliveryPhaseEnumMap = {
  DeliveryPhase.assigned: 'assigned',
  DeliveryPhase.navigatingToStore: 'navigatingToStore',
  DeliveryPhase.atStore: 'atStore',
  DeliveryPhase.pickedUp: 'pickedUp',
  DeliveryPhase.navigatingToCustomer: 'navigatingToCustomer',
  DeliveryPhase.atCustomer: 'atCustomer',
  DeliveryPhase.delivered: 'delivered',
  DeliveryPhase.failed: 'failed',
};
