// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'product_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

ProductModel _$ProductModelFromJson(Map<String, dynamic> json) {
  return _ProductModel.fromJson(json);
}

/// @nodoc
mixin _$ProductModel {
  String? get id => throw _privateConstructorUsedError;
  String? get name => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get sku => throw _privateConstructorUsedError;
  double? get price => throw _privateConstructorUsedError;
  String? get currency => throw _privateConstructorUsedError;
  String? get imageUrl => throw _privateConstructorUsedError;
  List<String>? get images => throw _privateConstructorUsedError;
  bool? get isActive => throw _privateConstructorUsedError;
  Map<String, dynamic>? get attributes => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  DateTime? get createdAt => throw _privateConstructorUsedError;
  @JsonKey(name: 'updated_at')
  DateTime? get updatedAt => throw _privateConstructorUsedError; // Additional fields for product management
  String? get categoryId => throw _privateConstructorUsedError;
  String? get subCategoryId => throw _privateConstructorUsedError;
  String? get brandId => throw _privateConstructorUsedError;
  List<Variant>? get variants => throw _privateConstructorUsedError;
  String? get barcode => throw _privateConstructorUsedError;
  String? get hsnCode => throw _privateConstructorUsedError;
  String? get unit => throw _privateConstructorUsedError;
  double? get weight => throw _privateConstructorUsedError;
  Dimension? get dimensions => throw _privateConstructorUsedError;
  String? get productDescription => throw _privateConstructorUsedError;
  String? get ingredients => throw _privateConstructorUsedError;
  String? get nutrition => throw _privateConstructorUsedError;
  int? get shelfLife => throw _privateConstructorUsedError; // in days
  DateTime? get expiryDate => throw _privateConstructorUsedError;
  String? get manufacturer => throw _privateConstructorUsedError;
  String? get countryOfOrigin => throw _privateConstructorUsedError;
  String? get seoTitle => throw _privateConstructorUsedError;
  String? get seoDescription => throw _privateConstructorUsedError;
  String? get seoKeywords => throw _privateConstructorUsedError;
  List<String>? get tags => throw _privateConstructorUsedError; // Pricing
  double? get mrp => throw _privateConstructorUsedError;
  double? get sellingPrice => throw _privateConstructorUsedError;
  double? get costPrice => throw _privateConstructorUsedError;
  double? get discount => throw _privateConstructorUsedError;
  double? get flashSalePrice => throw _privateConstructorUsedError;
  double? get membershipPrice => throw _privateConstructorUsedError;
  double? get comboPrice => throw _privateConstructorUsedError;
  double? get tax => throw _privateConstructorUsedError; // GST percentage
  bool? get dynamicPricingEnabled => throw _privateConstructorUsedError;

  /// Serializes this ProductModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ProductModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ProductModelCopyWith<ProductModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ProductModelCopyWith<$Res> {
  factory $ProductModelCopyWith(
    ProductModel value,
    $Res Function(ProductModel) then,
  ) = _$ProductModelCopyWithImpl<$Res, ProductModel>;
  @useResult
  $Res call({
    String? id,
    String? name,
    String? description,
    String? sku,
    double? price,
    String? currency,
    String? imageUrl,
    List<String>? images,
    bool? isActive,
    Map<String, dynamic>? attributes,
    @JsonKey(name: 'created_at') DateTime? createdAt,
    @JsonKey(name: 'updated_at') DateTime? updatedAt,
    String? categoryId,
    String? subCategoryId,
    String? brandId,
    List<Variant>? variants,
    String? barcode,
    String? hsnCode,
    String? unit,
    double? weight,
    Dimension? dimensions,
    String? productDescription,
    String? ingredients,
    String? nutrition,
    int? shelfLife,
    DateTime? expiryDate,
    String? manufacturer,
    String? countryOfOrigin,
    String? seoTitle,
    String? seoDescription,
    String? seoKeywords,
    List<String>? tags,
    double? mrp,
    double? sellingPrice,
    double? costPrice,
    double? discount,
    double? flashSalePrice,
    double? membershipPrice,
    double? comboPrice,
    double? tax,
    bool? dynamicPricingEnabled,
  });

  $DimensionCopyWith<$Res>? get dimensions;
}

/// @nodoc
class _$ProductModelCopyWithImpl<$Res, $Val extends ProductModel>
    implements $ProductModelCopyWith<$Res> {
  _$ProductModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ProductModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? name = freezed,
    Object? description = freezed,
    Object? sku = freezed,
    Object? price = freezed,
    Object? currency = freezed,
    Object? imageUrl = freezed,
    Object? images = freezed,
    Object? isActive = freezed,
    Object? attributes = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
    Object? categoryId = freezed,
    Object? subCategoryId = freezed,
    Object? brandId = freezed,
    Object? variants = freezed,
    Object? barcode = freezed,
    Object? hsnCode = freezed,
    Object? unit = freezed,
    Object? weight = freezed,
    Object? dimensions = freezed,
    Object? productDescription = freezed,
    Object? ingredients = freezed,
    Object? nutrition = freezed,
    Object? shelfLife = freezed,
    Object? expiryDate = freezed,
    Object? manufacturer = freezed,
    Object? countryOfOrigin = freezed,
    Object? seoTitle = freezed,
    Object? seoDescription = freezed,
    Object? seoKeywords = freezed,
    Object? tags = freezed,
    Object? mrp = freezed,
    Object? sellingPrice = freezed,
    Object? costPrice = freezed,
    Object? discount = freezed,
    Object? flashSalePrice = freezed,
    Object? membershipPrice = freezed,
    Object? comboPrice = freezed,
    Object? tax = freezed,
    Object? dynamicPricingEnabled = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: freezed == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String?,
            name: freezed == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String?,
            description: freezed == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String?,
            sku: freezed == sku
                ? _value.sku
                : sku // ignore: cast_nullable_to_non_nullable
                      as String?,
            price: freezed == price
                ? _value.price
                : price // ignore: cast_nullable_to_non_nullable
                      as double?,
            currency: freezed == currency
                ? _value.currency
                : currency // ignore: cast_nullable_to_non_nullable
                      as String?,
            imageUrl: freezed == imageUrl
                ? _value.imageUrl
                : imageUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            images: freezed == images
                ? _value.images
                : images // ignore: cast_nullable_to_non_nullable
                      as List<String>?,
            isActive: freezed == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool?,
            attributes: freezed == attributes
                ? _value.attributes
                : attributes // ignore: cast_nullable_to_non_nullable
                      as Map<String, dynamic>?,
            createdAt: freezed == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            updatedAt: freezed == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            categoryId: freezed == categoryId
                ? _value.categoryId
                : categoryId // ignore: cast_nullable_to_non_nullable
                      as String?,
            subCategoryId: freezed == subCategoryId
                ? _value.subCategoryId
                : subCategoryId // ignore: cast_nullable_to_non_nullable
                      as String?,
            brandId: freezed == brandId
                ? _value.brandId
                : brandId // ignore: cast_nullable_to_non_nullable
                      as String?,
            variants: freezed == variants
                ? _value.variants
                : variants // ignore: cast_nullable_to_non_nullable
                      as List<Variant>?,
            barcode: freezed == barcode
                ? _value.barcode
                : barcode // ignore: cast_nullable_to_non_nullable
                      as String?,
            hsnCode: freezed == hsnCode
                ? _value.hsnCode
                : hsnCode // ignore: cast_nullable_to_non_nullable
                      as String?,
            unit: freezed == unit
                ? _value.unit
                : unit // ignore: cast_nullable_to_non_nullable
                      as String?,
            weight: freezed == weight
                ? _value.weight
                : weight // ignore: cast_nullable_to_non_nullable
                      as double?,
            dimensions: freezed == dimensions
                ? _value.dimensions
                : dimensions // ignore: cast_nullable_to_non_nullable
                      as Dimension?,
            productDescription: freezed == productDescription
                ? _value.productDescription
                : productDescription // ignore: cast_nullable_to_non_nullable
                      as String?,
            ingredients: freezed == ingredients
                ? _value.ingredients
                : ingredients // ignore: cast_nullable_to_non_nullable
                      as String?,
            nutrition: freezed == nutrition
                ? _value.nutrition
                : nutrition // ignore: cast_nullable_to_non_nullable
                      as String?,
            shelfLife: freezed == shelfLife
                ? _value.shelfLife
                : shelfLife // ignore: cast_nullable_to_non_nullable
                      as int?,
            expiryDate: freezed == expiryDate
                ? _value.expiryDate
                : expiryDate // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            manufacturer: freezed == manufacturer
                ? _value.manufacturer
                : manufacturer // ignore: cast_nullable_to_non_nullable
                      as String?,
            countryOfOrigin: freezed == countryOfOrigin
                ? _value.countryOfOrigin
                : countryOfOrigin // ignore: cast_nullable_to_non_nullable
                      as String?,
            seoTitle: freezed == seoTitle
                ? _value.seoTitle
                : seoTitle // ignore: cast_nullable_to_non_nullable
                      as String?,
            seoDescription: freezed == seoDescription
                ? _value.seoDescription
                : seoDescription // ignore: cast_nullable_to_non_nullable
                      as String?,
            seoKeywords: freezed == seoKeywords
                ? _value.seoKeywords
                : seoKeywords // ignore: cast_nullable_to_non_nullable
                      as String?,
            tags: freezed == tags
                ? _value.tags
                : tags // ignore: cast_nullable_to_non_nullable
                      as List<String>?,
            mrp: freezed == mrp
                ? _value.mrp
                : mrp // ignore: cast_nullable_to_non_nullable
                      as double?,
            sellingPrice: freezed == sellingPrice
                ? _value.sellingPrice
                : sellingPrice // ignore: cast_nullable_to_non_nullable
                      as double?,
            costPrice: freezed == costPrice
                ? _value.costPrice
                : costPrice // ignore: cast_nullable_to_non_nullable
                      as double?,
            discount: freezed == discount
                ? _value.discount
                : discount // ignore: cast_nullable_to_non_nullable
                      as double?,
            flashSalePrice: freezed == flashSalePrice
                ? _value.flashSalePrice
                : flashSalePrice // ignore: cast_nullable_to_non_nullable
                      as double?,
            membershipPrice: freezed == membershipPrice
                ? _value.membershipPrice
                : membershipPrice // ignore: cast_nullable_to_non_nullable
                      as double?,
            comboPrice: freezed == comboPrice
                ? _value.comboPrice
                : comboPrice // ignore: cast_nullable_to_non_nullable
                      as double?,
            tax: freezed == tax
                ? _value.tax
                : tax // ignore: cast_nullable_to_non_nullable
                      as double?,
            dynamicPricingEnabled: freezed == dynamicPricingEnabled
                ? _value.dynamicPricingEnabled
                : dynamicPricingEnabled // ignore: cast_nullable_to_non_nullable
                      as bool?,
          )
          as $Val,
    );
  }

  /// Create a copy of ProductModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $DimensionCopyWith<$Res>? get dimensions {
    if (_value.dimensions == null) {
      return null;
    }

    return $DimensionCopyWith<$Res>(_value.dimensions!, (value) {
      return _then(_value.copyWith(dimensions: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ProductModelImplCopyWith<$Res>
    implements $ProductModelCopyWith<$Res> {
  factory _$$ProductModelImplCopyWith(
    _$ProductModelImpl value,
    $Res Function(_$ProductModelImpl) then,
  ) = __$$ProductModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String? id,
    String? name,
    String? description,
    String? sku,
    double? price,
    String? currency,
    String? imageUrl,
    List<String>? images,
    bool? isActive,
    Map<String, dynamic>? attributes,
    @JsonKey(name: 'created_at') DateTime? createdAt,
    @JsonKey(name: 'updated_at') DateTime? updatedAt,
    String? categoryId,
    String? subCategoryId,
    String? brandId,
    List<Variant>? variants,
    String? barcode,
    String? hsnCode,
    String? unit,
    double? weight,
    Dimension? dimensions,
    String? productDescription,
    String? ingredients,
    String? nutrition,
    int? shelfLife,
    DateTime? expiryDate,
    String? manufacturer,
    String? countryOfOrigin,
    String? seoTitle,
    String? seoDescription,
    String? seoKeywords,
    List<String>? tags,
    double? mrp,
    double? sellingPrice,
    double? costPrice,
    double? discount,
    double? flashSalePrice,
    double? membershipPrice,
    double? comboPrice,
    double? tax,
    bool? dynamicPricingEnabled,
  });

  @override
  $DimensionCopyWith<$Res>? get dimensions;
}

/// @nodoc
class __$$ProductModelImplCopyWithImpl<$Res>
    extends _$ProductModelCopyWithImpl<$Res, _$ProductModelImpl>
    implements _$$ProductModelImplCopyWith<$Res> {
  __$$ProductModelImplCopyWithImpl(
    _$ProductModelImpl _value,
    $Res Function(_$ProductModelImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ProductModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? name = freezed,
    Object? description = freezed,
    Object? sku = freezed,
    Object? price = freezed,
    Object? currency = freezed,
    Object? imageUrl = freezed,
    Object? images = freezed,
    Object? isActive = freezed,
    Object? attributes = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
    Object? categoryId = freezed,
    Object? subCategoryId = freezed,
    Object? brandId = freezed,
    Object? variants = freezed,
    Object? barcode = freezed,
    Object? hsnCode = freezed,
    Object? unit = freezed,
    Object? weight = freezed,
    Object? dimensions = freezed,
    Object? productDescription = freezed,
    Object? ingredients = freezed,
    Object? nutrition = freezed,
    Object? shelfLife = freezed,
    Object? expiryDate = freezed,
    Object? manufacturer = freezed,
    Object? countryOfOrigin = freezed,
    Object? seoTitle = freezed,
    Object? seoDescription = freezed,
    Object? seoKeywords = freezed,
    Object? tags = freezed,
    Object? mrp = freezed,
    Object? sellingPrice = freezed,
    Object? costPrice = freezed,
    Object? discount = freezed,
    Object? flashSalePrice = freezed,
    Object? membershipPrice = freezed,
    Object? comboPrice = freezed,
    Object? tax = freezed,
    Object? dynamicPricingEnabled = freezed,
  }) {
    return _then(
      _$ProductModelImpl(
        id: freezed == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String?,
        name: freezed == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String?,
        description: freezed == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String?,
        sku: freezed == sku
            ? _value.sku
            : sku // ignore: cast_nullable_to_non_nullable
                  as String?,
        price: freezed == price
            ? _value.price
            : price // ignore: cast_nullable_to_non_nullable
                  as double?,
        currency: freezed == currency
            ? _value.currency
            : currency // ignore: cast_nullable_to_non_nullable
                  as String?,
        imageUrl: freezed == imageUrl
            ? _value.imageUrl
            : imageUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        images: freezed == images
            ? _value._images
            : images // ignore: cast_nullable_to_non_nullable
                  as List<String>?,
        isActive: freezed == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool?,
        attributes: freezed == attributes
            ? _value._attributes
            : attributes // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>?,
        createdAt: freezed == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        updatedAt: freezed == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        categoryId: freezed == categoryId
            ? _value.categoryId
            : categoryId // ignore: cast_nullable_to_non_nullable
                  as String?,
        subCategoryId: freezed == subCategoryId
            ? _value.subCategoryId
            : subCategoryId // ignore: cast_nullable_to_non_nullable
                  as String?,
        brandId: freezed == brandId
            ? _value.brandId
            : brandId // ignore: cast_nullable_to_non_nullable
                  as String?,
        variants: freezed == variants
            ? _value._variants
            : variants // ignore: cast_nullable_to_non_nullable
                  as List<Variant>?,
        barcode: freezed == barcode
            ? _value.barcode
            : barcode // ignore: cast_nullable_to_non_nullable
                  as String?,
        hsnCode: freezed == hsnCode
            ? _value.hsnCode
            : hsnCode // ignore: cast_nullable_to_non_nullable
                  as String?,
        unit: freezed == unit
            ? _value.unit
            : unit // ignore: cast_nullable_to_non_nullable
                  as String?,
        weight: freezed == weight
            ? _value.weight
            : weight // ignore: cast_nullable_to_non_nullable
                  as double?,
        dimensions: freezed == dimensions
            ? _value.dimensions
            : dimensions // ignore: cast_nullable_to_non_nullable
                  as Dimension?,
        productDescription: freezed == productDescription
            ? _value.productDescription
            : productDescription // ignore: cast_nullable_to_non_nullable
                  as String?,
        ingredients: freezed == ingredients
            ? _value.ingredients
            : ingredients // ignore: cast_nullable_to_non_nullable
                  as String?,
        nutrition: freezed == nutrition
            ? _value.nutrition
            : nutrition // ignore: cast_nullable_to_non_nullable
                  as String?,
        shelfLife: freezed == shelfLife
            ? _value.shelfLife
            : shelfLife // ignore: cast_nullable_to_non_nullable
                  as int?,
        expiryDate: freezed == expiryDate
            ? _value.expiryDate
            : expiryDate // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        manufacturer: freezed == manufacturer
            ? _value.manufacturer
            : manufacturer // ignore: cast_nullable_to_non_nullable
                  as String?,
        countryOfOrigin: freezed == countryOfOrigin
            ? _value.countryOfOrigin
            : countryOfOrigin // ignore: cast_nullable_to_non_nullable
                  as String?,
        seoTitle: freezed == seoTitle
            ? _value.seoTitle
            : seoTitle // ignore: cast_nullable_to_non_nullable
                  as String?,
        seoDescription: freezed == seoDescription
            ? _value.seoDescription
            : seoDescription // ignore: cast_nullable_to_non_nullable
                  as String?,
        seoKeywords: freezed == seoKeywords
            ? _value.seoKeywords
            : seoKeywords // ignore: cast_nullable_to_non_nullable
                  as String?,
        tags: freezed == tags
            ? _value._tags
            : tags // ignore: cast_nullable_to_non_nullable
                  as List<String>?,
        mrp: freezed == mrp
            ? _value.mrp
            : mrp // ignore: cast_nullable_to_non_nullable
                  as double?,
        sellingPrice: freezed == sellingPrice
            ? _value.sellingPrice
            : sellingPrice // ignore: cast_nullable_to_non_nullable
                  as double?,
        costPrice: freezed == costPrice
            ? _value.costPrice
            : costPrice // ignore: cast_nullable_to_non_nullable
                  as double?,
        discount: freezed == discount
            ? _value.discount
            : discount // ignore: cast_nullable_to_non_nullable
                  as double?,
        flashSalePrice: freezed == flashSalePrice
            ? _value.flashSalePrice
            : flashSalePrice // ignore: cast_nullable_to_non_nullable
                  as double?,
        membershipPrice: freezed == membershipPrice
            ? _value.membershipPrice
            : membershipPrice // ignore: cast_nullable_to_non_nullable
                  as double?,
        comboPrice: freezed == comboPrice
            ? _value.comboPrice
            : comboPrice // ignore: cast_nullable_to_non_nullable
                  as double?,
        tax: freezed == tax
            ? _value.tax
            : tax // ignore: cast_nullable_to_non_nullable
                  as double?,
        dynamicPricingEnabled: freezed == dynamicPricingEnabled
            ? _value.dynamicPricingEnabled
            : dynamicPricingEnabled // ignore: cast_nullable_to_non_nullable
                  as bool?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ProductModelImpl extends _ProductModel {
  _$ProductModelImpl({
    this.id,
    this.name,
    this.description,
    this.sku,
    this.price,
    this.currency,
    this.imageUrl,
    final List<String>? images,
    this.isActive,
    final Map<String, dynamic>? attributes,
    @JsonKey(name: 'created_at') this.createdAt,
    @JsonKey(name: 'updated_at') this.updatedAt,
    this.categoryId,
    this.subCategoryId,
    this.brandId,
    final List<Variant>? variants,
    this.barcode,
    this.hsnCode,
    this.unit,
    this.weight,
    this.dimensions,
    this.productDescription,
    this.ingredients,
    this.nutrition,
    this.shelfLife,
    this.expiryDate,
    this.manufacturer,
    this.countryOfOrigin,
    this.seoTitle,
    this.seoDescription,
    this.seoKeywords,
    final List<String>? tags,
    this.mrp,
    this.sellingPrice,
    this.costPrice,
    this.discount,
    this.flashSalePrice,
    this.membershipPrice,
    this.comboPrice,
    this.tax,
    this.dynamicPricingEnabled,
  }) : _images = images,
       _attributes = attributes,
       _variants = variants,
       _tags = tags,
       super._();

  factory _$ProductModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ProductModelImplFromJson(json);

  @override
  final String? id;
  @override
  final String? name;
  @override
  final String? description;
  @override
  final String? sku;
  @override
  final double? price;
  @override
  final String? currency;
  @override
  final String? imageUrl;
  final List<String>? _images;
  @override
  List<String>? get images {
    final value = _images;
    if (value == null) return null;
    if (_images is EqualUnmodifiableListView) return _images;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final bool? isActive;
  final Map<String, dynamic>? _attributes;
  @override
  Map<String, dynamic>? get attributes {
    final value = _attributes;
    if (value == null) return null;
    if (_attributes is EqualUnmodifiableMapView) return _attributes;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;
  @override
  @JsonKey(name: 'updated_at')
  final DateTime? updatedAt;
  // Additional fields for product management
  @override
  final String? categoryId;
  @override
  final String? subCategoryId;
  @override
  final String? brandId;
  final List<Variant>? _variants;
  @override
  List<Variant>? get variants {
    final value = _variants;
    if (value == null) return null;
    if (_variants is EqualUnmodifiableListView) return _variants;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String? barcode;
  @override
  final String? hsnCode;
  @override
  final String? unit;
  @override
  final double? weight;
  @override
  final Dimension? dimensions;
  @override
  final String? productDescription;
  @override
  final String? ingredients;
  @override
  final String? nutrition;
  @override
  final int? shelfLife;
  // in days
  @override
  final DateTime? expiryDate;
  @override
  final String? manufacturer;
  @override
  final String? countryOfOrigin;
  @override
  final String? seoTitle;
  @override
  final String? seoDescription;
  @override
  final String? seoKeywords;
  final List<String>? _tags;
  @override
  List<String>? get tags {
    final value = _tags;
    if (value == null) return null;
    if (_tags is EqualUnmodifiableListView) return _tags;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  // Pricing
  @override
  final double? mrp;
  @override
  final double? sellingPrice;
  @override
  final double? costPrice;
  @override
  final double? discount;
  @override
  final double? flashSalePrice;
  @override
  final double? membershipPrice;
  @override
  final double? comboPrice;
  @override
  final double? tax;
  // GST percentage
  @override
  final bool? dynamicPricingEnabled;

  @override
  String toString() {
    return 'ProductModel(id: $id, name: $name, description: $description, sku: $sku, price: $price, currency: $currency, imageUrl: $imageUrl, images: $images, isActive: $isActive, attributes: $attributes, createdAt: $createdAt, updatedAt: $updatedAt, categoryId: $categoryId, subCategoryId: $subCategoryId, brandId: $brandId, variants: $variants, barcode: $barcode, hsnCode: $hsnCode, unit: $unit, weight: $weight, dimensions: $dimensions, productDescription: $productDescription, ingredients: $ingredients, nutrition: $nutrition, shelfLife: $shelfLife, expiryDate: $expiryDate, manufacturer: $manufacturer, countryOfOrigin: $countryOfOrigin, seoTitle: $seoTitle, seoDescription: $seoDescription, seoKeywords: $seoKeywords, tags: $tags, mrp: $mrp, sellingPrice: $sellingPrice, costPrice: $costPrice, discount: $discount, flashSalePrice: $flashSalePrice, membershipPrice: $membershipPrice, comboPrice: $comboPrice, tax: $tax, dynamicPricingEnabled: $dynamicPricingEnabled)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ProductModelImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.sku, sku) || other.sku == sku) &&
            (identical(other.price, price) || other.price == price) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            const DeepCollectionEquality().equals(other._images, _images) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            const DeepCollectionEquality().equals(
              other._attributes,
              _attributes,
            ) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            (identical(other.categoryId, categoryId) ||
                other.categoryId == categoryId) &&
            (identical(other.subCategoryId, subCategoryId) ||
                other.subCategoryId == subCategoryId) &&
            (identical(other.brandId, brandId) || other.brandId == brandId) &&
            const DeepCollectionEquality().equals(other._variants, _variants) &&
            (identical(other.barcode, barcode) || other.barcode == barcode) &&
            (identical(other.hsnCode, hsnCode) || other.hsnCode == hsnCode) &&
            (identical(other.unit, unit) || other.unit == unit) &&
            (identical(other.weight, weight) || other.weight == weight) &&
            (identical(other.dimensions, dimensions) ||
                other.dimensions == dimensions) &&
            (identical(other.productDescription, productDescription) ||
                other.productDescription == productDescription) &&
            (identical(other.ingredients, ingredients) ||
                other.ingredients == ingredients) &&
            (identical(other.nutrition, nutrition) ||
                other.nutrition == nutrition) &&
            (identical(other.shelfLife, shelfLife) ||
                other.shelfLife == shelfLife) &&
            (identical(other.expiryDate, expiryDate) ||
                other.expiryDate == expiryDate) &&
            (identical(other.manufacturer, manufacturer) ||
                other.manufacturer == manufacturer) &&
            (identical(other.countryOfOrigin, countryOfOrigin) ||
                other.countryOfOrigin == countryOfOrigin) &&
            (identical(other.seoTitle, seoTitle) ||
                other.seoTitle == seoTitle) &&
            (identical(other.seoDescription, seoDescription) ||
                other.seoDescription == seoDescription) &&
            (identical(other.seoKeywords, seoKeywords) ||
                other.seoKeywords == seoKeywords) &&
            const DeepCollectionEquality().equals(other._tags, _tags) &&
            (identical(other.mrp, mrp) || other.mrp == mrp) &&
            (identical(other.sellingPrice, sellingPrice) ||
                other.sellingPrice == sellingPrice) &&
            (identical(other.costPrice, costPrice) ||
                other.costPrice == costPrice) &&
            (identical(other.discount, discount) ||
                other.discount == discount) &&
            (identical(other.flashSalePrice, flashSalePrice) ||
                other.flashSalePrice == flashSalePrice) &&
            (identical(other.membershipPrice, membershipPrice) ||
                other.membershipPrice == membershipPrice) &&
            (identical(other.comboPrice, comboPrice) ||
                other.comboPrice == comboPrice) &&
            (identical(other.tax, tax) || other.tax == tax) &&
            (identical(other.dynamicPricingEnabled, dynamicPricingEnabled) ||
                other.dynamicPricingEnabled == dynamicPricingEnabled));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    name,
    description,
    sku,
    price,
    currency,
    imageUrl,
    const DeepCollectionEquality().hash(_images),
    isActive,
    const DeepCollectionEquality().hash(_attributes),
    createdAt,
    updatedAt,
    categoryId,
    subCategoryId,
    brandId,
    const DeepCollectionEquality().hash(_variants),
    barcode,
    hsnCode,
    unit,
    weight,
    dimensions,
    productDescription,
    ingredients,
    nutrition,
    shelfLife,
    expiryDate,
    manufacturer,
    countryOfOrigin,
    seoTitle,
    seoDescription,
    seoKeywords,
    const DeepCollectionEquality().hash(_tags),
    mrp,
    sellingPrice,
    costPrice,
    discount,
    flashSalePrice,
    membershipPrice,
    comboPrice,
    tax,
    dynamicPricingEnabled,
  ]);

  /// Create a copy of ProductModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ProductModelImplCopyWith<_$ProductModelImpl> get copyWith =>
      __$$ProductModelImplCopyWithImpl<_$ProductModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ProductModelImplToJson(this);
  }
}

abstract class _ProductModel extends ProductModel {
  factory _ProductModel({
    final String? id,
    final String? name,
    final String? description,
    final String? sku,
    final double? price,
    final String? currency,
    final String? imageUrl,
    final List<String>? images,
    final bool? isActive,
    final Map<String, dynamic>? attributes,
    @JsonKey(name: 'created_at') final DateTime? createdAt,
    @JsonKey(name: 'updated_at') final DateTime? updatedAt,
    final String? categoryId,
    final String? subCategoryId,
    final String? brandId,
    final List<Variant>? variants,
    final String? barcode,
    final String? hsnCode,
    final String? unit,
    final double? weight,
    final Dimension? dimensions,
    final String? productDescription,
    final String? ingredients,
    final String? nutrition,
    final int? shelfLife,
    final DateTime? expiryDate,
    final String? manufacturer,
    final String? countryOfOrigin,
    final String? seoTitle,
    final String? seoDescription,
    final String? seoKeywords,
    final List<String>? tags,
    final double? mrp,
    final double? sellingPrice,
    final double? costPrice,
    final double? discount,
    final double? flashSalePrice,
    final double? membershipPrice,
    final double? comboPrice,
    final double? tax,
    final bool? dynamicPricingEnabled,
  }) = _$ProductModelImpl;
  _ProductModel._() : super._();

  factory _ProductModel.fromJson(Map<String, dynamic> json) =
      _$ProductModelImpl.fromJson;

  @override
  String? get id;
  @override
  String? get name;
  @override
  String? get description;
  @override
  String? get sku;
  @override
  double? get price;
  @override
  String? get currency;
  @override
  String? get imageUrl;
  @override
  List<String>? get images;
  @override
  bool? get isActive;
  @override
  Map<String, dynamic>? get attributes;
  @override
  @JsonKey(name: 'created_at')
  DateTime? get createdAt;
  @override
  @JsonKey(name: 'updated_at')
  DateTime? get updatedAt; // Additional fields for product management
  @override
  String? get categoryId;
  @override
  String? get subCategoryId;
  @override
  String? get brandId;
  @override
  List<Variant>? get variants;
  @override
  String? get barcode;
  @override
  String? get hsnCode;
  @override
  String? get unit;
  @override
  double? get weight;
  @override
  Dimension? get dimensions;
  @override
  String? get productDescription;
  @override
  String? get ingredients;
  @override
  String? get nutrition;
  @override
  int? get shelfLife; // in days
  @override
  DateTime? get expiryDate;
  @override
  String? get manufacturer;
  @override
  String? get countryOfOrigin;
  @override
  String? get seoTitle;
  @override
  String? get seoDescription;
  @override
  String? get seoKeywords;
  @override
  List<String>? get tags; // Pricing
  @override
  double? get mrp;
  @override
  double? get sellingPrice;
  @override
  double? get costPrice;
  @override
  double? get discount;
  @override
  double? get flashSalePrice;
  @override
  double? get membershipPrice;
  @override
  double? get comboPrice;
  @override
  double? get tax; // GST percentage
  @override
  bool? get dynamicPricingEnabled;

  /// Create a copy of ProductModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ProductModelImplCopyWith<_$ProductModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

Variant _$VariantFromJson(Map<String, dynamic> json) {
  return _Variant.fromJson(json);
}

/// @nodoc
mixin _$Variant {
  String? get id => throw _privateConstructorUsedError;
  String? get sku => throw _privateConstructorUsedError;
  String? get name => throw _privateConstructorUsedError;
  String? get value => throw _privateConstructorUsedError;
  double? get additionalPrice => throw _privateConstructorUsedError;
  bool? get isDefault => throw _privateConstructorUsedError;

  /// Serializes this Variant to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Variant
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $VariantCopyWith<Variant> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $VariantCopyWith<$Res> {
  factory $VariantCopyWith(Variant value, $Res Function(Variant) then) =
      _$VariantCopyWithImpl<$Res, Variant>;
  @useResult
  $Res call({
    String? id,
    String? sku,
    String? name,
    String? value,
    double? additionalPrice,
    bool? isDefault,
  });
}

/// @nodoc
class _$VariantCopyWithImpl<$Res, $Val extends Variant>
    implements $VariantCopyWith<$Res> {
  _$VariantCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Variant
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? sku = freezed,
    Object? name = freezed,
    Object? value = freezed,
    Object? additionalPrice = freezed,
    Object? isDefault = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: freezed == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String?,
            sku: freezed == sku
                ? _value.sku
                : sku // ignore: cast_nullable_to_non_nullable
                      as String?,
            name: freezed == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String?,
            value: freezed == value
                ? _value.value
                : value // ignore: cast_nullable_to_non_nullable
                      as String?,
            additionalPrice: freezed == additionalPrice
                ? _value.additionalPrice
                : additionalPrice // ignore: cast_nullable_to_non_nullable
                      as double?,
            isDefault: freezed == isDefault
                ? _value.isDefault
                : isDefault // ignore: cast_nullable_to_non_nullable
                      as bool?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$VariantImplCopyWith<$Res> implements $VariantCopyWith<$Res> {
  factory _$$VariantImplCopyWith(
    _$VariantImpl value,
    $Res Function(_$VariantImpl) then,
  ) = __$$VariantImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String? id,
    String? sku,
    String? name,
    String? value,
    double? additionalPrice,
    bool? isDefault,
  });
}

/// @nodoc
class __$$VariantImplCopyWithImpl<$Res>
    extends _$VariantCopyWithImpl<$Res, _$VariantImpl>
    implements _$$VariantImplCopyWith<$Res> {
  __$$VariantImplCopyWithImpl(
    _$VariantImpl _value,
    $Res Function(_$VariantImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Variant
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? sku = freezed,
    Object? name = freezed,
    Object? value = freezed,
    Object? additionalPrice = freezed,
    Object? isDefault = freezed,
  }) {
    return _then(
      _$VariantImpl(
        id: freezed == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String?,
        sku: freezed == sku
            ? _value.sku
            : sku // ignore: cast_nullable_to_non_nullable
                  as String?,
        name: freezed == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String?,
        value: freezed == value
            ? _value.value
            : value // ignore: cast_nullable_to_non_nullable
                  as String?,
        additionalPrice: freezed == additionalPrice
            ? _value.additionalPrice
            : additionalPrice // ignore: cast_nullable_to_non_nullable
                  as double?,
        isDefault: freezed == isDefault
            ? _value.isDefault
            : isDefault // ignore: cast_nullable_to_non_nullable
                  as bool?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$VariantImpl extends _Variant {
  _$VariantImpl({
    this.id,
    this.sku,
    this.name,
    this.value,
    this.additionalPrice,
    this.isDefault,
  }) : super._();

  factory _$VariantImpl.fromJson(Map<String, dynamic> json) =>
      _$$VariantImplFromJson(json);

  @override
  final String? id;
  @override
  final String? sku;
  @override
  final String? name;
  @override
  final String? value;
  @override
  final double? additionalPrice;
  @override
  final bool? isDefault;

  @override
  String toString() {
    return 'Variant(id: $id, sku: $sku, name: $name, value: $value, additionalPrice: $additionalPrice, isDefault: $isDefault)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$VariantImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.sku, sku) || other.sku == sku) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.value, value) || other.value == value) &&
            (identical(other.additionalPrice, additionalPrice) ||
                other.additionalPrice == additionalPrice) &&
            (identical(other.isDefault, isDefault) ||
                other.isDefault == isDefault));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    sku,
    name,
    value,
    additionalPrice,
    isDefault,
  );

  /// Create a copy of Variant
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$VariantImplCopyWith<_$VariantImpl> get copyWith =>
      __$$VariantImplCopyWithImpl<_$VariantImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$VariantImplToJson(this);
  }
}

abstract class _Variant extends Variant {
  factory _Variant({
    final String? id,
    final String? sku,
    final String? name,
    final String? value,
    final double? additionalPrice,
    final bool? isDefault,
  }) = _$VariantImpl;
  _Variant._() : super._();

  factory _Variant.fromJson(Map<String, dynamic> json) = _$VariantImpl.fromJson;

  @override
  String? get id;
  @override
  String? get sku;
  @override
  String? get name;
  @override
  String? get value;
  @override
  double? get additionalPrice;
  @override
  bool? get isDefault;

  /// Create a copy of Variant
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$VariantImplCopyWith<_$VariantImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

Dimension _$DimensionFromJson(Map<String, dynamic> json) {
  return _Dimension.fromJson(json);
}

/// @nodoc
mixin _$Dimension {
  double? get length => throw _privateConstructorUsedError;
  double? get width => throw _privateConstructorUsedError;
  double? get height => throw _privateConstructorUsedError;
  String? get unit => throw _privateConstructorUsedError;

  /// Serializes this Dimension to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Dimension
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DimensionCopyWith<Dimension> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DimensionCopyWith<$Res> {
  factory $DimensionCopyWith(Dimension value, $Res Function(Dimension) then) =
      _$DimensionCopyWithImpl<$Res, Dimension>;
  @useResult
  $Res call({double? length, double? width, double? height, String? unit});
}

/// @nodoc
class _$DimensionCopyWithImpl<$Res, $Val extends Dimension>
    implements $DimensionCopyWith<$Res> {
  _$DimensionCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Dimension
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? length = freezed,
    Object? width = freezed,
    Object? height = freezed,
    Object? unit = freezed,
  }) {
    return _then(
      _value.copyWith(
            length: freezed == length
                ? _value.length
                : length // ignore: cast_nullable_to_non_nullable
                      as double?,
            width: freezed == width
                ? _value.width
                : width // ignore: cast_nullable_to_non_nullable
                      as double?,
            height: freezed == height
                ? _value.height
                : height // ignore: cast_nullable_to_non_nullable
                      as double?,
            unit: freezed == unit
                ? _value.unit
                : unit // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DimensionImplCopyWith<$Res>
    implements $DimensionCopyWith<$Res> {
  factory _$$DimensionImplCopyWith(
    _$DimensionImpl value,
    $Res Function(_$DimensionImpl) then,
  ) = __$$DimensionImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({double? length, double? width, double? height, String? unit});
}

/// @nodoc
class __$$DimensionImplCopyWithImpl<$Res>
    extends _$DimensionCopyWithImpl<$Res, _$DimensionImpl>
    implements _$$DimensionImplCopyWith<$Res> {
  __$$DimensionImplCopyWithImpl(
    _$DimensionImpl _value,
    $Res Function(_$DimensionImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Dimension
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? length = freezed,
    Object? width = freezed,
    Object? height = freezed,
    Object? unit = freezed,
  }) {
    return _then(
      _$DimensionImpl(
        length: freezed == length
            ? _value.length
            : length // ignore: cast_nullable_to_non_nullable
                  as double?,
        width: freezed == width
            ? _value.width
            : width // ignore: cast_nullable_to_non_nullable
                  as double?,
        height: freezed == height
            ? _value.height
            : height // ignore: cast_nullable_to_non_nullable
                  as double?,
        unit: freezed == unit
            ? _value.unit
            : unit // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$DimensionImpl extends _Dimension {
  _$DimensionImpl({this.length, this.width, this.height, this.unit})
    : super._();

  factory _$DimensionImpl.fromJson(Map<String, dynamic> json) =>
      _$$DimensionImplFromJson(json);

  @override
  final double? length;
  @override
  final double? width;
  @override
  final double? height;
  @override
  final String? unit;

  @override
  String toString() {
    return 'Dimension(length: $length, width: $width, height: $height, unit: $unit)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DimensionImpl &&
            (identical(other.length, length) || other.length == length) &&
            (identical(other.width, width) || other.width == width) &&
            (identical(other.height, height) || other.height == height) &&
            (identical(other.unit, unit) || other.unit == unit));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, length, width, height, unit);

  /// Create a copy of Dimension
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DimensionImplCopyWith<_$DimensionImpl> get copyWith =>
      __$$DimensionImplCopyWithImpl<_$DimensionImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DimensionImplToJson(this);
  }
}

abstract class _Dimension extends Dimension {
  factory _Dimension({
    final double? length,
    final double? width,
    final double? height,
    final String? unit,
  }) = _$DimensionImpl;
  _Dimension._() : super._();

  factory _Dimension.fromJson(Map<String, dynamic> json) =
      _$DimensionImpl.fromJson;

  @override
  double? get length;
  @override
  double? get width;
  @override
  double? get height;
  @override
  String? get unit;

  /// Create a copy of Dimension
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DimensionImplCopyWith<_$DimensionImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
