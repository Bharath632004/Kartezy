// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'review.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Review _$ReviewFromJson(Map<String, dynamic> json) {
  return _Review.fromJson(json);
}

/// @nodoc
mixin _$Review {
  String get id => throw _privateConstructorUsedError;
  String get productId => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  String get userName => throw _privateConstructorUsedError;
  double get rating => throw _privateConstructorUsedError; // 1-5 stars
  String get title => throw _privateConstructorUsedError;
  String get comment => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  bool get isVerifiedPurchase => throw _privateConstructorUsedError;
  List<String>? get images =>
      throw _privateConstructorUsedError; // URLs to review images
  List<String>? get videos =>
      throw _privateConstructorUsedError; // URLs to review videos
  int? get helpfulCount => throw _privateConstructorUsedError;
  int? get notHelpfulCount => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $ReviewCopyWith<Review> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ReviewCopyWith<$Res> {
  factory $ReviewCopyWith(Review value, $Res Function(Review) then) =
      _$ReviewCopyWithImpl<$Res, Review>;
  @useResult
  $Res call(
      {String id,
      String productId,
      String userId,
      String userName,
      double rating,
      String title,
      String comment,
      DateTime createdAt,
      bool isVerifiedPurchase,
      List<String>? images,
      List<String>? videos,
      int? helpfulCount,
      int? notHelpfulCount});
}

/// @nodoc
class _$ReviewCopyWithImpl<$Res, $Val extends Review>
    implements $ReviewCopyWith<$Res> {
  _$ReviewCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? productId = null,
    Object? userId = null,
    Object? userName = null,
    Object? rating = null,
    Object? title = null,
    Object? comment = null,
    Object? createdAt = null,
    Object? isVerifiedPurchase = null,
    Object? images = freezed,
    Object? videos = freezed,
    Object? helpfulCount = freezed,
    Object? notHelpfulCount = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      productId: null == productId
          ? _value.productId
          : productId // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      userName: null == userName
          ? _value.userName
          : userName // ignore: cast_nullable_to_non_nullable
              as String,
      rating: null == rating
          ? _value.rating
          : rating // ignore: cast_nullable_to_non_nullable
              as double,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      comment: null == comment
          ? _value.comment
          : comment // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      isVerifiedPurchase: null == isVerifiedPurchase
          ? _value.isVerifiedPurchase
          : isVerifiedPurchase // ignore: cast_nullable_to_non_nullable
              as bool,
      images: freezed == images
          ? _value.images
          : images // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      videos: freezed == videos
          ? _value.videos
          : videos // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      helpfulCount: freezed == helpfulCount
          ? _value.helpfulCount
          : helpfulCount // ignore: cast_nullable_to_non_nullable
              as int?,
      notHelpfulCount: freezed == notHelpfulCount
          ? _value.notHelpfulCount
          : notHelpfulCount // ignore: cast_nullable_to_non_nullable
              as int?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ReviewImplCopyWith<$Res> implements $ReviewCopyWith<$Res> {
  factory _$$ReviewImplCopyWith(
          _$ReviewImpl value, $Res Function(_$ReviewImpl) then) =
      __$$ReviewImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String productId,
      String userId,
      String userName,
      double rating,
      String title,
      String comment,
      DateTime createdAt,
      bool isVerifiedPurchase,
      List<String>? images,
      List<String>? videos,
      int? helpfulCount,
      int? notHelpfulCount});
}

/// @nodoc
class __$$ReviewImplCopyWithImpl<$Res>
    extends _$ReviewCopyWithImpl<$Res, _$ReviewImpl>
    implements _$$ReviewImplCopyWith<$Res> {
  __$$ReviewImplCopyWithImpl(
      _$ReviewImpl _value, $Res Function(_$ReviewImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? productId = null,
    Object? userId = null,
    Object? userName = null,
    Object? rating = null,
    Object? title = null,
    Object? comment = null,
    Object? createdAt = null,
    Object? isVerifiedPurchase = null,
    Object? images = freezed,
    Object? videos = freezed,
    Object? helpfulCount = freezed,
    Object? notHelpfulCount = freezed,
  }) {
    return _then(_$ReviewImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      productId: null == productId
          ? _value.productId
          : productId // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      userName: null == userName
          ? _value.userName
          : userName // ignore: cast_nullable_to_non_nullable
              as String,
      rating: null == rating
          ? _value.rating
          : rating // ignore: cast_nullable_to_non_nullable
              as double,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      comment: null == comment
          ? _value.comment
          : comment // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      isVerifiedPurchase: null == isVerifiedPurchase
          ? _value.isVerifiedPurchase
          : isVerifiedPurchase // ignore: cast_nullable_to_non_nullable
              as bool,
      images: freezed == images
          ? _value._images
          : images // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      videos: freezed == videos
          ? _value._videos
          : videos // ignore: cast_nullable_to_non_nullable
              as List<String>?,
      helpfulCount: freezed == helpfulCount
          ? _value.helpfulCount
          : helpfulCount // ignore: cast_nullable_to_non_nullable
              as int?,
      notHelpfulCount: freezed == notHelpfulCount
          ? _value.notHelpfulCount
          : notHelpfulCount // ignore: cast_nullable_to_non_nullable
              as int?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ReviewImpl implements _Review {
  const _$ReviewImpl(
      {required this.id,
      required this.productId,
      required this.userId,
      required this.userName,
      required this.rating,
      required this.title,
      required this.comment,
      required this.createdAt,
      required this.isVerifiedPurchase,
      final List<String>? images,
      final List<String>? videos,
      this.helpfulCount,
      this.notHelpfulCount})
      : _images = images,
        _videos = videos;

  factory _$ReviewImpl.fromJson(Map<String, dynamic> json) =>
      _$$ReviewImplFromJson(json);

  @override
  final String id;
  @override
  final String productId;
  @override
  final String userId;
  @override
  final String userName;
  @override
  final double rating;
// 1-5 stars
  @override
  final String title;
  @override
  final String comment;
  @override
  final DateTime createdAt;
  @override
  final bool isVerifiedPurchase;
  final List<String>? _images;
  @override
  List<String>? get images {
    final value = _images;
    if (value == null) return null;
    if (_images is EqualUnmodifiableListView) return _images;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

// URLs to review images
  final List<String>? _videos;
// URLs to review images
  @override
  List<String>? get videos {
    final value = _videos;
    if (value == null) return null;
    if (_videos is EqualUnmodifiableListView) return _videos;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

// URLs to review videos
  @override
  final int? helpfulCount;
  @override
  final int? notHelpfulCount;

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$ReviewImplCopyWith<_$ReviewImpl> get copyWith =>
      __$$ReviewImplCopyWithImpl<_$ReviewImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ReviewImplToJson(
      this,
    );
  }
}

abstract class _Review implements Review {
  const factory _Review(
      {required final String id,
      required final String productId,
      required final String userId,
      required final String userName,
      required final double rating,
      required final String title,
      required final String comment,
      required final DateTime createdAt,
      required final bool isVerifiedPurchase,
      final List<String>? images,
      final List<String>? videos,
      final int? helpfulCount,
      final int? notHelpfulCount}) = _$ReviewImpl;

  factory _Review.fromJson(Map<String, dynamic> json) = _$ReviewImpl.fromJson;

  @override
  String get id;
  @override
  String get productId;
  @override
  String get userId;
  @override
  String get userName;
  @override
  double get rating;
  @override // 1-5 stars
  String get title;
  @override
  String get comment;
  @override
  DateTime get createdAt;
  @override
  bool get isVerifiedPurchase;
  @override
  List<String>? get images;
  @override // URLs to review images
  List<String>? get videos;
  @override // URLs to review videos
  int? get helpfulCount;
  @override
  int? get notHelpfulCount;
  @override
  @JsonKey(ignore: true)
  _$$ReviewImplCopyWith<_$ReviewImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
