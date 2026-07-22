// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'product.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Product _$ProductFromJson(Map<String, dynamic> json) {
  return _Product.fromJson(json);
}

/// @nodoc
mixin _$Product {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  String get shortDescription => throw _privateConstructorUsedError;
  double get price => throw _privateConstructorUsedError;
  double? get compareAtPrice => throw _privateConstructorUsedError;
  String get imageUrl => throw _privateConstructorUsedError;
  List<String> get images => throw _privateConstructorUsedError;
  String? get unit => throw _privateConstructorUsedError;
  int get stock => throw _privateConstructorUsedError;
  String? get sku => throw _privateConstructorUsedError;
  String? get categoryId => throw _privateConstructorUsedError;
  String? get merchantId => throw _privateConstructorUsedError;
  String? get merchantName => throw _privateConstructorUsedError;
  double? get rating => throw _privateConstructorUsedError;
  int get reviewCount => throw _privateConstructorUsedError;
  bool get isFavorite => throw _privateConstructorUsedError;
  bool get hasVariants => throw _privateConstructorUsedError;
  List<String> get tags => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $ProductCopyWith<Product> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProductCopyWith<$Res> {
  factory $ProductCopyWith(Product value, $Res Function(Product) then) =
      _$ProductCopyWithImpl<$Res, Product>;
  @useResult
  $Res call({
    String id,
    String name,
    String description,
    String shortDescription,
    double price,
    double? compareAtPrice,
    String imageUrl,
    List<String> images,
    String? unit,
    int stock,
    String? sku,
    String? categoryId,
    String? merchantId,
    String? merchantName,
    double? rating,
    int reviewCount,
    bool isFavorite,
    bool hasVariants,
    List<String> tags,
  });
}

/// @nodoc
class _$ProductCopyWithImpl<$Res, $Val extends Product>
    implements $ProductCopyWith<$Res> {
  _$ProductCopyWithImpl(this._value, this._then);

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
    Object? shortDescription = null,
    Object? price = null,
    Object? compareAtPrice = freezed,
    Object? imageUrl = null,
    Object? images = null,
    Object? unit = freezed,
    Object? stock = null,
    Object? sku = freezed,
    Object? categoryId = freezed,
    Object? merchantId = freezed,
    Object? merchantName = freezed,
    Object? rating = freezed,
    Object? reviewCount = null,
    Object? isFavorite = null,
    Object? hasVariants = null,
    Object? tags = null,
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
        shortDescription: null == shortDescription
            ? _value.shortDescription
            : shortDescription // ignore: cast_nullable_to_non_nullable
                as String,
        price: null == price
            ? _value.price
            : price // ignore: cast_nullable_to_non_nullable
                as double,
        compareAtPrice: freezed == compareAtPrice
            ? _value.compareAtPrice
            : compareAtPrice // ignore: cast_nullable_to_non_nullable
                as double?,
        imageUrl: null == imageUrl
            ? _value.imageUrl
            : imageUrl // ignore: cast_nullable_to_non_nullable
                as String,
        images: null == images
            ? _value.images
            : images // ignore: cast_nullable_to_non_nullable
                as List<String>,
        unit: freezed == unit
            ? _value.unit
            : unit // ignore: cast_nullable_to_non_nullable
                as String?,
        stock: null == stock
            ? _value.stock
            : stock // ignore: cast_nullable_to_non_nullable
                as int,
        sku: freezed == sku
            ? _value.sku
            : sku // ignore: cast_nullable_to_non_nullable
                as String?,
        categoryId: freezed == categoryId
            ? _value.categoryId
            : categoryId // ignore: cast_nullable_to_non_nullable
                as String?,
        merchantId: freezed == merchantId
            ? _value.merchantId
            : merchantId // ignore: cast_nullable_to_non_nullable
                as String?,
        merchantName: freezed == merchantName
            ? _value.merchantName
            : merchantName // ignore: cast_nullable_to_non_nullable
                as String?,
        rating: freezed == rating
            ? _value.rating
            : rating // ignore: cast_nullable_to_non_nullable
                as double?,
        reviewCount: null == reviewCount
            ? _value.reviewCount
            : reviewCount // ignore: cast_nullable_to_non_nullable
                as int,
        isFavorite: null == isFavorite
            ? _value.isFavorite
            : isFavorite // ignore: cast_nullable_to_non_nullable
                as bool,
        hasVariants: null == hasVariants
            ? _value.hasVariants
            : hasVariants // ignore: cast_nullable_to_non_nullable
                as bool,
        tags: null == tags
            ? _value.tags
            : tags // ignore: cast_nullable_to_non_nullable
                as List<String>,
      ) as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ProductImplCopyWith<$Res> implements $ProductCopyWith<$Res> {
  factory _$$ProductImplCopyWith(
          _$ProductImpl value, $Res Function(_$ProductImpl) then) =
      __$$ProductImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String description,
    String shortDescription,
    double price,
    double? compareAtPrice,
    String imageUrl,
    List<String> images,
    String? unit,
    int stock,
    String? sku,
    String? categoryId,
    String? merchantId,
    String? merchantName,
    double? rating,
    int reviewCount,
    bool isFavorite,
    bool hasVariants,
    List<String> tags,
  });
}

/// @nodoc
class __$$ProductImplCopyWithImpl<$Res>
    extends _$ProductCopyWithImpl<$Res, _$ProductImpl>
    implements _$$ProductImplCopyWith<$Res> {
  __$$ProductImplCopyWithImpl(
      _$ProductImpl _value, $Res Function(_$ProductImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = null,
    Object? shortDescription = null,
    Object? price = null,
    Object? compareAtPrice = freezed,
    Object? imageUrl = null,
    Object? images = null,
    Object? unit = freezed,
    Object? stock = null,
    Object? sku = freezed,
    Object? categoryId = freezed,
    Object? merchantId = freezed,
    Object? merchantName = freezed,
    Object? rating = freezed,
    Object? reviewCount = null,
    Object? isFavorite = null,
    Object? hasVariants = null,
    Object? tags = null,
  }) {
    return _then(
      _$ProductImpl(
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
        shortDescription: null == shortDescription
            ? _value.shortDescription
            : shortDescription // ignore: cast_nullable_to_non_nullable
                as String,
        price: null == price
            ? _value.price
            : price // ignore: cast_nullable_to_non_nullable
                as double,
        compareAtPrice: freezed == compareAtPrice
            ? _value.compareAtPrice
            : compareAtPrice // ignore: cast_nullable_to_non_nullable
                as double?,
        imageUrl: null == imageUrl
            ? _value.imageUrl
            : imageUrl // ignore: cast_nullable_to_non_nullable
                as String,
        images: null == images
            ? _value.images
            : images // ignore: cast_nullable_to_non_nullable
                as List<String>,
        unit: freezed == unit
            ? _value.unit
            : unit // ignore: cast_nullable_to_non_nullable
                as String?,
        stock: null == stock
            ? _value.stock
            : stock // ignore: cast_nullable_to_non_nullable
                as int,
        sku: freezed == sku
            ? _value.sku
            : sku // ignore: cast_nullable_to_non_nullable
                as String?,
        categoryId: freezed == categoryId
            ? _value.categoryId
            : categoryId // ignore: cast_nullable_to_non_nullable
                as String?,
        merchantId: freezed == merchantId
            ? _value.merchantId
            : merchantId // ignore: cast_nullable_to_non_nullable
                as String?,
        merchantName: freezed == merchantName
            ? _value.merchantName
            : merchantName // ignore: cast_nullable_to_non_nullable
                as String?,
        rating: freezed == rating
            ? _value.rating
            : rating // ignore: cast_nullable_to_non_nullable
                as double?,
        reviewCount: null == reviewCount
            ? _value.reviewCount
            : reviewCount // ignore: cast_nullable_to_non_nullable
                as int,
        isFavorite: null == isFavorite
            ? _value.isFavorite
            : isFavorite // ignore: cast_nullable_to_non_nullable
                as bool,
        hasVariants: null == hasVariants
            ? _value.hasVariants
            : hasVariants // ignore: cast_nullable_to_non_nullable
                as bool,
        tags: null == tags
            ? _value.tags
            : tags // ignore: cast_nullable_to_non_nullable
                as List<String>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ProductImpl implements _Product {
  const _$ProductImpl({
    required this.id,
    required this.name,
    required this.description,
    this.shortDescription = '',
    required this.price,
    this.compareAtPrice,
    required this.imageUrl,
    this.images = const [],
    this.unit,
    this.stock = 0,
    this.sku,
    this.categoryId,
    this.merchantId,
    this.merchantName,
    this.rating,
    this.reviewCount = 0,
    this.isFavorite = false,
    this.hasVariants = false,
    this.tags = const [],
  });

  factory _$ProductImpl.fromJson(Map<String, dynamic> json) =>
      _$$ProductImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String description;
  @override
  @JsonKey()
  final String shortDescription;
  @override
  final double price;
  @override
  final double? compareAtPrice;
  @override
  final String imageUrl;
  @override
  @JsonKey()
  final List<String> images;
  @override
  final String? unit;
  @override
  @JsonKey()
  final int stock;
  @override
  final String? sku;
  @override
  final String? categoryId;
  @override
  final String? merchantId;
  @override
  final String? merchantName;
  @override
  final double? rating;
  @override
  @JsonKey()
  final int reviewCount;
  @override
  @JsonKey()
  final bool isFavorite;
  @override
  @JsonKey()
  final bool hasVariants;
  @override
  @JsonKey()
  final List<String> tags;

  @override
  String toString() {
    return 'Product(id: $id, name: $name, description: $description, shortDescription: $shortDescription, price: $price, compareAtPrice: $compareAtPrice, imageUrl: $imageUrl, images: $images, unit: $unit, stock: $stock, sku: $sku, categoryId: $categoryId, merchantId: $merchantId, merchantName: $merchantName, rating: $rating, reviewCount: $reviewCount, isFavorite: $isFavorite, hasVariants: $hasVariants, tags: $tags)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProductImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.shortDescription, shortDescription) ||
                other.shortDescription == shortDescription) &&
            (identical(other.price, price) || other.price == price) &&
            (identical(other.compareAtPrice, compareAtPrice) ||
                other.compareAtPrice == compareAtPrice) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            const DeepCollectionEquality().equals(other.images, images) &&
            (identical(other.unit, unit) || other.unit == unit) &&
            (identical(other.stock, stock) || other.stock == stock) &&
            (identical(other.sku, sku) || other.sku == sku) &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId) &&
            (identical(other.merchantId, merchantId) ||
                other.merchantId == merchantId) &&
            (identical(other.merchantName, merchantName) ||
                other.merchantName == merchantName) &&
            (identical(other.rating, rating) || other.rating == rating) &&
            (identical(other.reviewCount, reviewCount) ||
                other.reviewCount == reviewCount) &&
            (identical(other.isFavorite, isFavorite) ||
                other.isFavorite == isFavorite) &&
            (identical(other.hasVariants, hasVariants) ||
                other.hasVariants == hasVariants) &&
            const DeepCollectionEquality().equals(other.tags, tags));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hashAll([
        runtimeType,
        id,
        name,
        description,
        shortDescription,
        price,
        compareAtPrice,
        imageUrl,
        const DeepCollectionEquality().hash(images),
        unit,
        stock,
        sku,
        categoryId,
        merchantId,
        merchantName,
        rating,
        reviewCount,
        isFavorite,
        hasVariants,
        const DeepCollectionEquality().hash(tags),
      ]);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$ProductImplCopyWith<_$ProductImpl> get copyWith =>
      __$$ProductImplCopyWithImpl<_$ProductImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ProductImplToJson(this);
  }
}

abstract class _Product implements Product {
  const factory _Product({
    required final String id,
    required final String name,
    required final String description,
    final String shortDescription,
    required final double price,
    final double? compareAtPrice,
    required final String imageUrl,
    final List<String> images,
    final String? unit,
    final int stock,
    final String? sku,
    final String? categoryId,
    final String? merchantId,
    final String? merchantName,
    final double? rating,
    final int reviewCount,
    final bool isFavorite,
    final bool hasVariants,
    final List<String> tags,
  }) = _$ProductImpl;

  factory _Product.fromJson(Map<String, dynamic> json) = _$ProductImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get description;
  @override
  String get shortDescription;
  @override
  double get price;
  @override
  double? get compareAtPrice;
  @override
  String get imageUrl;
  @override
  List<String> get images;
  @override
  String? get unit;
  @override
  int get stock;
  @override
  String? get sku;
  @override
  String? get categoryId;
  @override
  String? get merchantId;
  @override
  String? get merchantName;
  @override
  double? get rating;
  @override
  int get reviewCount;
  @override
  bool get isFavorite;
  @override
  bool get hasVariants;
  @override
  List<String> get tags;
  @override
  @JsonKey(ignore: true)
  _$$ProductImplCopyWith<_$ProductImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
