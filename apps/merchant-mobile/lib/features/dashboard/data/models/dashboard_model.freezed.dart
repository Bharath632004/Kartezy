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
  double get todaySales => throw _privateConstructorUsedError;
  double get revenue => throw _privateConstructorUsedError;
  int get orders => throw _privateConstructorUsedError;
  int get pendingOrders => throw _privateConstructorUsedError;
  int get cancelledOrders => throw _privateConstructorUsedError;
  int get visitors => throw _privateConstructorUsedError;
  double get rating => throw _privateConstructorUsedError;

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
    double revenue,
    int orders,
    int pendingOrders,
    int cancelledOrders,
    int visitors,
    double rating,
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
    Object? revenue = null,
    Object? orders = null,
    Object? pendingOrders = null,
    Object? cancelledOrders = null,
    Object? visitors = null,
    Object? rating = null,
  }) {
    return _then(
      _value.copyWith(
            todaySales: null == todaySales
                ? _value.todaySales
                : todaySales // ignore: cast_nullable_to_non_nullable
                      as double,
            revenue: null == revenue
                ? _value.revenue
                : revenue // ignore: cast_nullable_to_non_nullable
                      as double,
            orders: null == orders
                ? _value.orders
                : orders // ignore: cast_nullable_to_non_nullable
                      as int,
            pendingOrders: null == pendingOrders
                ? _value.pendingOrders
                : pendingOrders // ignore: cast_nullable_to_non_nullable
                      as int,
            cancelledOrders: null == cancelledOrders
                ? _value.cancelledOrders
                : cancelledOrders // ignore: cast_nullable_to_non_nullable
                      as int,
            visitors: null == visitors
                ? _value.visitors
                : visitors // ignore: cast_nullable_to_non_nullable
                      as int,
            rating: null == rating
                ? _value.rating
                : rating // ignore: cast_nullable_to_non_nullable
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
    double revenue,
    int orders,
    int pendingOrders,
    int cancelledOrders,
    int visitors,
    double rating,
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
    Object? revenue = null,
    Object? orders = null,
    Object? pendingOrders = null,
    Object? cancelledOrders = null,
    Object? visitors = null,
    Object? rating = null,
  }) {
    return _then(
      _$DashboardModelImpl(
        todaySales: null == todaySales
            ? _value.todaySales
            : todaySales // ignore: cast_nullable_to_non_nullable
                  as double,
        revenue: null == revenue
            ? _value.revenue
            : revenue // ignore: cast_nullable_to_non_nullable
                  as double,
        orders: null == orders
            ? _value.orders
            : orders // ignore: cast_nullable_to_non_nullable
                  as int,
        pendingOrders: null == pendingOrders
            ? _value.pendingOrders
            : pendingOrders // ignore: cast_nullable_to_non_nullable
                  as int,
        cancelledOrders: null == cancelledOrders
            ? _value.cancelledOrders
            : cancelledOrders // ignore: cast_nullable_to_non_nullable
                  as int,
        visitors: null == visitors
            ? _value.visitors
            : visitors // ignore: cast_nullable_to_non_nullable
                  as int,
        rating: null == rating
            ? _value.rating
            : rating // ignore: cast_nullable_to_non_nullable
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
    required this.revenue,
    required this.orders,
    required this.pendingOrders,
    required this.cancelledOrders,
    required this.visitors,
    required this.rating,
  });

  factory _$DashboardModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$DashboardModelImplFromJson(json);

  @override
  final double todaySales;
  @override
  final double revenue;
  @override
  final int orders;
  @override
  final int pendingOrders;
  @override
  final int cancelledOrders;
  @override
  final int visitors;
  @override
  final double rating;

  @override
  String toString() {
    return 'DashboardModel(todaySales: $todaySales, revenue: $revenue, orders: $orders, pendingOrders: $pendingOrders, cancelledOrders: $cancelledOrders, visitors: $visitors, rating: $rating)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DashboardModelImpl &&
            (identical(other.todaySales, todaySales) ||
                other.todaySales == todaySales) &&
            (identical(other.revenue, revenue) || other.revenue == revenue) &&
            (identical(other.orders, orders) || other.orders == orders) &&
            (identical(other.pendingOrders, pendingOrders) ||
                other.pendingOrders == pendingOrders) &&
            (identical(other.cancelledOrders, cancelledOrders) ||
                other.cancelledOrders == cancelledOrders) &&
            (identical(other.visitors, visitors) ||
                other.visitors == visitors) &&
            (identical(other.rating, rating) || other.rating == rating));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    todaySales,
    revenue,
    orders,
    pendingOrders,
    cancelledOrders,
    visitors,
    rating,
  );

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
    required final double revenue,
    required final int orders,
    required final int pendingOrders,
    required final int cancelledOrders,
    required final int visitors,
    required final double rating,
  }) = _$DashboardModelImpl;

  factory _DashboardModel.fromJson(Map<String, dynamic> json) =
      _$DashboardModelImpl.fromJson;

  @override
  double get todaySales;
  @override
  double get revenue;
  @override
  int get orders;
  @override
  int get pendingOrders;
  @override
  int get cancelledOrders;
  @override
  int get visitors;
  @override
  double get rating;

  /// Create a copy of DashboardModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DashboardModelImplCopyWith<_$DashboardModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
