// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'checkout_summary.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CheckoutSummaryImpl _$$CheckoutSummaryImplFromJson(
        Map<String, dynamic> json) =>
    _$CheckoutSummaryImpl(
      id: json['id'] as String,
      userId: json['userId'] as String?,
      items: (json['items'] as List<dynamic>)
          .map((e) => CartItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      couponCode: json['couponCode'] as String?,
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
    );

Map<String, dynamic> _$$CheckoutSummaryImplToJson(
        _$CheckoutSummaryImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'items': instance.items,
      'couponCode': instance.couponCode,
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
    };
