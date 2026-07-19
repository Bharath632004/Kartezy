// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dashboard_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DashboardModelImpl _$$DashboardModelImplFromJson(Map<String, dynamic> json) =>
    _$DashboardModelImpl(
      todaySales: (json['todaySales'] as num).toDouble(),
      todayEarnings: (json['todayEarnings'] as num).toDouble(),
      todayOrders: (json['todayOrders'] as num).toInt(),
      pendingOrders: (json['pendingOrders'] as num).toInt(),
      processingOrders: (json['processingOrders'] as num).toInt(),
      packedOrders: (json['packedOrders'] as num).toInt(),
      readyOrders: (json['readyOrders'] as num).toInt(),
      deliveredOrders: (json['deliveredOrders'] as num).toInt(),
      cancelledOrders: (json['cancelledOrders'] as num).toInt(),
      refundRequests: (json['refundRequests'] as num).toInt(),
      replacementRequests: (json['replacementRequests'] as num).toInt(),
      lowStockItems: (json['lowStockItems'] as num).toInt(),
      outOfStockItems: (json['outOfStockItems'] as num).toInt(),
      topSellingProducts: (json['topSellingProducts'] as List<dynamic>)
          .map((e) => TopProduct.fromJson(e as Map<String, dynamic>))
          .toList(),
      trendingProducts: (json['trendingProducts'] as List<dynamic>)
          .map((e) => TrendingProduct.fromJson(e as Map<String, dynamic>))
          .toList(),
      lowSellingProducts: (json['lowSellingProducts'] as List<dynamic>)
          .map((e) => LowSellingProduct.fromJson(e as Map<String, dynamic>))
          .toList(),
      totalRevenue: (json['totalRevenue'] as num).toDouble(),
      walletBalance: (json['walletBalance'] as num?)?.toDouble(),
      settlementAmount: (json['settlementAmount'] as num?)?.toDouble(),
      nextSettlementDate: json['nextSettlementDate'] as String?,
      storeRating: (json['storeRating'] as num).toDouble(),
      totalReviews: (json['totalReviews'] as num?)?.toInt(),
      averageRating: (json['averageRating'] as num?)?.toDouble(),
      visitors: (json['visitors'] as num).toInt(),
      conversionRate: (json['conversionRate'] as num).toDouble(),
      averageOrderValue: (json['averageOrderValue'] as num).toDouble(),
    );

Map<String, dynamic> _$$DashboardModelImplToJson(
  _$DashboardModelImpl instance,
) => <String, dynamic>{
  'todaySales': instance.todaySales,
  'todayEarnings': instance.todayEarnings,
  'todayOrders': instance.todayOrders,
  'pendingOrders': instance.pendingOrders,
  'processingOrders': instance.processingOrders,
  'packedOrders': instance.packedOrders,
  'readyOrders': instance.readyOrders,
  'deliveredOrders': instance.deliveredOrders,
  'cancelledOrders': instance.cancelledOrders,
  'refundRequests': instance.refundRequests,
  'replacementRequests': instance.replacementRequests,
  'lowStockItems': instance.lowStockItems,
  'outOfStockItems': instance.outOfStockItems,
  'topSellingProducts': instance.topSellingProducts,
  'trendingProducts': instance.trendingProducts,
  'lowSellingProducts': instance.lowSellingProducts,
  'totalRevenue': instance.totalRevenue,
  'walletBalance': instance.walletBalance,
  'settlementAmount': instance.settlementAmount,
  'nextSettlementDate': instance.nextSettlementDate,
  'storeRating': instance.storeRating,
  'totalReviews': instance.totalReviews,
  'averageRating': instance.averageRating,
  'visitors': instance.visitors,
  'conversionRate': instance.conversionRate,
  'averageOrderValue': instance.averageOrderValue,
};

_$TopProductImpl _$$TopProductImplFromJson(Map<String, dynamic> json) =>
    _$TopProductImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      unitsSold: (json['unitsSold'] as num).toInt(),
      revenue: (json['revenue'] as num).toDouble(),
    );

Map<String, dynamic> _$$TopProductImplToJson(_$TopProductImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'unitsSold': instance.unitsSold,
      'revenue': instance.revenue,
    };

_$TrendingProductImpl _$$TrendingProductImplFromJson(
  Map<String, dynamic> json,
) => _$TrendingProductImpl(
  id: json['id'] as String,
  name: json['name'] as String,
  views: (json['views'] as num).toInt(),
  orders: (json['orders'] as num).toInt(),
);

Map<String, dynamic> _$$TrendingProductImplToJson(
  _$TrendingProductImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'views': instance.views,
  'orders': instance.orders,
};

_$LowSellingProductImpl _$$LowSellingProductImplFromJson(
  Map<String, dynamic> json,
) => _$LowSellingProductImpl(
  id: json['id'] as String,
  name: json['name'] as String,
  unitsSold: (json['unitsSold'] as num).toInt(),
  daysInInventory: (json['daysInInventory'] as num).toInt(),
);

Map<String, dynamic> _$$LowSellingProductImplToJson(
  _$LowSellingProductImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'unitsSold': instance.unitsSold,
  'daysInInventory': instance.daysInInventory,
};
