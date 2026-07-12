// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'dashboard_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

DashboardModel _$DashboardModelFromJson(Map<String, dynamic> json) {
  return _DashboardModel.fromJson(json);
}

/// @nodoc
mixin _$DashboardModel {
  // Today's overview
  double get todaySales => throw _privateConstructorUsedError;
  double get todayEarnings => throw _privateConstructorUsedError;
  int get todayOrders => throw _privateConstructorUsedError; // Order status
  int get pendingOrders => throw _privateConstructorUsedError;
  int get processingOrders => throw _privateConstructorUsedError;
  int get packedOrders => throw _privateConstructorUsedError;
  int get readyOrders => throw _privateConstructorUsedError;
  int get deliveredOrders => throw _privateConstructorUsedError;
  int get cancelledOrders => throw _privateConstructorUsedError;
  int get refundRequests => throw _privateConstructorUsedError;
  int get replacementRequests =>
      throw _privateConstructorUsedError; // Inventory alerts
  int get lowStockItems => throw _privateConstructorUsedError;
  int get outOfStockItems => throw _privateConstructorUsedError; // Top products
  List<TopProduct> get topSellingProducts => throw _privateConstructorUsedError;
  List<TrendingProduct> get trendingProducts =>
      throw _privateConstructorUsedError;
  List<LowSellingProduct> get lowSellingProducts =>
      throw _privateConstructorUsedError; // Financials
  double get totalRevenue => throw _privateConstructorUsedError;
  double? get walletBalance => throw _privateConstructorUsedError;
  double? get settlementAmount => throw _privateConstructorUsedError;
  String? get nextSettlementDate =>
      throw _privateConstructorUsedError; // Ratings & Reviews
  double get storeRating => throw _privateConstructorUsedError;
  int? get totalReviews => throw _privateConstructorUsedError;
  double? get averageRating =>
      throw _privateConstructorUsedError; // Visitors & Conversion
  int get visitors => throw _privateConstructorUsedError;
  double get conversionRate =>
      throw _privateConstructorUsedError; // Average order value
  double get averageOrderValue => throw _privateConstructorUsedError;

  /// Serializes this DashboardModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DashboardModelCopyWith<DashboardModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DashboardModelCopyWith<$Res> {
  factory $DashboardModelCopyWith(
    DashboardModel value,
    $Res Function(DashboardModel) then,
  ) = _$DashboardModelCopyWithImpl<$Res, DashboardModel>;
  @useResult
  $Res call({
    double todaySales,
    double todayEarnings,
    int todayOrders,
    int pendingOrders,
    int processingOrders,
    int packedOrders,
    int readyOrders,
    int deliveredOrders,
    int cancelledOrders,
    int refundRequests,
    int replacementRequests,
    int lowStockItems,
    int outOfStockItems,
    List<TopProduct> topSellingProducts,
    List<TrendingProduct> trendingProducts,
    List<LowSellingProduct> lowSellingProducts,
    double totalRevenue,
    double? walletBalance,
    double? settlementAmount,
    String? nextSettlementDate,
    double storeRating,
    int? totalReviews,
    double? averageRating,
    int visitors,
    double conversionRate,
    double averageOrderValue,
  });
}

/// @nodoc
class _$DashboardModelCopyWithImpl<$Res, $Val extends DashboardModel>
    implements $DashboardModelCopyWith<$Res> {
  _$DashboardModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? todaySales = null,
    Object? todayEarnings = null,
    Object? todayOrders = null,
    Object? pendingOrders = null,
    Object? processingOrders = null,
    Object? packedOrders = null,
    Object? readyOrders = null,
    Object? deliveredOrders = null,
    Object? cancelledOrders = null,
    Object? refundRequests = null,
    Object? replacementRequests = null,
    Object? lowStockItems = null,
    Object? outOfStockItems = null,
    Object? topSellingProducts = null,
    Object? trendingProducts = null,
    Object? lowSellingProducts = null,
    Object? totalRevenue = null,
    Object? walletBalance = freezed,
    Object? settlementAmount = freezed,
    Object? nextSettlementDate = freezed,
    Object? storeRating = null,
    Object? totalReviews = freezed,
    Object? averageRating = freezed,
    Object? visitors = null,
    Object? conversionRate = null,
    Object? averageOrderValue = null,
  }) {
    return _then(
      _value.copyWith(
            todaySales: null == todaySales
                ? _value.todaySales
                : todaySales // ignore: cast_nullable_to_non_nullable
                      as double,
            todayEarnings: null == todayEarnings
                ? _value.todayEarnings
                : todayEarnings // ignore: cast_nullable_to_non_nullable
                      as double,
            todayOrders: null == todayOrders
                ? _value.todayOrders
                : todayOrders // ignore: cast_nullable_to_non_nullable
                      as int,
            pendingOrders: null == pendingOrders
                ? _value.pendingOrders
                : pendingOrders // ignore: cast_nullable_to_non_nullable
                      as int,
            processingOrders: null == processingOrders
                ? _value.processingOrders
                : processingOrders // ignore: cast_nullable_to_non_nullable
                      as int,
            packedOrders: null == packedOrders
                ? _value.packedOrders
                : packedOrders // ignore: cast_nullable_to_non_nullable
                      as int,
            readyOrders: null == readyOrders
                ? _value.readyOrders
                : readyOrders // ignore: cast_nullable_to_non_nullable
                      as int,
            deliveredOrders: null == deliveredOrders
                ? _value.deliveredOrders
                : deliveredOrders // ignore: cast_nullable_to_non_nullable
                      as int,
            cancelledOrders: null == cancelledOrders
                ? _value.cancelledOrders
                : cancelledOrders // ignore: cast_nullable_to_non_nullable
                      as int,
            refundRequests: null == refundRequests
                ? _value.refundRequests
                : refundRequests // ignore: cast_nullable_to_non_nullable
                      as int,
            replacementRequests: null == replacementRequests
                ? _value.replacementRequests
                : replacementRequests // ignore: cast_nullable_to_non_nullable
                      as int,
            lowStockItems: null == lowStockItems
                ? _value.lowStockItems
                : lowStockItems // ignore: cast_nullable_to_non_nullable
                      as int,
            outOfStockItems: null == outOfStockItems
                ? _value.outOfStockItems
                : outOfStockItems // ignore: cast_nullable_to_non_nullable
                      as int,
            topSellingProducts: null == topSellingProducts
                ? _value.topSellingProducts
                : topSellingProducts // ignore: cast_nullable_to_non_nullable
                      as List<TopProduct>,
            trendingProducts: null == trendingProducts
                ? _value.trendingProducts
                : trendingProducts // ignore: cast_nullable_to_non_nullable
                      as List<TrendingProduct>,
            lowSellingProducts: null == lowSellingProducts
                ? _value.lowSellingProducts
                : lowSellingProducts // ignore: cast_nullable_to_non_nullable
                      as List<LowSellingProduct>,
            totalRevenue: null == totalRevenue
                ? _value.totalRevenue
                : totalRevenue // ignore: cast_nullable_to_non_nullable
                      as double,
            walletBalance: freezed == walletBalance
                ? _value.walletBalance
                : walletBalance // ignore: cast_nullable_to_non_nullable
                      as double?,
            settlementAmount: freezed == settlementAmount
                ? _value.settlementAmount
                : settlementAmount // ignore: cast_nullable_to_non_nullable
                      as double?,
            nextSettlementDate: freezed == nextSettlementDate
                ? _value.nextSettlementDate
                : nextSettlementDate // ignore: cast_nullable_to_non_nullable
                      as String?,
            storeRating: null == storeRating
                ? _value.storeRating
                : storeRating // ignore: cast_nullable_to_non_nullable
                      as double,
            totalReviews: freezed == totalReviews
                ? _value.totalReviews
                : totalReviews // ignore: cast_nullable_to_non_nullable
                      as int?,
            averageRating: freezed == averageRating
                ? _value.averageRating
                : averageRating // ignore: cast_nullable_to_non_nullable
                      as double?,
            visitors: null == visitors
                ? _value.visitors
                : visitors // ignore: cast_nullable_to_non_nullable
                      as int,
            conversionRate: null == conversionRate
                ? _value.conversionRate
                : conversionRate // ignore: cast_nullable_to_non_nullable
                      as double,
            averageOrderValue: null == averageOrderValue
                ? _value.averageOrderValue
                : averageOrderValue // ignore: cast_nullable_to_non_nullable
                      as double,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DashboardModelImplCopyWith<$Res>
    implements $DashboardModelCopyWith<$Res> {
  factory _$$DashboardModelImplCopyWith(
    _$DashboardModelImpl value,
    $Res Function(_$DashboardModelImpl) then,
  ) = __$$DashboardModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    double todaySales,
    double todayEarnings,
    int todayOrders,
    int pendingOrders,
    int processingOrders,
    int packedOrders,
    int readyOrders,
    int deliveredOrders,
    int cancelledOrders,
    int refundRequests,
    int replacementRequests,
    int lowStockItems,
    int outOfStockItems,
    List<TopProduct> topSellingProducts,
    List<TrendingProduct> trendingProducts,
    List<LowSellingProduct> lowSellingProducts,
    double totalRevenue,
    double? walletBalance,
    double? settlementAmount,
    String? nextSettlementDate,
    double storeRating,
    int? totalReviews,
    double? averageRating,
    int visitors,
    double conversionRate,
    double averageOrderValue,
  });
}

/// @nodoc
class __$$DashboardModelImplCopyWithImpl<$Res>
    extends _$DashboardModelCopyWithImpl<$Res, _$DashboardModelImpl>
    implements _$$DashboardModelImplCopyWith<$Res> {
  __$$DashboardModelImplCopyWithImpl(
    _$DashboardModelImpl _value,
    $Res Function(_$DashboardModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of DashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? todaySales = null,
    Object? todayEarnings = null,
    Object? todayOrders = null,
    Object? pendingOrders = null,
    Object? processingOrders = null,
    Object? packedOrders = null,
    Object? readyOrders = null,
    Object? deliveredOrders = null,
    Object? cancelledOrders = null,
    Object? refundRequests = null,
    Object? replacementRequests = null,
    Object? lowStockItems = null,
    Object? outOfStockItems = null,
    Object? topSellingProducts = null,
    Object? trendingProducts = null,
    Object? lowSellingProducts = null,
    Object? totalRevenue = null,
    Object? walletBalance = freezed,
    Object? settlementAmount = freezed,
    Object? nextSettlementDate = freezed,
    Object? storeRating = null,
    Object? totalReviews = freezed,
    Object? averageRating = freezed,
    Object? visitors = null,
    Object? conversionRate = null,
    Object? averageOrderValue = null,
  }) {
    return _then(
      _$DashboardModelImpl(
        todaySales: null == todaySales
            ? _value.todaySales
            : todaySales // ignore: cast_nullable_to_non_nullable
                  as double,
        todayEarnings: null == todayEarnings
            ? _value.todayEarnings
            : todayEarnings // ignore: cast_nullable_to_non_nullable
                  as double,
        todayOrders: null == todayOrders
            ? _value.todayOrders
            : todayOrders // ignore: cast_nullable_to_non_nullable
                  as int,
        pendingOrders: null == pendingOrders
            ? _value.pendingOrders
            : pendingOrders // ignore: cast_nullable_to_non_nullable
                  as int,
        processingOrders: null == processingOrders
            ? _value.processingOrders
            : processingOrders // ignore: cast_nullable_to_non_nullable
                  as int,
        packedOrders: null == packedOrders
            ? _value.packedOrders
            : packedOrders // ignore: cast_nullable_to_non_nullable
                  as int,
        readyOrders: null == readyOrders
            ? _value.readyOrders
            : readyOrders // ignore: cast_nullable_to_non_nullable
                  as int,
        deliveredOrders: null == deliveredOrders
            ? _value.deliveredOrders
            : deliveredOrders // ignore: cast_nullable_to_non_nullable
                  as int,
        cancelledOrders: null == cancelledOrders
            ? _value.cancelledOrders
            : cancelledOrders // ignore: cast_nullable_to_non_nullable
                  as int,
        refundRequests: null == refundRequests
            ? _value.refundRequests
            : refundRequests // ignore: cast_nullable_to_non_nullable
                  as int,
        replacementRequests: null == replacementRequests
            ? _value.replacementRequests
            : replacementRequests // ignore: cast_nullable_to_non_nullable
                  as int,
        lowStockItems: null == lowStockItems
            ? _value.lowStockItems
            : lowStockItems // ignore: cast_nullable_to_non_nullable
                  as int,
        outOfStockItems: null == outOfStockItems
            ? _value.outOfStockItems
            : outOfStockItems // ignore: cast_nullable_to_non_nullable
                  as int,
        topSellingProducts: null == topSellingProducts
            ? _value._topSellingProducts
            : topSellingProducts // ignore: cast_nullable_to_non_nullable
                  as List<TopProduct>,
        trendingProducts: null == trendingProducts
            ? _value._trendingProducts
            : trendingProducts // ignore: cast_nullable_to_non_nullable
                  as List<TrendingProduct>,
        lowSellingProducts: null == lowSellingProducts
            ? _value._lowSellingProducts
            : lowSellingProducts // ignore: cast_nullable_to_non_nullable
                  as List<LowSellingProduct>,
        totalRevenue: null == totalRevenue
            ? _value.totalRevenue
            : totalRevenue // ignore: cast_nullable_to_non_nullable
                  as double,
        walletBalance: freezed == walletBalance
            ? _value.walletBalance
            : walletBalance // ignore: cast_nullable_to_non_nullable
                  as double?,
        settlementAmount: freezed == settlementAmount
            ? _value.settlementAmount
            : settlementAmount // ignore: cast_nullable_to_non_nullable
                  as double?,
        nextSettlementDate: freezed == nextSettlementDate
            ? _value.nextSettlementDate
            : nextSettlementDate // ignore: cast_nullable_to_non_nullable
                  as String?,
        storeRating: null == storeRating
            ? _value.storeRating
            : storeRating // ignore: cast_nullable_to_non_nullable
                  as double,
        totalReviews: freezed == totalReviews
            ? _value.totalReviews
            : totalReviews // ignore: cast_nullable_to_non_nullable
                  as int?,
        averageRating: freezed == averageRating
            ? _value.averageRating
            : averageRating // ignore: cast_nullable_to_non_nullable
                  as double?,
        visitors: null == visitors
            ? _value.visitors
            : visitors // ignore: cast_nullable_to_non_nullable
                  as int,
        conversionRate: null == conversionRate
            ? _value.conversionRate
            : conversionRate // ignore: cast_nullable_to_non_nullable
                  as double,
        averageOrderValue: null == averageOrderValue
            ? _value.averageOrderValue
            : averageOrderValue // ignore: cast_nullable_to_non_nullable
                  as double,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$DashboardModelImpl implements _DashboardModel {
  const _$DashboardModelImpl({
    required this.todaySales,
    required this.todayEarnings,
    required this.todayOrders,
    required this.pendingOrders,
    required this.processingOrders,
    required this.packedOrders,
    required this.readyOrders,
    required this.deliveredOrders,
    required this.cancelledOrders,
    required this.refundRequests,
    required this.replacementRequests,
    required this.lowStockItems,
    required this.outOfStockItems,
    required final List<TopProduct> topSellingProducts,
    required final List<TrendingProduct> trendingProducts,
    required final List<LowSellingProduct> lowSellingProducts,
    required this.totalRevenue,
    this.walletBalance,
    this.settlementAmount,
    this.nextSettlementDate,
    required this.storeRating,
    this.totalReviews,
    this.averageRating,
    required this.visitors,
    required this.conversionRate,
    required this.averageOrderValue,
  }) : _topSellingProducts = topSellingProducts,
       _trendingProducts = trendingProducts,
       _lowSellingProducts = lowSellingProducts;

  factory _$DashboardModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$DashboardModelImplFromJson(json);

  // Today's overview
  @override
  final double todaySales;
  @override
  final double todayEarnings;
  @override
  final int todayOrders;
  // Order status
  @override
  final int pendingOrders;
  @override
  final int processingOrders;
  @override
  final int packedOrders;
  @override
  final int readyOrders;
  @override
  final int deliveredOrders;
  @override
  final int cancelledOrders;
  @override
  final int refundRequests;
  @override
  final int replacementRequests;
  // Inventory alerts
  @override
  final int lowStockItems;
  @override
  final int outOfStockItems;
  // Top products
  final List<TopProduct> _topSellingProducts;
  // Top products
  @override
  List<TopProduct> get topSellingProducts {
    if (_topSellingProducts is EqualUnmodifiableListView)
      return _topSellingProducts;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_topSellingProducts);
  }

  final List<TrendingProduct> _trendingProducts;
  @override
  List<TrendingProduct> get trendingProducts {
    if (_trendingProducts is EqualUnmodifiableListView)
      return _trendingProducts;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_trendingProducts);
  }

  final List<LowSellingProduct> _lowSellingProducts;
  @override
  List<LowSellingProduct> get lowSellingProducts {
    if (_lowSellingProducts is EqualUnmodifiableListView)
      return _lowSellingProducts;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_lowSellingProducts);
  }

  // Financials
  @override
  final double totalRevenue;
  @override
  final double? walletBalance;
  @override
  final double? settlementAmount;
  @override
  final String? nextSettlementDate;
  // Ratings & Reviews
  @override
  final double storeRating;
  @override
  final int? totalReviews;
  @override
  final double? averageRating;
  // Visitors & Conversion
  @override
  final int visitors;
  @override
  final double conversionRate;
  // Average order value
  @override
  final double averageOrderValue;

  @override
  String toString() {
    return 'DashboardModel(todaySales: $todaySales, todayEarnings: $todayEarnings, todayOrders: $todayOrders, pendingOrders: $pendingOrders, processingOrders: $processingOrders, packedOrders: $packedOrders, readyOrders: $readyOrders, deliveredOrders: $deliveredOrders, cancelledOrders: $cancelledOrders, refundRequests: $refundRequests, replacementRequests: $replacementRequests, lowStockItems: $lowStockItems, outOfStockItems: $outOfStockItems, topSellingProducts: $topSellingProducts, trendingProducts: $trendingProducts, lowSellingProducts: $lowSellingProducts, totalRevenue: $totalRevenue, walletBalance: $walletBalance, settlementAmount: $settlementAmount, nextSettlementDate: $nextSettlementDate, storeRating: $storeRating, totalReviews: $totalReviews, averageRating: $averageRating, visitors: $visitors, conversionRate: $conversionRate, averageOrderValue: $averageOrderValue)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DashboardModelImpl &&
            (identical(other.todaySales, todaySales) ||
                other.todaySales == todaySales) &&
            (identical(other.todayEarnings, todayEarnings) ||
                other.todayEarnings == todayEarnings) &&
            (identical(other.todayOrders, todayOrders) ||
                other.todayOrders == todayOrders) &&
            (identical(other.pendingOrders, pendingOrders) ||
                other.pendingOrders == pendingOrders) &&
            (identical(other.processingOrders, processingOrders) ||
                other.processingOrders == processingOrders) &&
            (identical(other.packedOrders, packedOrders) ||
                other.packedOrders == packedOrders) &&
            (identical(other.readyOrders, readyOrders) ||
                other.readyOrders == readyOrders) &&
            (identical(other.deliveredOrders, deliveredOrders) ||
                other.deliveredOrders == deliveredOrders) &&
            (identical(other.cancelledOrders, cancelledOrders) ||
                other.cancelledOrders == cancelledOrders) &&
            (identical(other.refundRequests, refundRequests) ||
                other.refundRequests == refundRequests) &&
            (identical(other.replacementRequests, replacementRequests) ||
                other.replacementRequests == replacementRequests) &&
            (identical(other.lowStockItems, lowStockItems) ||
                other.lowStockItems == lowStockItems) &&
            (identical(other.outOfStockItems, outOfStockItems) ||
                other.outOfStockItems == outOfStockItems) &&
            const DeepCollectionEquality().equals(
              other._topSellingProducts,
              _topSellingProducts,
            ) &&
            const DeepCollectionEquality().equals(
              other._trendingProducts,
              _trendingProducts,
            ) &&
            const DeepCollectionEquality().equals(
              other._lowSellingProducts,
              _lowSellingProducts,
            ) &&
            (identical(other.totalRevenue, totalRevenue) ||
                other.totalRevenue == totalRevenue) &&
            (identical(other.walletBalance, walletBalance) ||
                other.walletBalance == walletBalance) &&
            (identical(other.settlementAmount, settlementAmount) ||
                other.settlementAmount == settlementAmount) &&
            (identical(other.nextSettlementDate, nextSettlementDate) ||
                other.nextSettlementDate == nextSettlementDate) &&
            (identical(other.storeRating, storeRating) ||
                other.storeRating == storeRating) &&
            (identical(other.totalReviews, totalReviews) ||
                other.totalReviews == totalReviews) &&
            (identical(other.averageRating, averageRating) ||
                other.averageRating == averageRating) &&
            (identical(other.visitors, visitors) ||
                other.visitors == visitors) &&
            (identical(other.conversionRate, conversionRate) ||
                other.conversionRate == conversionRate) &&
            (identical(other.averageOrderValue, averageOrderValue) ||
                other.averageOrderValue == averageOrderValue));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    todaySales,
    todayEarnings,
    todayOrders,
    pendingOrders,
    processingOrders,
    packedOrders,
    readyOrders,
    deliveredOrders,
    cancelledOrders,
    refundRequests,
    replacementRequests,
    lowStockItems,
    outOfStockItems,
    const DeepCollectionEquality().hash(_topSellingProducts),
    const DeepCollectionEquality().hash(_trendingProducts),
    const DeepCollectionEquality().hash(_lowSellingProducts),
    totalRevenue,
    walletBalance,
    settlementAmount,
    nextSettlementDate,
    storeRating,
    totalReviews,
    averageRating,
    visitors,
    conversionRate,
    averageOrderValue,
  ]);

  /// Create a copy of DashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DashboardModelImplCopyWith<_$DashboardModelImpl> get copyWith =>
      __$$DashboardModelImplCopyWithImpl<_$DashboardModelImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$DashboardModelImplToJson(this);
  }
}

abstract class _DashboardModel implements DashboardModel {
  const factory _DashboardModel({
    required final double todaySales,
    required final double todayEarnings,
    required final int todayOrders,
    required final int pendingOrders,
    required final int processingOrders,
    required final int packedOrders,
    required final int readyOrders,
    required final int deliveredOrders,
    required final int cancelledOrders,
    required final int refundRequests,
    required final int replacementRequests,
    required final int lowStockItems,
    required final int outOfStockItems,
    required final List<TopProduct> topSellingProducts,
    required final List<TrendingProduct> trendingProducts,
    required final List<LowSellingProduct> lowSellingProducts,
    required final double totalRevenue,
    final double? walletBalance,
    final double? settlementAmount,
    final String? nextSettlementDate,
    required final double storeRating,
    final int? totalReviews,
    final double? averageRating,
    required final int visitors,
    required final double conversionRate,
    required final double averageOrderValue,
  }) = _$DashboardModelImpl;

  factory _DashboardModel.fromJson(Map<String, dynamic> json) =
      _$DashboardModelImpl.fromJson;

  // Today's overview
  @override
  double get todaySales;
  @override
  double get todayEarnings;
  @override
  int get todayOrders; // Order status
  @override
  int get pendingOrders;
  @override
  int get processingOrders;
  @override
  int get packedOrders;
  @override
  int get readyOrders;
  @override
  int get deliveredOrders;
  @override
  int get cancelledOrders;
  @override
  int get refundRequests;
  @override
  int get replacementRequests; // Inventory alerts
  @override
  int get lowStockItems;
  @override
  int get outOfStockItems; // Top products
  @override
  List<TopProduct> get topSellingProducts;
  @override
  List<TrendingProduct> get trendingProducts;
  @override
  List<LowSellingProduct> get lowSellingProducts; // Financials
  @override
  double get totalRevenue;
  @override
  double? get walletBalance;
  @override
  double? get settlementAmount;
  @override
  String? get nextSettlementDate; // Ratings & Reviews
  @override
  double get storeRating;
  @override
  int? get totalReviews;
  @override
  double? get averageRating; // Visitors & Conversion
  @override
  int get visitors;
  @override
  double get conversionRate; // Average order value
  @override
  double get averageOrderValue;

  /// Create a copy of DashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DashboardModelImplCopyWith<_$DashboardModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

TopProduct _$TopProductFromJson(Map<String, dynamic> json) {
  return _TopProduct.fromJson(json);
}

/// @nodoc
mixin _$TopProduct {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  int get unitsSold => throw _privateConstructorUsedError;
  double get revenue => throw _privateConstructorUsedError;

  /// Serializes this TopProduct to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TopProduct
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TopProductCopyWith<TopProduct> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TopProductCopyWith<$Res> {
  factory $TopProductCopyWith(
    TopProduct value,
    $Res Function(TopProduct) then,
  ) = _$TopProductCopyWithImpl<$Res, TopProduct>;
  @useResult
  $Res call({String id, String name, int unitsSold, double revenue});
}

/// @nodoc
class _$TopProductCopyWithImpl<$Res, $Val extends TopProduct>
    implements $TopProductCopyWith<$Res> {
  _$TopProductCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TopProduct
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? unitsSold = null,
    Object? revenue = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            unitsSold: null == unitsSold
                ? _value.unitsSold
                : unitsSold // ignore: cast_nullable_to_non_nullable
                      as int,
            revenue: null == revenue
                ? _value.revenue
                : revenue // ignore: cast_nullable_to_non_nullable
                      as double,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$TopProductImplCopyWith<$Res>
    implements $TopProductCopyWith<$Res> {
  factory _$$TopProductImplCopyWith(
    _$TopProductImpl value,
    $Res Function(_$TopProductImpl) then,
  ) = __$$TopProductImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String name, int unitsSold, double revenue});
}

/// @nodoc
class __$$TopProductImplCopyWithImpl<$Res>
    extends _$TopProductCopyWithImpl<$Res, _$TopProductImpl>
    implements _$$TopProductImplCopyWith<$Res> {
  __$$TopProductImplCopyWithImpl(
    _$TopProductImpl _value,
    $Res Function(_$TopProductImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of TopProduct
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? unitsSold = null,
    Object? revenue = null,
  }) {
    return _then(
      _$TopProductImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        unitsSold: null == unitsSold
            ? _value.unitsSold
            : unitsSold // ignore: cast_nullable_to_non_nullable
                  as int,
        revenue: null == revenue
            ? _value.revenue
            : revenue // ignore: cast_nullable_to_non_nullable
                  as double,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$TopProductImpl implements _TopProduct {
  const _$TopProductImpl({
    required this.id,
    required this.name,
    required this.unitsSold,
    required this.revenue,
  });

  factory _$TopProductImpl.fromJson(Map<String, dynamic> json) =>
      _$$TopProductImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final int unitsSold;
  @override
  final double revenue;

  @override
  String toString() {
    return 'TopProduct(id: $id, name: $name, unitsSold: $unitsSold, revenue: $revenue)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TopProductImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.unitsSold, unitsSold) ||
                other.unitsSold == unitsSold) &&
            (identical(other.revenue, revenue) || other.revenue == revenue));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, unitsSold, revenue);

  /// Create a copy of TopProduct
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TopProductImplCopyWith<_$TopProductImpl> get copyWith =>
      __$$TopProductImplCopyWithImpl<_$TopProductImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TopProductImplToJson(this);
  }
}

abstract class _TopProduct implements TopProduct {
  const factory _TopProduct({
    required final String id,
    required final String name,
    required final int unitsSold,
    required final double revenue,
  }) = _$TopProductImpl;

  factory _TopProduct.fromJson(Map<String, dynamic> json) =
      _$TopProductImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  int get unitsSold;
  @override
  double get revenue;

  /// Create a copy of TopProduct
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TopProductImplCopyWith<_$TopProductImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

TrendingProduct _$TrendingProductFromJson(Map<String, dynamic> json) {
  return _TrendingProduct.fromJson(json);
}

/// @nodoc
mixin _$TrendingProduct {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  int get views => throw _privateConstructorUsedError;
  int get orders => throw _privateConstructorUsedError;

  /// Serializes this TrendingProduct to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TrendingProduct
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TrendingProductCopyWith<TrendingProduct> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TrendingProductCopyWith<$Res> {
  factory $TrendingProductCopyWith(
    TrendingProduct value,
    $Res Function(TrendingProduct) then,
  ) = _$TrendingProductCopyWithImpl<$Res, TrendingProduct>;
  @useResult
  $Res call({String id, String name, int views, int orders});
}

/// @nodoc
class _$TrendingProductCopyWithImpl<$Res, $Val extends TrendingProduct>
    implements $TrendingProductCopyWith<$Res> {
  _$TrendingProductCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TrendingProduct
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? views = null,
    Object? orders = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            views: null == views
                ? _value.views
                : views // ignore: cast_nullable_to_non_nullable
                      as int,
            orders: null == orders
                ? _value.orders
                : orders // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$TrendingProductImplCopyWith<$Res>
    implements $TrendingProductCopyWith<$Res> {
  factory _$$TrendingProductImplCopyWith(
    _$TrendingProductImpl value,
    $Res Function(_$TrendingProductImpl) then,
  ) = __$$TrendingProductImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String name, int views, int orders});
}

/// @nodoc
class __$$TrendingProductImplCopyWithImpl<$Res>
    extends _$TrendingProductCopyWithImpl<$Res, _$TrendingProductImpl>
    implements _$$TrendingProductImplCopyWith<$Res> {
  __$$TrendingProductImplCopyWithImpl(
    _$TrendingProductImpl _value,
    $Res Function(_$TrendingProductImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of TrendingProduct
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? views = null,
    Object? orders = null,
  }) {
    return _then(
      _$TrendingProductImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        views: null == views
            ? _value.views
            : views // ignore: cast_nullable_to_non_nullable
                  as int,
        orders: null == orders
            ? _value.orders
            : orders // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$TrendingProductImpl implements _TrendingProduct {
  const _$TrendingProductImpl({
    required this.id,
    required this.name,
    required this.views,
    required this.orders,
  });

  factory _$TrendingProductImpl.fromJson(Map<String, dynamic> json) =>
      _$$TrendingProductImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final int views;
  @override
  final int orders;

  @override
  String toString() {
    return 'TrendingProduct(id: $id, name: $name, views: $views, orders: $orders)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TrendingProductImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.views, views) || other.views == views) &&
            (identical(other.orders, orders) || other.orders == orders));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, views, orders);

  /// Create a copy of TrendingProduct
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TrendingProductImplCopyWith<_$TrendingProductImpl> get copyWith =>
      __$$TrendingProductImplCopyWithImpl<_$TrendingProductImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$TrendingProductImplToJson(this);
  }
}

abstract class _TrendingProduct implements TrendingProduct {
  const factory _TrendingProduct({
    required final String id,
    required final String name,
    required final int views,
    required final int orders,
  }) = _$TrendingProductImpl;

  factory _TrendingProduct.fromJson(Map<String, dynamic> json) =
      _$TrendingProductImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  int get views;
  @override
  int get orders;

  /// Create a copy of TrendingProduct
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TrendingProductImplCopyWith<_$TrendingProductImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

LowSellingProduct _$LowSellingProductFromJson(Map<String, dynamic> json) {
  return _LowSellingProduct.fromJson(json);
}

/// @nodoc
mixin _$LowSellingProduct {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  int get unitsSold => throw _privateConstructorUsedError;
  int get daysInInventory => throw _privateConstructorUsedError;

  /// Serializes this LowSellingProduct to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of LowSellingProduct
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $LowSellingProductCopyWith<LowSellingProduct> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $LowSellingProductCopyWith<$Res> {
  factory $LowSellingProductCopyWith(
    LowSellingProduct value,
    $Res Function(LowSellingProduct) then,
  ) = _$LowSellingProductCopyWithImpl<$Res, LowSellingProduct>;
  @useResult
  $Res call({String id, String name, int unitsSold, int daysInInventory});
}

/// @nodoc
class _$LowSellingProductCopyWithImpl<$Res, $Val extends LowSellingProduct>
    implements $LowSellingProductCopyWith<$Res> {
  _$LowSellingProductCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of LowSellingProduct
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? unitsSold = null,
    Object? daysInInventory = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            unitsSold: null == unitsSold
                ? _value.unitsSold
                : unitsSold // ignore: cast_nullable_to_non_nullable
                      as int,
            daysInInventory: null == daysInInventory
                ? _value.daysInInventory
                : daysInInventory // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$LowSellingProductImplCopyWith<$Res>
    implements $LowSellingProductCopyWith<$Res> {
  factory _$$LowSellingProductImplCopyWith(
    _$LowSellingProductImpl value,
    $Res Function(_$LowSellingProductImpl) then,
  ) = __$$LowSellingProductImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String name, int unitsSold, int daysInInventory});
}

/// @nodoc
class __$$LowSellingProductImplCopyWithImpl<$Res>
    extends _$LowSellingProductCopyWithImpl<$Res, _$LowSellingProductImpl>
    implements _$$LowSellingProductImplCopyWith<$Res> {
  __$$LowSellingProductImplCopyWithImpl(
    _$LowSellingProductImpl _value,
    $Res Function(_$LowSellingProductImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of LowSellingProduct
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? unitsSold = null,
    Object? daysInInventory = null,
  }) {
    return _then(
      _$LowSellingProductImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        unitsSold: null == unitsSold
            ? _value.unitsSold
            : unitsSold // ignore: cast_nullable_to_non_nullable
                  as int,
        daysInInventory: null == daysInInventory
            ? _value.daysInInventory
            : daysInInventory // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$LowSellingProductImpl implements _LowSellingProduct {
  const _$LowSellingProductImpl({
    required this.id,
    required this.name,
    required this.unitsSold,
    required this.daysInInventory,
  });

  factory _$LowSellingProductImpl.fromJson(Map<String, dynamic> json) =>
      _$$LowSellingProductImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final int unitsSold;
  @override
  final int daysInInventory;

  @override
  String toString() {
    return 'LowSellingProduct(id: $id, name: $name, unitsSold: $unitsSold, daysInInventory: $daysInInventory)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$LowSellingProductImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.unitsSold, unitsSold) ||
                other.unitsSold == unitsSold) &&
            (identical(other.daysInInventory, daysInInventory) ||
                other.daysInInventory == daysInInventory));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, name, unitsSold, daysInInventory);

  /// Create a copy of LowSellingProduct
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$LowSellingProductImplCopyWith<_$LowSellingProductImpl> get copyWith =>
      __$$LowSellingProductImplCopyWithImpl<_$LowSellingProductImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$LowSellingProductImplToJson(this);
  }
}

abstract class _LowSellingProduct implements LowSellingProduct {
  const factory _LowSellingProduct({
    required final String id,
    required final String name,
    required final int unitsSold,
    required final int daysInInventory,
  }) = _$LowSellingProductImpl;

  factory _LowSellingProduct.fromJson(Map<String, dynamic> json) =
      _$LowSellingProductImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  int get unitsSold;
  @override
  int get daysInInventory;

  /// Create a copy of LowSellingProduct
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$LowSellingProductImplCopyWith<_$LowSellingProductImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
