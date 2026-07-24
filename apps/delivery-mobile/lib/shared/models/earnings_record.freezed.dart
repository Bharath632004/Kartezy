// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'earnings_record.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

EarningsRecord _$EarningsRecordFromJson(Map<String, dynamic> json) {
  return _EarningsRecord.fromJson(json);
}

/// @nodoc
mixin _$EarningsRecord {
  String get id => throw _privateConstructorUsedError;
  String get partnerId => throw _privateConstructorUsedError;
  String? get orderId => throw _privateConstructorUsedError;
  EarningType get type => throw _privateConstructorUsedError;
  double get amount => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  bool get isCredited => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $EarningsRecordCopyWith<EarningsRecord> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $EarningsRecordCopyWith<$Res> {
  factory $EarningsRecordCopyWith(
    EarningsRecord value,
    $Res Function(EarningsRecord) then,
  ) = _$EarningsRecordCopyWithImpl<$Res, EarningsRecord>;
  @useResult
  $Res call({
    String id,
    String partnerId,
    String? orderId,
    EarningType type,
    double amount,
    String description,
    DateTime createdAt,
    bool isCredited,
  });
}

/// @nodoc
class _$EarningsRecordCopyWithImpl<$Res, $Val extends EarningsRecord>
    implements $EarningsRecordCopyWith<$Res> {
  _$EarningsRecordCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partnerId = null,
    Object? orderId = freezed,
    Object? type = null,
    Object? amount = null,
    Object? description = null,
    Object? createdAt = null,
    Object? isCredited = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            partnerId: null == partnerId
                ? _value.partnerId
                : partnerId // ignore: cast_nullable_to_non_nullable
                      as String,
            orderId: freezed == orderId
                ? _value.orderId
                : orderId // ignore: cast_nullable_to_non_nullable
                      as String?,
            type: null == type
                ? _value.type
                : type // ignore: cast_nullable_to_non_nullable
                      as EarningType,
            amount: null == amount
                ? _value.amount
                : amount // ignore: cast_nullable_to_non_nullable
                      as double,
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            isCredited: null == isCredited
                ? _value.isCredited
                : isCredited // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$EarningsRecordImplCopyWith<$Res>
    implements $EarningsRecordCopyWith<$Res> {
  factory _$$EarningsRecordImplCopyWith(
    _$EarningsRecordImpl value,
    $Res Function(_$EarningsRecordImpl) then,
  ) = __$$EarningsRecordImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String partnerId,
    String? orderId,
    EarningType type,
    double amount,
    String description,
    DateTime createdAt,
    bool isCredited,
  });
}

/// @nodoc
class __$$EarningsRecordImplCopyWithImpl<$Res>
    extends _$EarningsRecordCopyWithImpl<$Res, _$EarningsRecordImpl>
    implements _$$EarningsRecordImplCopyWith<$Res> {
  __$$EarningsRecordImplCopyWithImpl(
    _$EarningsRecordImpl _value,
    $Res Function(_$EarningsRecordImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partnerId = null,
    Object? orderId = freezed,
    Object? type = null,
    Object? amount = null,
    Object? description = null,
    Object? createdAt = null,
    Object? isCredited = null,
  }) {
    return _then(
      _$EarningsRecordImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        partnerId: null == partnerId
            ? _value.partnerId
            : partnerId // ignore: cast_nullable_to_non_nullable
                  as String,
        orderId: freezed == orderId
            ? _value.orderId
            : orderId // ignore: cast_nullable_to_non_nullable
                  as String?,
        type: null == type
            ? _value.type
            : type // ignore: cast_nullable_to_non_nullable
                  as EarningType,
        amount: null == amount
            ? _value.amount
            : amount // ignore: cast_nullable_to_non_nullable
                  as double,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        isCredited: null == isCredited
            ? _value.isCredited
            : isCredited // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$EarningsRecordImpl implements _EarningsRecord {
  const _$EarningsRecordImpl({
    required this.id,
    required this.partnerId,
    required this.orderId,
    required this.type,
    required this.amount,
    required this.description,
    required this.createdAt,
    required this.isCredited,
  });

  factory _$EarningsRecordImpl.fromJson(Map<String, dynamic> json) =>
      _$$EarningsRecordImplFromJson(json);

  @override
  final String id;
  @override
  final String partnerId;
  @override
  final String? orderId;
  @override
  final EarningType type;
  @override
  final double amount;
  @override
  final String description;
  @override
  final DateTime createdAt;
  @override
  final bool isCredited;

  @override
  String toString() {
    return 'EarningsRecord(id: $id, partnerId: $partnerId, orderId: $orderId, type: $type, amount: $amount, description: $description, createdAt: $createdAt, isCredited: $isCredited)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$EarningsRecordImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.partnerId, partnerId) ||
                other.partnerId == partnerId) &&
            (identical(other.orderId, orderId) || other.orderId == orderId) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.isCredited, isCredited) ||
                other.isCredited == isCredited));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    partnerId,
    orderId,
    type,
    amount,
    description,
    createdAt,
    isCredited,
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$EarningsRecordImplCopyWith<_$EarningsRecordImpl> get copyWith =>
      __$$EarningsRecordImplCopyWithImpl<_$EarningsRecordImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$EarningsRecordImplToJson(this);
  }
}

abstract class _EarningsRecord implements EarningsRecord {
  const factory _EarningsRecord({
    required final String id,
    required final String partnerId,
    required final String? orderId,
    required final EarningType type,
    required final double amount,
    required final String description,
    required final DateTime createdAt,
    required final bool isCredited,
  }) = _$EarningsRecordImpl;

  factory _EarningsRecord.fromJson(Map<String, dynamic> json) =
      _$EarningsRecordImpl.fromJson;

  @override
  String get id;
  @override
  String get partnerId;
  @override
  String? get orderId;
  @override
  EarningType get type;
  @override
  double get amount;
  @override
  String get description;
  @override
  DateTime get createdAt;
  @override
  bool get isCredited;
  @override
  @JsonKey(ignore: true)
  _$$EarningsRecordImplCopyWith<_$EarningsRecordImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

EarningsSummary _$EarningsSummaryFromJson(Map<String, dynamic> json) {
  return _EarningsSummary.fromJson(json);
}

/// @nodoc
mixin _$EarningsSummary {
  double get totalEarnings => throw _privateConstructorUsedError;
  double get deliveryFees => throw _privateConstructorUsedError;
  double get tips => throw _privateConstructorUsedError;
  double get bonuses => throw _privateConstructorUsedError;
  double get incentives => throw _privateConstructorUsedError;
  double get penalties => throw _privateConstructorUsedError;
  int get totalOrders => throw _privateConstructorUsedError;
  double get averagePerOrder => throw _privateConstructorUsedError;
  DateTime get periodStart => throw _privateConstructorUsedError;
  DateTime get periodEnd => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $EarningsSummaryCopyWith<EarningsSummary> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $EarningsSummaryCopyWith<$Res> {
  factory $EarningsSummaryCopyWith(
    EarningsSummary value,
    $Res Function(EarningsSummary) then,
  ) = _$EarningsSummaryCopyWithImpl<$Res, EarningsSummary>;
  @useResult
  $Res call({
    double totalEarnings,
    double deliveryFees,
    double tips,
    double bonuses,
    double incentives,
    double penalties,
    int totalOrders,
    double averagePerOrder,
    DateTime periodStart,
    DateTime periodEnd,
  });
}

/// @nodoc
class _$EarningsSummaryCopyWithImpl<$Res, $Val extends EarningsSummary>
    implements $EarningsSummaryCopyWith<$Res> {
  _$EarningsSummaryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalEarnings = null,
    Object? deliveryFees = null,
    Object? tips = null,
    Object? bonuses = null,
    Object? incentives = null,
    Object? penalties = null,
    Object? totalOrders = null,
    Object? averagePerOrder = null,
    Object? periodStart = null,
    Object? periodEnd = null,
  }) {
    return _then(
      _value.copyWith(
            totalEarnings: null == totalEarnings
                ? _value.totalEarnings
                : totalEarnings // ignore: cast_nullable_to_non_nullable
                      as double,
            deliveryFees: null == deliveryFees
                ? _value.deliveryFees
                : deliveryFees // ignore: cast_nullable_to_non_nullable
                      as double,
            tips: null == tips
                ? _value.tips
                : tips // ignore: cast_nullable_to_non_nullable
                      as double,
            bonuses: null == bonuses
                ? _value.bonuses
                : bonuses // ignore: cast_nullable_to_non_nullable
                      as double,
            incentives: null == incentives
                ? _value.incentives
                : incentives // ignore: cast_nullable_to_non_nullable
                      as double,
            penalties: null == penalties
                ? _value.penalties
                : penalties // ignore: cast_nullable_to_non_nullable
                      as double,
            totalOrders: null == totalOrders
                ? _value.totalOrders
                : totalOrders // ignore: cast_nullable_to_non_nullable
                      as int,
            averagePerOrder: null == averagePerOrder
                ? _value.averagePerOrder
                : averagePerOrder // ignore: cast_nullable_to_non_nullable
                      as double,
            periodStart: null == periodStart
                ? _value.periodStart
                : periodStart // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            periodEnd: null == periodEnd
                ? _value.periodEnd
                : periodEnd // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$EarningsSummaryImplCopyWith<$Res>
    implements $EarningsSummaryCopyWith<$Res> {
  factory _$$EarningsSummaryImplCopyWith(
    _$EarningsSummaryImpl value,
    $Res Function(_$EarningsSummaryImpl) then,
  ) = __$$EarningsSummaryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    double totalEarnings,
    double deliveryFees,
    double tips,
    double bonuses,
    double incentives,
    double penalties,
    int totalOrders,
    double averagePerOrder,
    DateTime periodStart,
    DateTime periodEnd,
  });
}

/// @nodoc
class __$$EarningsSummaryImplCopyWithImpl<$Res>
    extends _$EarningsSummaryCopyWithImpl<$Res, _$EarningsSummaryImpl>
    implements _$$EarningsSummaryImplCopyWith<$Res> {
  __$$EarningsSummaryImplCopyWithImpl(
    _$EarningsSummaryImpl _value,
    $Res Function(_$EarningsSummaryImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalEarnings = null,
    Object? deliveryFees = null,
    Object? tips = null,
    Object? bonuses = null,
    Object? incentives = null,
    Object? penalties = null,
    Object? totalOrders = null,
    Object? averagePerOrder = null,
    Object? periodStart = null,
    Object? periodEnd = null,
  }) {
    return _then(
      _$EarningsSummaryImpl(
        totalEarnings: null == totalEarnings
            ? _value.totalEarnings
            : totalEarnings // ignore: cast_nullable_to_non_nullable
                  as double,
        deliveryFees: null == deliveryFees
            ? _value.deliveryFees
            : deliveryFees // ignore: cast_nullable_to_non_nullable
                  as double,
        tips: null == tips
            ? _value.tips
            : tips // ignore: cast_nullable_to_non_nullable
                  as double,
        bonuses: null == bonuses
            ? _value.bonuses
            : bonuses // ignore: cast_nullable_to_non_nullable
                  as double,
        incentives: null == incentives
            ? _value.incentives
            : incentives // ignore: cast_nullable_to_non_nullable
                  as double,
        penalties: null == penalties
            ? _value.penalties
            : penalties // ignore: cast_nullable_to_non_nullable
                  as double,
        totalOrders: null == totalOrders
            ? _value.totalOrders
            : totalOrders // ignore: cast_nullable_to_non_nullable
                  as int,
        averagePerOrder: null == averagePerOrder
            ? _value.averagePerOrder
            : averagePerOrder // ignore: cast_nullable_to_non_nullable
                  as double,
        periodStart: null == periodStart
            ? _value.periodStart
            : periodStart // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        periodEnd: null == periodEnd
            ? _value.periodEnd
            : periodEnd // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$EarningsSummaryImpl implements _EarningsSummary {
  const _$EarningsSummaryImpl({
    required this.totalEarnings,
    required this.deliveryFees,
    required this.tips,
    required this.bonuses,
    required this.incentives,
    required this.penalties,
    required this.totalOrders,
    required this.averagePerOrder,
    required this.periodStart,
    required this.periodEnd,
  });

  factory _$EarningsSummaryImpl.fromJson(Map<String, dynamic> json) =>
      _$$EarningsSummaryImplFromJson(json);

  @override
  final double totalEarnings;
  @override
  final double deliveryFees;
  @override
  final double tips;
  @override
  final double bonuses;
  @override
  final double incentives;
  @override
  final double penalties;
  @override
  final int totalOrders;
  @override
  final double averagePerOrder;
  @override
  final DateTime periodStart;
  @override
  final DateTime periodEnd;

  @override
  String toString() {
    return 'EarningsSummary(totalEarnings: $totalEarnings, deliveryFees: $deliveryFees, tips: $tips, bonuses: $bonuses, incentives: $incentives, penalties: $penalties, totalOrders: $totalOrders, averagePerOrder: $averagePerOrder, periodStart: $periodStart, periodEnd: $periodEnd)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$EarningsSummaryImpl &&
            (identical(other.totalEarnings, totalEarnings) ||
                other.totalEarnings == totalEarnings) &&
            (identical(other.deliveryFees, deliveryFees) ||
                other.deliveryFees == deliveryFees) &&
            (identical(other.tips, tips) || other.tips == tips) &&
            (identical(other.bonuses, bonuses) || other.bonuses == bonuses) &&
            (identical(other.incentives, incentives) ||
                other.incentives == incentives) &&
            (identical(other.penalties, penalties) ||
                other.penalties == penalties) &&
            (identical(other.totalOrders, totalOrders) ||
                other.totalOrders == totalOrders) &&
            (identical(other.averagePerOrder, averagePerOrder) ||
                other.averagePerOrder == averagePerOrder) &&
            (identical(other.periodStart, periodStart) ||
                other.periodStart == periodStart) &&
            (identical(other.periodEnd, periodEnd) ||
                other.periodEnd == periodEnd));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    totalEarnings,
    deliveryFees,
    tips,
    bonuses,
    incentives,
    penalties,
    totalOrders,
    averagePerOrder,
    periodStart,
    periodEnd,
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$EarningsSummaryImplCopyWith<_$EarningsSummaryImpl> get copyWith =>
      __$$EarningsSummaryImplCopyWithImpl<_$EarningsSummaryImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$EarningsSummaryImplToJson(this);
  }
}

abstract class _EarningsSummary implements EarningsSummary {
  const factory _EarningsSummary({
    required final double totalEarnings,
    required final double deliveryFees,
    required final double tips,
    required final double bonuses,
    required final double incentives,
    required final double penalties,
    required final int totalOrders,
    required final double averagePerOrder,
    required final DateTime periodStart,
    required final DateTime periodEnd,
  }) = _$EarningsSummaryImpl;

  factory _EarningsSummary.fromJson(Map<String, dynamic> json) =
      _$EarningsSummaryImpl.fromJson;

  @override
  double get totalEarnings;
  @override
  double get deliveryFees;
  @override
  double get tips;
  @override
  double get bonuses;
  @override
  double get incentives;
  @override
  double get penalties;
  @override
  int get totalOrders;
  @override
  double get averagePerOrder;
  @override
  DateTime get periodStart;
  @override
  DateTime get periodEnd;
  @override
  @JsonKey(ignore: true)
  _$$EarningsSummaryImplCopyWith<_$EarningsSummaryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
