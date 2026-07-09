// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$OrderImpl _$$OrderImplFromJson(Map<String, dynamic> json) => _$OrderImpl(
      id: json['id'] as String,
      userId: json['userId'] as String?,
      cartId: json['cartId'] as String,
      items: (json['items'] as List<dynamic>)
          .map((e) => CartItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      discountAmount: (json['discountAmount'] as num).toDouble(),
      totalAmount: (json['totalAmount'] as num).toDouble(),
      itemCount: (json['itemCount'] as num).toInt(),
      platformFee: (json['platformFee'] as num).toDouble(),
      deliveryCharges: (json['deliveryCharges'] as num).toDouble(),
      packagingFee: (json['packagingFee'] as num).toDouble(),
      gstAmount: (json['gstAmount'] as num).toDouble(),
      tipAmount: (json['tipAmount'] as num).toDouble(),
      walletAmount: (json['walletAmount'] as num).toDouble(),
      netAmount: (json['netAmount'] as num).toDouble(),
      deliveryAddress:
          Address.fromJson(json['deliveryAddress'] as Map<String, dynamic>),
      billingAddress: json['billingAddress'] == null
          ? null
          : Address.fromJson(json['billingAddress'] as Map<String, dynamic>),
      orderStatus: json['orderStatus'] as String,
      paymentStatus: json['paymentStatus'] as String,
      paymentMethod: json['paymentMethod'] as String?,
      deliveryInstructions: json['deliveryInstructions'] as String?,
      contactlessDelivery: json['contactlessDelivery'] as bool,
      deliverySlotStart: json['deliverySlotStart'] == null
          ? null
          : DateTime.parse(json['deliverySlotStart'] as String),
      deliverySlotEnd: json['deliverySlotEnd'] == null
          ? null
          : DateTime.parse(json['deliverySlotEnd'] as String),
      estimatedDeliveryTime:
          DateTime.parse(json['estimatedDeliveryTime'] as String),
      couponCode: json['couponCode'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$OrderImplToJson(_$OrderImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'cartId': instance.cartId,
      'items': instance.items,
      'discountAmount': instance.discountAmount,
      'totalAmount': instance.totalAmount,
      'itemCount': instance.itemCount,
      'platformFee': instance.platformFee,
      'deliveryCharges': instance.deliveryCharges,
      'packagingFee': instance.packagingFee,
      'gstAmount': instance.gstAmount,
      'tipAmount': instance.tipAmount,
      'walletAmount': instance.walletAmount,
      'netAmount': instance.netAmount,
      'deliveryAddress': instance.deliveryAddress,
      'billingAddress': instance.billingAddress,
      'orderStatus': instance.orderStatus,
      'paymentStatus': instance.paymentStatus,
      'paymentMethod': instance.paymentMethod,
      'deliveryInstructions': instance.deliveryInstructions,
      'contactlessDelivery': instance.contactlessDelivery,
      'deliverySlotStart': instance.deliverySlotStart?.toIso8601String(),
      'deliverySlotEnd': instance.deliverySlotEnd?.toIso8601String(),
      'estimatedDeliveryTime': instance.estimatedDeliveryTime.toIso8601String(),
      'couponCode': instance.couponCode,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
