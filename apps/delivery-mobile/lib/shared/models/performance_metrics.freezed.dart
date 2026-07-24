// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'performance_metrics.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

PerformanceMetrics _$PerformanceMetricsFromJson(Map<String, dynamic> json) {
  return _PerformanceMetrics.fromJson(json);
}

/// @nodoc
mixin _$PerformanceMetrics {
  int get totalOrdersDelivered => throw _privateConstructorUsedError;
  int get totalOrdersAssigned => throw _privateConstructorUsedError;
  int get totalOrdersCancelled => throw _privateConstructorUsedError;
  double get acceptanceRate => throw _privateConstructorUsedError;
  double get completionRate => throw _privateConstructorUsedError;
  double get onTimeRate => throw _privateConstructorUsedError;
  double get customerRating => throw _privateConstructorUsedError;
  double get merchantRating => throw _privateConstructorUsedError;
  double get averageDeliveryTimeMinutes => throw _privateConstructorUsedError;
  int get currentStreak => throw _privateConstructorUsedError;
  int get longestStreak => throw _privateConstructorUsedError;
  int get rank => throw _privateConstructorUsedError;
  int get totalPartners => throw _privateConstructorUsedError;
  List<LeaderboardEntry>? get leaderboard => throw _privateConstructorUsedError;
  List<String>? get badges => throw _privateConstructorUsedError;
  int? get performanceScore => throw _privateConstructorUsedError;
  DateTime? get periodStart => throw _privateConstructorUsedError;
  DateTime? get periodEnd => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $PerformanceMetricsCopyWith<PerformanceMetrics> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PerformanceMetricsCopyWith<$Res> {
  factory $PerformanceMetricsCopyWith(
    PerformanceMetrics value,
    $Res Function(PerformanceMetrics) then,
  ) = _$PerformanceMetricsCopyWithImpl<$Res, PerformanceMetrics>;
  @useResult
  $Res call({
    int totalOrdersDelivered,
    int totalOrdersAssigned,
    int totalOrdersCancelled,
    double acceptanceRate,
    double completionRate,
    double onTimeRate,
    double customerRating,
    double merchantRating,
    double averageDeliveryTimeMinutes,
    int currentStreak,
    int longestStreak,
    int rank,
    int totalPartners,
    List<LeaderboardEntry>? leaderboard,
    List<String>? badges,
    int? performanceScore,
    DateTime? periodStart,
    DateTime? periodEnd,
  });
}

/// @nodoc
class _$PerformanceMetricsCopyWithImpl<$Res, $Val extends PerformanceMetrics>
    implements $PerformanceMetricsCopyWith<$Res> {
  _$PerformanceMetricsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalOrdersDelivered = null,
    Object? totalOrdersAssigned = null,
    Object? totalOrdersCancelled = null,
    Object? acceptanceRate = null,
    Object? completionRate = null,
    Object? onTimeRate = null,
    Object? customerRating = null,
    Object? merchantRating = null,
    Object? averageDeliveryTimeMinutes = null,
    Object? currentStreak = null,
    Object? longestStreak = null,
    Object? rank = null,
    Object? totalPartners = null,
    Object? leaderboard = freezed,
    Object? badges = freezed,
    Object? performanceScore = freezed,
    Object? periodStart = freezed,
    Object? periodEnd = freezed,
  }) {
    return _then(
      _value.copyWith(
            totalOrdersDelivered: null == totalOrdersDelivered
                ? _value.totalOrdersDelivered
                : totalOrdersDelivered // ignore: cast_nullable_to_non_nullable
                      as int,
            totalOrdersAssigned: null == totalOrdersAssigned
                ? _value.totalOrdersAssigned
                : totalOrdersAssigned // ignore: cast_nullable_to_non_nullable
                      as int,
            totalOrdersCancelled: null == totalOrdersCancelled
                ? _value.totalOrdersCancelled
                : totalOrdersCancelled // ignore: cast_nullable_to_non_nullable
                      as int,
            acceptanceRate: null == acceptanceRate
                ? _value.acceptanceRate
                : acceptanceRate // ignore: cast_nullable_to_non_nullable
                      as double,
            completionRate: null == completionRate
                ? _value.completionRate
                : completionRate // ignore: cast_nullable_to_non_nullable
                      as double,
            onTimeRate: null == onTimeRate
                ? _value.onTimeRate
                : onTimeRate // ignore: cast_nullable_to_non_nullable
                      as double,
            customerRating: null == customerRating
                ? _value.customerRating
                : customerRating // ignore: cast_nullable_to_non_nullable
                      as double,
            merchantRating: null == merchantRating
                ? _value.merchantRating
                : merchantRating // ignore: cast_nullable_to_non_nullable
                      as double,
            averageDeliveryTimeMinutes: null == averageDeliveryTimeMinutes
                ? _value.averageDeliveryTimeMinutes
                : averageDeliveryTimeMinutes // ignore: cast_nullable_to_non_nullable
                      as double,
            currentStreak: null == currentStreak
                ? _value.currentStreak
                : currentStreak // ignore: cast_nullable_to_non_nullable
                      as int,
            longestStreak: null == longestStreak
                ? _value.longestStreak
                : longestStreak // ignore: cast_nullable_to_non_nullable
                      as int,
            rank: null == rank
                ? _value.rank
                : rank // ignore: cast_nullable_to_non_nullable
                      as int,
            totalPartners: null == totalPartners
                ? _value.totalPartners
                : totalPartners // ignore: cast_nullable_to_non_nullable
                      as int,
            leaderboard: freezed == leaderboard
                ? _value.leaderboard
                : leaderboard // ignore: cast_nullable_to_non_nullable
                      as List<LeaderboardEntry>?,
            badges: freezed == badges
                ? _value.badges
                : badges // ignore: cast_nullable_to_non_nullable
                      as List<String>?,
            performanceScore: freezed == performanceScore
                ? _value.performanceScore
                : performanceScore // ignore: cast_nullable_to_non_nullable
                      as int?,
            periodStart: freezed == periodStart
                ? _value.periodStart
                : periodStart // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            periodEnd: freezed == periodEnd
                ? _value.periodEnd
                : periodEnd // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$PerformanceMetricsImplCopyWith<$Res>
    implements $PerformanceMetricsCopyWith<$Res> {
  factory _$$PerformanceMetricsImplCopyWith(
    _$PerformanceMetricsImpl value,
    $Res Function(_$PerformanceMetricsImpl) then,
  ) = __$$PerformanceMetricsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    int totalOrdersDelivered,
    int totalOrdersAssigned,
    int totalOrdersCancelled,
    double acceptanceRate,
    double completionRate,
    double onTimeRate,
    double customerRating,
    double merchantRating,
    double averageDeliveryTimeMinutes,
    int currentStreak,
    int longestStreak,
    int rank,
    int totalPartners,
    List<LeaderboardEntry>? leaderboard,
    List<String>? badges,
    int? performanceScore,
    DateTime? periodStart,
    DateTime? periodEnd,
  });
}

/// @nodoc
class __$$PerformanceMetricsImplCopyWithImpl<$Res>
    extends _$PerformanceMetricsCopyWithImpl<$Res, _$PerformanceMetricsImpl>
    implements _$$PerformanceMetricsImplCopyWith<$Res> {
  __$$PerformanceMetricsImplCopyWithImpl(
    _$PerformanceMetricsImpl _value,
    $Res Function(_$PerformanceMetricsImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? totalOrdersDelivered = null,
    Object? totalOrdersAssigned = null,
    Object? totalOrdersCancelled = null,
    Object? acceptanceRate = null,
    Object? completionRate = null,
    Object? onTimeRate = null,
    Object? customerRating = null,
    Object? merchantRating = null,
    Object? averageDeliveryTimeMinutes = null,
    Object? currentStreak = null,
    Object? longestStreak = null,
    Object? rank = null,
    Object? totalPartners = null,
    Object? leaderboard = freezed,
    Object? badges = freezed,
    Object? performanceScore = freezed,
    Object? periodStart = freezed,
    Object? periodEnd = freezed,
  }) {
    return _then(
      _$PerformanceMetricsImpl(
        totalOrdersDelivered: null == totalOrdersDelivered
            ? _value.totalOrdersDelivered
            : totalOrdersDelivered // ignore: cast_nullable_to_non_nullable
                  as int,
        totalOrdersAssigned: null == totalOrdersAssigned
            ? _value.totalOrdersAssigned
            : totalOrdersAssigned // ignore: cast_nullable_to_non_nullable
                  as int,
        totalOrdersCancelled: null == totalOrdersCancelled
            ? _value.totalOrdersCancelled
            : totalOrdersCancelled // ignore: cast_nullable_to_non_nullable
                  as int,
        acceptanceRate: null == acceptanceRate
            ? _value.acceptanceRate
            : acceptanceRate // ignore: cast_nullable_to_non_nullable
                  as double,
        completionRate: null == completionRate
            ? _value.completionRate
            : completionRate // ignore: cast_nullable_to_non_nullable
                  as double,
        onTimeRate: null == onTimeRate
            ? _value.onTimeRate
            : onTimeRate // ignore: cast_nullable_to_non_nullable
                  as double,
        customerRating: null == customerRating
            ? _value.customerRating
            : customerRating // ignore: cast_nullable_to_non_nullable
                  as double,
        merchantRating: null == merchantRating
            ? _value.merchantRating
            : merchantRating // ignore: cast_nullable_to_non_nullable
                  as double,
        averageDeliveryTimeMinutes: null == averageDeliveryTimeMinutes
            ? _value.averageDeliveryTimeMinutes
            : averageDeliveryTimeMinutes // ignore: cast_nullable_to_non_nullable
                  as double,
        currentStreak: null == currentStreak
            ? _value.currentStreak
            : currentStreak // ignore: cast_nullable_to_non_nullable
                  as int,
        longestStreak: null == longestStreak
            ? _value.longestStreak
            : longestStreak // ignore: cast_nullable_to_non_nullable
                  as int,
        rank: null == rank
            ? _value.rank
            : rank // ignore: cast_nullable_to_non_nullable
                  as int,
        totalPartners: null == totalPartners
            ? _value.totalPartners
            : totalPartners // ignore: cast_nullable_to_non_nullable
                  as int,
        leaderboard: freezed == leaderboard
            ? _value._leaderboard
            : leaderboard // ignore: cast_nullable_to_non_nullable
                  as List<LeaderboardEntry>?,
        badges: freezed == badges
            ? _value._badges
            : badges // ignore: cast_nullable_to_non_nullable
                  as List<String>?,
        performanceScore: freezed == performanceScore
            ? _value.performanceScore
            : performanceScore // ignore: cast_nullable_to_non_nullable
                  as int?,
        periodStart: freezed == periodStart
            ? _value.periodStart
            : periodStart // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        periodEnd: freezed == periodEnd
            ? _value.periodEnd
            : periodEnd // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PerformanceMetricsImpl implements _PerformanceMetrics {
  const _$PerformanceMetricsImpl({
    required this.totalOrdersDelivered,
    required this.totalOrdersAssigned,
    required this.totalOrdersCancelled,
    required this.acceptanceRate,
    required this.completionRate,
    required this.onTimeRate,
    required this.customerRating,
    required this.merchantRating,
    required this.averageDeliveryTimeMinutes,
    required this.currentStreak,
    required this.longestStreak,
    required this.rank,
    required this.totalPartners,
    final List<LeaderboardEntry>? leaderboard,
    final List<String>? badges,
    this.performanceScore,
    this.periodStart,
    this.periodEnd,
  }) : _leaderboard = leaderboard,
       _badges = badges;

  factory _$PerformanceMetricsImpl.fromJson(Map<String, dynamic> json) =>
      _$$PerformanceMetricsImplFromJson(json);

  @override
  final int totalOrdersDelivered;
  @override
  final int totalOrdersAssigned;
  @override
  final int totalOrdersCancelled;
  @override
  final double acceptanceRate;
  @override
  final double completionRate;
  @override
  final double onTimeRate;
  @override
  final double customerRating;
  @override
  final double merchantRating;
  @override
  final double averageDeliveryTimeMinutes;
  @override
  final int currentStreak;
  @override
  final int longestStreak;
  @override
  final int rank;
  @override
  final int totalPartners;
  final List<LeaderboardEntry>? _leaderboard;
  @override
  List<LeaderboardEntry>? get leaderboard {
    final value = _leaderboard;
    if (value == null) return null;
    if (_leaderboard is EqualUnmodifiableListView) return _leaderboard;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  final List<String>? _badges;
  @override
  List<String>? get badges {
    final value = _badges;
    if (value == null) return null;
    if (_badges is EqualUnmodifiableListView) return _badges;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final int? performanceScore;
  @override
  final DateTime? periodStart;
  @override
  final DateTime? periodEnd;

  @override
  String toString() {
    return 'PerformanceMetrics(totalOrdersDelivered: $totalOrdersDelivered, totalOrdersAssigned: $totalOrdersAssigned, totalOrdersCancelled: $totalOrdersCancelled, acceptanceRate: $acceptanceRate, completionRate: $completionRate, onTimeRate: $onTimeRate, customerRating: $customerRating, merchantRating: $merchantRating, averageDeliveryTimeMinutes: $averageDeliveryTimeMinutes, currentStreak: $currentStreak, longestStreak: $longestStreak, rank: $rank, totalPartners: $totalPartners, leaderboard: $leaderboard, badges: $badges, performanceScore: $performanceScore, periodStart: $periodStart, periodEnd: $periodEnd)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PerformanceMetricsImpl &&
            (identical(other.totalOrdersDelivered, totalOrdersDelivered) ||
                other.totalOrdersDelivered == totalOrdersDelivered) &&
            (identical(other.totalOrdersAssigned, totalOrdersAssigned) ||
                other.totalOrdersAssigned == totalOrdersAssigned) &&
            (identical(other.totalOrdersCancelled, totalOrdersCancelled) ||
                other.totalOrdersCancelled == totalOrdersCancelled) &&
            (identical(other.acceptanceRate, acceptanceRate) ||
                other.acceptanceRate == acceptanceRate) &&
            (identical(other.completionRate, completionRate) ||
                other.completionRate == completionRate) &&
            (identical(other.onTimeRate, onTimeRate) ||
                other.onTimeRate == onTimeRate) &&
            (identical(other.customerRating, customerRating) ||
                other.customerRating == customerRating) &&
            (identical(other.merchantRating, merchantRating) ||
                other.merchantRating == merchantRating) &&
            (identical(
                  other.averageDeliveryTimeMinutes,
                  averageDeliveryTimeMinutes,
                ) ||
                other.averageDeliveryTimeMinutes ==
                    averageDeliveryTimeMinutes) &&
            (identical(other.currentStreak, currentStreak) ||
                other.currentStreak == currentStreak) &&
            (identical(other.longestStreak, longestStreak) ||
                other.longestStreak == longestStreak) &&
            (identical(other.rank, rank) || other.rank == rank) &&
            (identical(other.totalPartners, totalPartners) ||
                other.totalPartners == totalPartners) &&
            const DeepCollectionEquality().equals(
              other._leaderboard,
              _leaderboard,
            ) &&
            const DeepCollectionEquality().equals(other._badges, _badges) &&
            (identical(other.performanceScore, performanceScore) ||
                other.performanceScore == performanceScore) &&
            (identical(other.periodStart, periodStart) ||
                other.periodStart == periodStart) &&
            (identical(other.periodEnd, periodEnd) ||
                other.periodEnd == periodEnd));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    totalOrdersDelivered,
    totalOrdersAssigned,
    totalOrdersCancelled,
    acceptanceRate,
    completionRate,
    onTimeRate,
    customerRating,
    merchantRating,
    averageDeliveryTimeMinutes,
    currentStreak,
    longestStreak,
    rank,
    totalPartners,
    const DeepCollectionEquality().hash(_leaderboard),
    const DeepCollectionEquality().hash(_badges),
    performanceScore,
    periodStart,
    periodEnd,
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$PerformanceMetricsImplCopyWith<_$PerformanceMetricsImpl> get copyWith =>
      __$$PerformanceMetricsImplCopyWithImpl<_$PerformanceMetricsImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$PerformanceMetricsImplToJson(this);
  }
}

abstract class _PerformanceMetrics implements PerformanceMetrics {
  const factory _PerformanceMetrics({
    required final int totalOrdersDelivered,
    required final int totalOrdersAssigned,
    required final int totalOrdersCancelled,
    required final double acceptanceRate,
    required final double completionRate,
    required final double onTimeRate,
    required final double customerRating,
    required final double merchantRating,
    required final double averageDeliveryTimeMinutes,
    required final int currentStreak,
    required final int longestStreak,
    required final int rank,
    required final int totalPartners,
    final List<LeaderboardEntry>? leaderboard,
    final List<String>? badges,
    final int? performanceScore,
    final DateTime? periodStart,
    final DateTime? periodEnd,
  }) = _$PerformanceMetricsImpl;

  factory _PerformanceMetrics.fromJson(Map<String, dynamic> json) =
      _$PerformanceMetricsImpl.fromJson;

  @override
  int get totalOrdersDelivered;
  @override
  int get totalOrdersAssigned;
  @override
  int get totalOrdersCancelled;
  @override
  double get acceptanceRate;
  @override
  double get completionRate;
  @override
  double get onTimeRate;
  @override
  double get customerRating;
  @override
  double get merchantRating;
  @override
  double get averageDeliveryTimeMinutes;
  @override
  int get currentStreak;
  @override
  int get longestStreak;
  @override
  int get rank;
  @override
  int get totalPartners;
  @override
  List<LeaderboardEntry>? get leaderboard;
  @override
  List<String>? get badges;
  @override
  int? get performanceScore;
  @override
  DateTime? get periodStart;
  @override
  DateTime? get periodEnd;
  @override
  @JsonKey(ignore: true)
  _$$PerformanceMetricsImplCopyWith<_$PerformanceMetricsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

LeaderboardEntry _$LeaderboardEntryFromJson(Map<String, dynamic> json) {
  return _LeaderboardEntry.fromJson(json);
}

/// @nodoc
mixin _$LeaderboardEntry {
  int get rank => throw _privateConstructorUsedError;
  String get partnerId => throw _privateConstructorUsedError;
  String get partnerName => throw _privateConstructorUsedError;
  String? get photoUrl => throw _privateConstructorUsedError;
  int get ordersDelivered => throw _privateConstructorUsedError;
  double get rating => throw _privateConstructorUsedError;
  double get earnings => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $LeaderboardEntryCopyWith<LeaderboardEntry> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $LeaderboardEntryCopyWith<$Res> {
  factory $LeaderboardEntryCopyWith(
    LeaderboardEntry value,
    $Res Function(LeaderboardEntry) then,
  ) = _$LeaderboardEntryCopyWithImpl<$Res, LeaderboardEntry>;
  @useResult
  $Res call({
    int rank,
    String partnerId,
    String partnerName,
    String? photoUrl,
    int ordersDelivered,
    double rating,
    double earnings,
  });
}

/// @nodoc
class _$LeaderboardEntryCopyWithImpl<$Res, $Val extends LeaderboardEntry>
    implements $LeaderboardEntryCopyWith<$Res> {
  _$LeaderboardEntryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? rank = null,
    Object? partnerId = null,
    Object? partnerName = null,
    Object? photoUrl = freezed,
    Object? ordersDelivered = null,
    Object? rating = null,
    Object? earnings = null,
  }) {
    return _then(
      _value.copyWith(
            rank: null == rank
                ? _value.rank
                : rank // ignore: cast_nullable_to_non_nullable
                      as int,
            partnerId: null == partnerId
                ? _value.partnerId
                : partnerId // ignore: cast_nullable_to_non_nullable
                      as String,
            partnerName: null == partnerName
                ? _value.partnerName
                : partnerName // ignore: cast_nullable_to_non_nullable
                      as String,
            photoUrl: freezed == photoUrl
                ? _value.photoUrl
                : photoUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            ordersDelivered: null == ordersDelivered
                ? _value.ordersDelivered
                : ordersDelivered // ignore: cast_nullable_to_non_nullable
                      as int,
            rating: null == rating
                ? _value.rating
                : rating // ignore: cast_nullable_to_non_nullable
                      as double,
            earnings: null == earnings
                ? _value.earnings
                : earnings // ignore: cast_nullable_to_non_nullable
                      as double,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$LeaderboardEntryImplCopyWith<$Res>
    implements $LeaderboardEntryCopyWith<$Res> {
  factory _$$LeaderboardEntryImplCopyWith(
    _$LeaderboardEntryImpl value,
    $Res Function(_$LeaderboardEntryImpl) then,
  ) = __$$LeaderboardEntryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    int rank,
    String partnerId,
    String partnerName,
    String? photoUrl,
    int ordersDelivered,
    double rating,
    double earnings,
  });
}

/// @nodoc
class __$$LeaderboardEntryImplCopyWithImpl<$Res>
    extends _$LeaderboardEntryCopyWithImpl<$Res, _$LeaderboardEntryImpl>
    implements _$$LeaderboardEntryImplCopyWith<$Res> {
  __$$LeaderboardEntryImplCopyWithImpl(
    _$LeaderboardEntryImpl _value,
    $Res Function(_$LeaderboardEntryImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? rank = null,
    Object? partnerId = null,
    Object? partnerName = null,
    Object? photoUrl = freezed,
    Object? ordersDelivered = null,
    Object? rating = null,
    Object? earnings = null,
  }) {
    return _then(
      _$LeaderboardEntryImpl(
        rank: null == rank
            ? _value.rank
            : rank // ignore: cast_nullable_to_non_nullable
                  as int,
        partnerId: null == partnerId
            ? _value.partnerId
            : partnerId // ignore: cast_nullable_to_non_nullable
                  as String,
        partnerName: null == partnerName
            ? _value.partnerName
            : partnerName // ignore: cast_nullable_to_non_nullable
                  as String,
        photoUrl: freezed == photoUrl
            ? _value.photoUrl
            : photoUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        ordersDelivered: null == ordersDelivered
            ? _value.ordersDelivered
            : ordersDelivered // ignore: cast_nullable_to_non_nullable
                  as int,
        rating: null == rating
            ? _value.rating
            : rating // ignore: cast_nullable_to_non_nullable
                  as double,
        earnings: null == earnings
            ? _value.earnings
            : earnings // ignore: cast_nullable_to_non_nullable
                  as double,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$LeaderboardEntryImpl implements _LeaderboardEntry {
  const _$LeaderboardEntryImpl({
    required this.rank,
    required this.partnerId,
    required this.partnerName,
    this.photoUrl,
    required this.ordersDelivered,
    required this.rating,
    required this.earnings,
  });

  factory _$LeaderboardEntryImpl.fromJson(Map<String, dynamic> json) =>
      _$$LeaderboardEntryImplFromJson(json);

  @override
  final int rank;
  @override
  final String partnerId;
  @override
  final String partnerName;
  @override
  final String? photoUrl;
  @override
  final int ordersDelivered;
  @override
  final double rating;
  @override
  final double earnings;

  @override
  String toString() {
    return 'LeaderboardEntry(rank: $rank, partnerId: $partnerId, partnerName: $partnerName, photoUrl: $photoUrl, ordersDelivered: $ordersDelivered, rating: $rating, earnings: $earnings)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$LeaderboardEntryImpl &&
            (identical(other.rank, rank) || other.rank == rank) &&
            (identical(other.partnerId, partnerId) ||
                other.partnerId == partnerId) &&
            (identical(other.partnerName, partnerName) ||
                other.partnerName == partnerName) &&
            (identical(other.photoUrl, photoUrl) ||
                other.photoUrl == photoUrl) &&
            (identical(other.ordersDelivered, ordersDelivered) ||
                other.ordersDelivered == ordersDelivered) &&
            (identical(other.rating, rating) || other.rating == rating) &&
            (identical(other.earnings, earnings) ||
                other.earnings == earnings));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    rank,
    partnerId,
    partnerName,
    photoUrl,
    ordersDelivered,
    rating,
    earnings,
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$LeaderboardEntryImplCopyWith<_$LeaderboardEntryImpl> get copyWith =>
      __$$LeaderboardEntryImplCopyWithImpl<_$LeaderboardEntryImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$LeaderboardEntryImplToJson(this);
  }
}

abstract class _LeaderboardEntry implements LeaderboardEntry {
  const factory _LeaderboardEntry({
    required final int rank,
    required final String partnerId,
    required final String partnerName,
    final String? photoUrl,
    required final int ordersDelivered,
    required final double rating,
    required final double earnings,
  }) = _$LeaderboardEntryImpl;

  factory _LeaderboardEntry.fromJson(Map<String, dynamic> json) =
      _$LeaderboardEntryImpl.fromJson;

  @override
  int get rank;
  @override
  String get partnerId;
  @override
  String get partnerName;
  @override
  String? get photoUrl;
  @override
  int get ordersDelivered;
  @override
  double get rating;
  @override
  double get earnings;
  @override
  @JsonKey(ignore: true)
  _$$LeaderboardEntryImplCopyWith<_$LeaderboardEntryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
