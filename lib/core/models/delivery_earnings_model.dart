import 'package:freezed_annotation/freezed_annotation.dart';

part 'delivery_earnings_model.freezed.dart';
part 'delivery_earnings_model.g.dart';

@freeze
class DeliveryEarnings with _$DeliveryEarnings {
  const DeliveryEarnings._();
  factory DeliveryEarnings.fromJson(Map<String, dynamic> json) =>
      _$DeliveryEarningsFromJson(json);

  final double? daily;
  final double? weekly;
  final double? monthly;
  final double? walletBalance;
  final double? incentives;
  final double? bonuses;
  final double? tips;
  final List<DeliveryTransaction>? transactions;
}

@freeze
class DeliveryTransaction with _$DeliveryTransaction {
  const DeliveryTransaction._();
  factory DeliveryTransaction.fromJson(Map<String, dynamic> json) =>
      _$DeliveryTransactionFromJson(json);

  final String? id;
  final String? orderId;
  final double? amount;
  final String? type; // delivery, incentive, bonus, tip, settlement
  final String? status; // pending, completed, failed
  final String? createdAt;
  final String? description;
}
