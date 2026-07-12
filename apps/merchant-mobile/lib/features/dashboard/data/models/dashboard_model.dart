import 'package:freezed_annotation/freezed_annotation.dart';

part 'dashboard_model.freezed.dart';
part 'dashboard_model.g.dart';

@freezed
class DashboardModel with _$DashboardModel {
  const factory DashboardModel({
    // Today's overview
    required double todaySales,
    required double todayEarnings,
    required int todayOrders,

    // Order status
    required int pendingOrders,
    required int processingOrders,
    required int packedOrders,
    required int readyOrders,
    required int deliveredOrders,
    required int cancelledOrders,
    required int refundRequests,
    required int replacementRequests,

    // Inventory alerts
    required int lowStockItems,
    required int outOfStockItems,

    // Top products
    required List<TopProduct> topSellingProducts,
    required List<TrendingProduct> trendingProducts,
    required List<LowSellingProduct> lowSellingProducts,

    // Financials
    required double totalRevenue,
    double? walletBalance,
    double? settlementAmount,
    String? nextSettlementDate,

    // Ratings & Reviews
    required double storeRating,
    int? totalReviews,
    double? averageRating,

    // Visitors & Conversion
    required int visitors,
    required double conversionRate,

    // Average order value
    required double averageOrderValue,
  }) = _DashboardModel;

  factory DashboardModel.fromJson(Map<String, dynamic> json) =>
      _$DashboardModelFromJson(json);
}

@freezed
class TopProduct with _$TopProduct {
  const factory TopProduct({
    required String id,
    required String name,
    required int unitsSold,
    required double revenue,
  }) = _TopProduct;

  factory TopProduct.fromJson(Map<String, dynamic> json) =>
      _$TopProductFromJson(json);
}

@freezed
class TrendingProduct with _$TrendingProduct {
  const factory TrendingProduct({
    required String id,
    required String name,
    required int views,
    required int orders,
  }) = _TrendingProduct;

  factory TrendingProduct.fromJson(Map<String, dynamic> json) =>
      _$TrendingProductFromJson(json);
}

@freezed
class LowSellingProduct with _$LowSellingProduct {
  const factory LowSellingProduct({
    required String id,
    required String name,
    required int unitsSold,
    required int daysInInventory,
  }) = _LowSellingProduct;

  factory LowSellingProduct.fromJson(Map<String, dynamic> json) =>
      _$LowSellingProductFromJson(json);
}