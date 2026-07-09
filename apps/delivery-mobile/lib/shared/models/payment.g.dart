// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'payment.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PaymentImpl _$$PaymentImplFromJson(Map<String, dynamic> json) =>
    _$PaymentImpl(
      id: json['id'] as String,
      orderId: json['orderId'] as String,
      userId: json['userId'] as String,
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] as String,
      paymentMethod: json['paymentMethod'] as String,
      paymentStatus: json['paymentStatus'] as String,
      transactionId: json['transactionId'] as String?,
      gatewayResponse: json['gatewayResponse'] as String?,
      initiatedAt: DateTime.parse(json['initiatedAt'] as String),
      completedAt: json['completedAt'] == null
          ? null
          : DateTime.parse(json['completedAt'] as String),
      isEscrow: json['isEscrow'] as bool,
    );

Map<String, dynamic> _$$PaymentImplToJson(_$PaymentImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'orderId': instance.orderId,
      'userId': instance.userId,
      'amount': instance.amount,
      'currency': instance.currency,
      'paymentMethod': instance.paymentMethod,
      'paymentStatus': instance.paymentStatus,
      'transactionId': instance.transactionId,
      'gatewayResponse': instance.gatewayResponse,
      'initiatedAt': instance.initiatedAt.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'isEscrow': instance.isEscrow,
    };
