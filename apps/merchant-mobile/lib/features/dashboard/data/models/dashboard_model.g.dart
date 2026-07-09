// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DashboardModelImpl _$$DashboardModelImplFromJson(Map<String, dynamic> json) =>
    _$DashboardModelImpl(
      todaySales: (json['todaySales'] as num).toDouble(),
      revenue: (json['revenue'] as num).toDouble(),
      orders: (json['orders'] as num).toInt(),
      pendingOrders: (json['pendingOrders'] as num).toInt(),
      cancelledOrders: (json['cancelledOrders'] as num).toInt(),
      visitors: (json['visitors'] as num).toInt(),
      rating: (json['rating'] as num).toDouble(),
    );

Map<String, dynamic> _$$DashboardModelImplToJson(
  _$DashboardModelImpl instance,
) => <String, dynamic>{
  'todaySales': instance.todaySales,
  'revenue': instance.revenue,
  'orders': instance.orders,
  'pendingOrders': instance.pendingOrders,
  'cancelledOrders': instance.cancelledOrders,
  'visitors': instance.visitors,
  'rating': instance.rating,
};
