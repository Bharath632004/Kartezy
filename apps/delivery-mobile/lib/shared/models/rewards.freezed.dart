// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'rewards.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

RewardPoints _$RewardPointsFromJson(Map<String, dynamic> json) {
  return _RewardPoints.fromJson(json);
}

/// @nodoc
mixin _$RewardPoints {
  int get points => throw _privateConstructorUsedError;
  DateTime? get expiresAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $RewardPointsCopyWith<RewardPoints> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RewardPointsCopyWith<$Res> {
  factory $RewardPointsCopyWith(
    RewardPoints value,
    $Res Function(RewardPoints) then,
  ) = _$RewardPointsCopyWithImpl<$Res, RewardPoints>;
  @useResult
  $Res call({int points, DateTime? expiresAt});
}

/// @nodoc
class _$RewardPointsCopyWithImpl<$Res, $Val extends RewardPoints>
    implements $RewardPointsCopyWith<$Res> {
  _$RewardPointsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? points = null, Object? expiresAt = freezed}) {
    return _then(
      _value.copyWith(
            points: null == points
                ? _value.points
                : points // ignore: cast_nullable_to_non_nullable
                      as int,
            expiresAt: freezed == expiresAt
                ? _value.expiresAt
                : expiresAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$RewardPointsImplCopyWith<$Res>
    implements $RewardPointsCopyWith<$Res> {
  factory _$$RewardPointsImplCopyWith(
    _$RewardPointsImpl value,
    $Res Function(_$RewardPointsImpl) then,
  ) = __$$RewardPointsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({int points, DateTime? expiresAt});
}

/// @nodoc
class __$$RewardPointsImplCopyWithImpl<$Res>
    extends _$RewardPointsCopyWithImpl<$Res, _$RewardPointsImpl>
    implements _$$RewardPointsImplCopyWith<$Res> {
  __$$RewardPointsImplCopyWithImpl(
    _$RewardPointsImpl _value,
    $Res Function(_$RewardPointsImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? points = null, Object? expiresAt = freezed}) {
    return _then(
      _$RewardPointsImpl(
        points: null == points
            ? _value.points
            : points // ignore: cast_nullable_to_non_nullable
                  as int,
        expiresAt: freezed == expiresAt
            ? _value.expiresAt
            : expiresAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$RewardPointsImpl implements _RewardPoints {
  const _$RewardPointsImpl({required this.points, this.expiresAt});

  factory _$RewardPointsImpl.fromJson(Map<String, dynamic> json) =>
      _$$RewardPointsImplFromJson(json);

  @override
  final int points;
  @override
  final DateTime? expiresAt;

  @override
  String toString() {
    return 'RewardPoints(points: $points, expiresAt: $expiresAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RewardPointsImpl &&
            (identical(other.points, points) || other.points == points) &&
            (identical(other.expiresAt, expiresAt) ||
                other.expiresAt == expiresAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, points, expiresAt);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$RewardPointsImplCopyWith<_$RewardPointsImpl> get copyWith =>
      __$$RewardPointsImplCopyWithImpl<_$RewardPointsImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RewardPointsImplToJson(this);
  }
}

abstract class _RewardPoints implements RewardPoints {
  const factory _RewardPoints({
    required final int points,
    final DateTime? expiresAt,
  }) = _$RewardPointsImpl;

  factory _RewardPoints.fromJson(Map<String, dynamic> json) =
      _$RewardPointsImpl.fromJson;

  @override
  int get points;
  @override
  DateTime? get expiresAt;
  @override
  @JsonKey(ignore: true)
  _$$RewardPointsImplCopyWith<_$RewardPointsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

RewardTransaction _$RewardTransactionFromJson(Map<String, dynamic> json) {
  return _RewardTransaction.fromJson(json);
}

/// @nodoc
mixin _$RewardTransaction {
  String get id => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  int get points => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  DateTime get timestamp => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $RewardTransactionCopyWith<RewardTransaction> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RewardTransactionCopyWith<$Res> {
  factory $RewardTransactionCopyWith(
    RewardTransaction value,
    $Res Function(RewardTransaction) then,
  ) = _$RewardTransactionCopyWithImpl<$Res, RewardTransaction>;
  @useResult
  $Res call({
    String id,
    String type,
    int points,
    String description,
    DateTime timestamp,
  });
}

/// @nodoc
class _$RewardTransactionCopyWithImpl<$Res, $Val extends RewardTransaction>
    implements $RewardTransactionCopyWith<$Res> {
  _$RewardTransactionCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? type = null,
    Object? points = null,
    Object? description = null,
    Object? timestamp = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            type: null == type
                ? _value.type
                : type // ignore: cast_nullable_to_non_nullable
                      as String,
            points: null == points
                ? _value.points
                : points // ignore: cast_nullable_to_non_nullable
                      as int,
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            timestamp: null == timestamp
                ? _value.timestamp
                : timestamp // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$RewardTransactionImplCopyWith<$Res>
    implements $RewardTransactionCopyWith<$Res> {
  factory _$$RewardTransactionImplCopyWith(
    _$RewardTransactionImpl value,
    $Res Function(_$RewardTransactionImpl) then,
  ) = __$$RewardTransactionImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String type,
    int points,
    String description,
    DateTime timestamp,
  });
}

/// @nodoc
class __$$RewardTransactionImplCopyWithImpl<$Res>
    extends _$RewardTransactionCopyWithImpl<$Res, _$RewardTransactionImpl>
    implements _$$RewardTransactionImplCopyWith<$Res> {
  __$$RewardTransactionImplCopyWithImpl(
    _$RewardTransactionImpl _value,
    $Res Function(_$RewardTransactionImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? type = null,
    Object? points = null,
    Object? description = null,
    Object? timestamp = null,
  }) {
    return _then(
      _$RewardTransactionImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        type: null == type
            ? _value.type
            : type // ignore: cast_nullable_to_non_nullable
                  as String,
        points: null == points
            ? _value.points
            : points // ignore: cast_nullable_to_non_nullable
                  as int,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        timestamp: null == timestamp
            ? _value.timestamp
            : timestamp // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$RewardTransactionImpl implements _RewardTransaction {
  const _$RewardTransactionImpl({
    required this.id,
    required this.type,
    required this.points,
    required this.description,
    required this.timestamp,
  });

  factory _$RewardTransactionImpl.fromJson(Map<String, dynamic> json) =>
      _$$RewardTransactionImplFromJson(json);

  @override
  final String id;
  @override
  final String type;
  @override
  final int points;
  @override
  final String description;
  @override
  final DateTime timestamp;

  @override
  String toString() {
    return 'RewardTransaction(id: $id, type: $type, points: $points, description: $description, timestamp: $timestamp)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RewardTransactionImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.points, points) || other.points == points) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.timestamp, timestamp) ||
                other.timestamp == timestamp));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, type, points, description, timestamp);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$RewardTransactionImplCopyWith<_$RewardTransactionImpl> get copyWith =>
      __$$RewardTransactionImplCopyWithImpl<_$RewardTransactionImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$RewardTransactionImplToJson(this);
  }
}

abstract class _RewardTransaction implements RewardTransaction {
  const factory _RewardTransaction({
    required final String id,
    required final String type,
    required final int points,
    required final String description,
    required final DateTime timestamp,
  }) = _$RewardTransactionImpl;

  factory _RewardTransaction.fromJson(Map<String, dynamic> json) =
      _$RewardTransactionImpl.fromJson;

  @override
  String get id;
  @override
  String get type;
  @override
  int get points;
  @override
  String get description;
  @override
  DateTime get timestamp;
  @override
  @JsonKey(ignore: true)
  _$$RewardTransactionImplCopyWith<_$RewardTransactionImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

RewardLevel _$RewardLevelFromJson(Map<String, dynamic> json) {
  return _RewardLevel.fromJson(json);
}

/// @nodoc
mixin _$RewardLevel {
  String get level => throw _privateConstructorUsedError;
  int get minPoints => throw _privateConstructorUsedError;
  List<String> get benefits => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $RewardLevelCopyWith<RewardLevel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RewardLevelCopyWith<$Res> {
  factory $RewardLevelCopyWith(
    RewardLevel value,
    $Res Function(RewardLevel) then,
  ) = _$RewardLevelCopyWithImpl<$Res, RewardLevel>;
  @useResult
  $Res call({String level, int minPoints, List<String> benefits});
}

/// @nodoc
class _$RewardLevelCopyWithImpl<$Res, $Val extends RewardLevel>
    implements $RewardLevelCopyWith<$Res> {
  _$RewardLevelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? level = null,
    Object? minPoints = null,
    Object? benefits = null,
  }) {
    return _then(
      _value.copyWith(
            level: null == level
                ? _value.level
                : level // ignore: cast_nullable_to_non_nullable
                      as String,
            minPoints: null == minPoints
                ? _value.minPoints
                : minPoints // ignore: cast_nullable_to_non_nullable
                      as int,
            benefits: null == benefits
                ? _value.benefits
                : benefits // ignore: cast_nullable_to_non_nullable
                      as List<String>,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$RewardLevelImplCopyWith<$Res>
    implements $RewardLevelCopyWith<$Res> {
  factory _$$RewardLevelImplCopyWith(
    _$RewardLevelImpl value,
    $Res Function(_$RewardLevelImpl) then,
  ) = __$$RewardLevelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String level, int minPoints, List<String> benefits});
}

/// @nodoc
class __$$RewardLevelImplCopyWithImpl<$Res>
    extends _$RewardLevelCopyWithImpl<$Res, _$RewardLevelImpl>
    implements _$$RewardLevelImplCopyWith<$Res> {
  __$$RewardLevelImplCopyWithImpl(
    _$RewardLevelImpl _value,
    $Res Function(_$RewardLevelImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? level = null,
    Object? minPoints = null,
    Object? benefits = null,
  }) {
    return _then(
      _$RewardLevelImpl(
        level: null == level
            ? _value.level
            : level // ignore: cast_nullable_to_non_nullable
                  as String,
        minPoints: null == minPoints
            ? _value.minPoints
            : minPoints // ignore: cast_nullable_to_non_nullable
                  as int,
        benefits: null == benefits
            ? _value._benefits
            : benefits // ignore: cast_nullable_to_non_nullable
                  as List<String>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$RewardLevelImpl implements _RewardLevel {
  const _$RewardLevelImpl({
    required this.level,
    required this.minPoints,
    required final List<String> benefits,
  }) : _benefits = benefits;

  factory _$RewardLevelImpl.fromJson(Map<String, dynamic> json) =>
      _$$RewardLevelImplFromJson(json);

  @override
  final String level;
  @override
  final int minPoints;
  final List<String> _benefits;
  @override
  List<String> get benefits {
    if (_benefits is EqualUnmodifiableListView) return _benefits;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_benefits);
  }

  @override
  String toString() {
    return 'RewardLevel(level: $level, minPoints: $minPoints, benefits: $benefits)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RewardLevelImpl &&
            (identical(other.level, level) || other.level == level) &&
            (identical(other.minPoints, minPoints) ||
                other.minPoints == minPoints) &&
            const DeepCollectionEquality().equals(other._benefits, _benefits));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    level,
    minPoints,
    const DeepCollectionEquality().hash(_benefits),
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$RewardLevelImplCopyWith<_$RewardLevelImpl> get copyWith =>
      __$$RewardLevelImplCopyWithImpl<_$RewardLevelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RewardLevelImplToJson(this);
  }
}

abstract class _RewardLevel implements RewardLevel {
  const factory _RewardLevel({
    required final String level,
    required final int minPoints,
    required final List<String> benefits,
  }) = _$RewardLevelImpl;

  factory _RewardLevel.fromJson(Map<String, dynamic> json) =
      _$RewardLevelImpl.fromJson;

  @override
  String get level;
  @override
  int get minPoints;
  @override
  List<String> get benefits;
  @override
  @JsonKey(ignore: true)
  _$$RewardLevelImplCopyWith<_$RewardLevelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

Reward _$RewardFromJson(Map<String, dynamic> json) {
  return _Reward.fromJson(json);
}

/// @nodoc
mixin _$Reward {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  int get pointsRequired => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $RewardCopyWith<Reward> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RewardCopyWith<$Res> {
  factory $RewardCopyWith(Reward value, $Res Function(Reward) then) =
      _$RewardCopyWithImpl<$Res, Reward>;
  @useResult
  $Res call({String id, String name, String description, int pointsRequired});
}

/// @nodoc
class _$RewardCopyWithImpl<$Res, $Val extends Reward>
    implements $RewardCopyWith<$Res> {
  _$RewardCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = null,
    Object? pointsRequired = null,
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
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            pointsRequired: null == pointsRequired
                ? _value.pointsRequired
                : pointsRequired // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$RewardImplCopyWith<$Res> implements $RewardCopyWith<$Res> {
  factory _$$RewardImplCopyWith(
    _$RewardImpl value,
    $Res Function(_$RewardImpl) then,
  ) = __$$RewardImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String name, String description, int pointsRequired});
}

/// @nodoc
class __$$RewardImplCopyWithImpl<$Res>
    extends _$RewardCopyWithImpl<$Res, _$RewardImpl>
    implements _$$RewardImplCopyWith<$Res> {
  __$$RewardImplCopyWithImpl(
    _$RewardImpl _value,
    $Res Function(_$RewardImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = null,
    Object? pointsRequired = null,
  }) {
    return _then(
      _$RewardImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        pointsRequired: null == pointsRequired
            ? _value.pointsRequired
            : pointsRequired // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$RewardImpl implements _Reward {
  const _$RewardImpl({
    required this.id,
    required this.name,
    required this.description,
    required this.pointsRequired,
  });

  factory _$RewardImpl.fromJson(Map<String, dynamic> json) =>
      _$$RewardImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String description;
  @override
  final int pointsRequired;

  @override
  String toString() {
    return 'Reward(id: $id, name: $name, description: $description, pointsRequired: $pointsRequired)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RewardImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.pointsRequired, pointsRequired) ||
                other.pointsRequired == pointsRequired));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, name, description, pointsRequired);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$RewardImplCopyWith<_$RewardImpl> get copyWith =>
      __$$RewardImplCopyWithImpl<_$RewardImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RewardImplToJson(this);
  }
}

abstract class _Reward implements Reward {
  const factory _Reward({
    required final String id,
    required final String name,
    required final String description,
    required final int pointsRequired,
  }) = _$RewardImpl;

  factory _Reward.fromJson(Map<String, dynamic> json) = _$RewardImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get description;
  @override
  int get pointsRequired;
  @override
  @JsonKey(ignore: true)
  _$$RewardImplCopyWith<_$RewardImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
