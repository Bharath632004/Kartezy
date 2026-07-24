// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'faq.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

FaqItem _$FaqItemFromJson(Map<String, dynamic> json) {
  return _FaqItem.fromJson(json);
}

/// @nodoc
mixin _$FaqItem {
  String get id => throw _privateConstructorUsedError;
  String get question => throw _privateConstructorUsedError;
  String get answer => throw _privateConstructorUsedError;
  String get category => throw _privateConstructorUsedError;
  int? get sortOrder => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $FaqItemCopyWith<FaqItem> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $FaqItemCopyWith<$Res> {
  factory $FaqItemCopyWith(FaqItem value, $Res Function(FaqItem) then) =
      _$FaqItemCopyWithImpl<$Res, FaqItem>;
  @useResult
  $Res call({
    String id,
    String question,
    String answer,
    String category,
    int? sortOrder,
  });
}

/// @nodoc
class _$FaqItemCopyWithImpl<$Res, $Val extends FaqItem>
    implements $FaqItemCopyWith<$Res> {
  _$FaqItemCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? question = null,
    Object? answer = null,
    Object? category = null,
    Object? sortOrder = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            question: null == question
                ? _value.question
                : question // ignore: cast_nullable_to_non_nullable
                      as String,
            answer: null == answer
                ? _value.answer
                : answer // ignore: cast_nullable_to_non_nullable
                      as String,
            category: null == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as String,
            sortOrder: freezed == sortOrder
                ? _value.sortOrder
                : sortOrder // ignore: cast_nullable_to_non_nullable
                      as int?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$FaqItemImplCopyWith<$Res> implements $FaqItemCopyWith<$Res> {
  factory _$$FaqItemImplCopyWith(
    _$FaqItemImpl value,
    $Res Function(_$FaqItemImpl) then,
  ) = __$$FaqItemImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String question,
    String answer,
    String category,
    int? sortOrder,
  });
}

/// @nodoc
class __$$FaqItemImplCopyWithImpl<$Res>
    extends _$FaqItemCopyWithImpl<$Res, _$FaqItemImpl>
    implements _$$FaqItemImplCopyWith<$Res> {
  __$$FaqItemImplCopyWithImpl(
    _$FaqItemImpl _value,
    $Res Function(_$FaqItemImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? question = null,
    Object? answer = null,
    Object? category = null,
    Object? sortOrder = freezed,
  }) {
    return _then(
      _$FaqItemImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        question: null == question
            ? _value.question
            : question // ignore: cast_nullable_to_non_nullable
                  as String,
        answer: null == answer
            ? _value.answer
            : answer // ignore: cast_nullable_to_non_nullable
                  as String,
        category: null == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as String,
        sortOrder: freezed == sortOrder
            ? _value.sortOrder
            : sortOrder // ignore: cast_nullable_to_non_nullable
                  as int?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$FaqItemImpl implements _FaqItem {
  const _$FaqItemImpl({
    required this.id,
    required this.question,
    required this.answer,
    required this.category,
    this.sortOrder,
  });

  factory _$FaqItemImpl.fromJson(Map<String, dynamic> json) =>
      _$$FaqItemImplFromJson(json);

  @override
  final String id;
  @override
  final String question;
  @override
  final String answer;
  @override
  final String category;
  @override
  final int? sortOrder;

  @override
  String toString() {
    return 'FaqItem(id: $id, question: $question, answer: $answer, category: $category, sortOrder: $sortOrder)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$FaqItemImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.question, question) ||
                other.question == question) &&
            (identical(other.answer, answer) || other.answer == answer) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.sortOrder, sortOrder) ||
                other.sortOrder == sortOrder));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, question, answer, category, sortOrder);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$FaqItemImplCopyWith<_$FaqItemImpl> get copyWith =>
      __$$FaqItemImplCopyWithImpl<_$FaqItemImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$FaqItemImplToJson(this);
  }
}

abstract class _FaqItem implements FaqItem {
  const factory _FaqItem({
    required final String id,
    required final String question,
    required final String answer,
    required final String category,
    final int? sortOrder,
  }) = _$FaqItemImpl;

  factory _FaqItem.fromJson(Map<String, dynamic> json) = _$FaqItemImpl.fromJson;

  @override
  String get id;
  @override
  String get question;
  @override
  String get answer;
  @override
  String get category;
  @override
  int? get sortOrder;
  @override
  @JsonKey(ignore: true)
  _$$FaqItemImplCopyWith<_$FaqItemImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

TrustedContact _$TrustedContactFromJson(Map<String, dynamic> json) {
  return _TrustedContact.fromJson(json);
}

/// @nodoc
mixin _$TrustedContact {
  String get id => throw _privateConstructorUsedError;
  String get partnerId => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get phone => throw _privateConstructorUsedError;
  String? get relationship => throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $TrustedContactCopyWith<TrustedContact> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TrustedContactCopyWith<$Res> {
  factory $TrustedContactCopyWith(
    TrustedContact value,
    $Res Function(TrustedContact) then,
  ) = _$TrustedContactCopyWithImpl<$Res, TrustedContact>;
  @useResult
  $Res call({
    String id,
    String partnerId,
    String name,
    String phone,
    String? relationship,
    bool isActive,
    DateTime createdAt,
  });
}

/// @nodoc
class _$TrustedContactCopyWithImpl<$Res, $Val extends TrustedContact>
    implements $TrustedContactCopyWith<$Res> {
  _$TrustedContactCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partnerId = null,
    Object? name = null,
    Object? phone = null,
    Object? relationship = freezed,
    Object? isActive = null,
    Object? createdAt = null,
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
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            phone: null == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String,
            relationship: freezed == relationship
                ? _value.relationship
                : relationship // ignore: cast_nullable_to_non_nullable
                      as String?,
            isActive: null == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$TrustedContactImplCopyWith<$Res>
    implements $TrustedContactCopyWith<$Res> {
  factory _$$TrustedContactImplCopyWith(
    _$TrustedContactImpl value,
    $Res Function(_$TrustedContactImpl) then,
  ) = __$$TrustedContactImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String partnerId,
    String name,
    String phone,
    String? relationship,
    bool isActive,
    DateTime createdAt,
  });
}

/// @nodoc
class __$$TrustedContactImplCopyWithImpl<$Res>
    extends _$TrustedContactCopyWithImpl<$Res, _$TrustedContactImpl>
    implements _$$TrustedContactImplCopyWith<$Res> {
  __$$TrustedContactImplCopyWithImpl(
    _$TrustedContactImpl _value,
    $Res Function(_$TrustedContactImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partnerId = null,
    Object? name = null,
    Object? phone = null,
    Object? relationship = freezed,
    Object? isActive = null,
    Object? createdAt = null,
  }) {
    return _then(
      _$TrustedContactImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        partnerId: null == partnerId
            ? _value.partnerId
            : partnerId // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        phone: null == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String,
        relationship: freezed == relationship
            ? _value.relationship
            : relationship // ignore: cast_nullable_to_non_nullable
                  as String?,
        isActive: null == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$TrustedContactImpl implements _TrustedContact {
  const _$TrustedContactImpl({
    required this.id,
    required this.partnerId,
    required this.name,
    required this.phone,
    this.relationship,
    required this.isActive,
    required this.createdAt,
  });

  factory _$TrustedContactImpl.fromJson(Map<String, dynamic> json) =>
      _$$TrustedContactImplFromJson(json);

  @override
  final String id;
  @override
  final String partnerId;
  @override
  final String name;
  @override
  final String phone;
  @override
  final String? relationship;
  @override
  final bool isActive;
  @override
  final DateTime createdAt;

  @override
  String toString() {
    return 'TrustedContact(id: $id, partnerId: $partnerId, name: $name, phone: $phone, relationship: $relationship, isActive: $isActive, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TrustedContactImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.partnerId, partnerId) ||
                other.partnerId == partnerId) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.relationship, relationship) ||
                other.relationship == relationship) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    partnerId,
    name,
    phone,
    relationship,
    isActive,
    createdAt,
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$TrustedContactImplCopyWith<_$TrustedContactImpl> get copyWith =>
      __$$TrustedContactImplCopyWithImpl<_$TrustedContactImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$TrustedContactImplToJson(this);
  }
}

abstract class _TrustedContact implements TrustedContact {
  const factory _TrustedContact({
    required final String id,
    required final String partnerId,
    required final String name,
    required final String phone,
    final String? relationship,
    required final bool isActive,
    required final DateTime createdAt,
  }) = _$TrustedContactImpl;

  factory _TrustedContact.fromJson(Map<String, dynamic> json) =
      _$TrustedContactImpl.fromJson;

  @override
  String get id;
  @override
  String get partnerId;
  @override
  String get name;
  @override
  String get phone;
  @override
  String? get relationship;
  @override
  bool get isActive;
  @override
  DateTime get createdAt;
  @override
  @JsonKey(ignore: true)
  _$$TrustedContactImplCopyWith<_$TrustedContactImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

IncidentReport _$IncidentReportFromJson(Map<String, dynamic> json) {
  return _IncidentReport.fromJson(json);
}

/// @nodoc
mixin _$IncidentReport {
  String get id => throw _privateConstructorUsedError;
  String get partnerId => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  double get latitude => throw _privateConstructorUsedError;
  double get longitude => throw _privateConstructorUsedError;
  String? get orderId => throw _privateConstructorUsedError;
  List<String>? get imageUrls => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $IncidentReportCopyWith<IncidentReport> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $IncidentReportCopyWith<$Res> {
  factory $IncidentReportCopyWith(
    IncidentReport value,
    $Res Function(IncidentReport) then,
  ) = _$IncidentReportCopyWithImpl<$Res, IncidentReport>;
  @useResult
  $Res call({
    String id,
    String partnerId,
    String type,
    String description,
    double latitude,
    double longitude,
    String? orderId,
    List<String>? imageUrls,
    String status,
    DateTime createdAt,
  });
}

/// @nodoc
class _$IncidentReportCopyWithImpl<$Res, $Val extends IncidentReport>
    implements $IncidentReportCopyWith<$Res> {
  _$IncidentReportCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partnerId = null,
    Object? type = null,
    Object? description = null,
    Object? latitude = null,
    Object? longitude = null,
    Object? orderId = freezed,
    Object? imageUrls = freezed,
    Object? status = null,
    Object? createdAt = null,
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
            type: null == type
                ? _value.type
                : type // ignore: cast_nullable_to_non_nullable
                      as String,
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            latitude: null == latitude
                ? _value.latitude
                : latitude // ignore: cast_nullable_to_non_nullable
                      as double,
            longitude: null == longitude
                ? _value.longitude
                : longitude // ignore: cast_nullable_to_non_nullable
                      as double,
            orderId: freezed == orderId
                ? _value.orderId
                : orderId // ignore: cast_nullable_to_non_nullable
                      as String?,
            imageUrls: freezed == imageUrls
                ? _value.imageUrls
                : imageUrls // ignore: cast_nullable_to_non_nullable
                      as List<String>?,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as String,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$IncidentReportImplCopyWith<$Res>
    implements $IncidentReportCopyWith<$Res> {
  factory _$$IncidentReportImplCopyWith(
    _$IncidentReportImpl value,
    $Res Function(_$IncidentReportImpl) then,
  ) = __$$IncidentReportImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String partnerId,
    String type,
    String description,
    double latitude,
    double longitude,
    String? orderId,
    List<String>? imageUrls,
    String status,
    DateTime createdAt,
  });
}

/// @nodoc
class __$$IncidentReportImplCopyWithImpl<$Res>
    extends _$IncidentReportCopyWithImpl<$Res, _$IncidentReportImpl>
    implements _$$IncidentReportImplCopyWith<$Res> {
  __$$IncidentReportImplCopyWithImpl(
    _$IncidentReportImpl _value,
    $Res Function(_$IncidentReportImpl) _then,
  ) : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partnerId = null,
    Object? type = null,
    Object? description = null,
    Object? latitude = null,
    Object? longitude = null,
    Object? orderId = freezed,
    Object? imageUrls = freezed,
    Object? status = null,
    Object? createdAt = null,
  }) {
    return _then(
      _$IncidentReportImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        partnerId: null == partnerId
            ? _value.partnerId
            : partnerId // ignore: cast_nullable_to_non_nullable
                  as String,
        type: null == type
            ? _value.type
            : type // ignore: cast_nullable_to_non_nullable
                  as String,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        latitude: null == latitude
            ? _value.latitude
            : latitude // ignore: cast_nullable_to_non_nullable
                  as double,
        longitude: null == longitude
            ? _value.longitude
            : longitude // ignore: cast_nullable_to_non_nullable
                  as double,
        orderId: freezed == orderId
            ? _value.orderId
            : orderId // ignore: cast_nullable_to_non_nullable
                  as String?,
        imageUrls: freezed == imageUrls
            ? _value._imageUrls
            : imageUrls // ignore: cast_nullable_to_non_nullable
                  as List<String>?,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as String,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$IncidentReportImpl implements _IncidentReport {
  const _$IncidentReportImpl({
    required this.id,
    required this.partnerId,
    required this.type,
    required this.description,
    required this.latitude,
    required this.longitude,
    this.orderId,
    final List<String>? imageUrls,
    required this.status,
    required this.createdAt,
  }) : _imageUrls = imageUrls;

  factory _$IncidentReportImpl.fromJson(Map<String, dynamic> json) =>
      _$$IncidentReportImplFromJson(json);

  @override
  final String id;
  @override
  final String partnerId;
  @override
  final String type;
  @override
  final String description;
  @override
  final double latitude;
  @override
  final double longitude;
  @override
  final String? orderId;
  final List<String>? _imageUrls;
  @override
  List<String>? get imageUrls {
    final value = _imageUrls;
    if (value == null) return null;
    if (_imageUrls is EqualUnmodifiableListView) return _imageUrls;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String status;
  @override
  final DateTime createdAt;

  @override
  String toString() {
    return 'IncidentReport(id: $id, partnerId: $partnerId, type: $type, description: $description, latitude: $latitude, longitude: $longitude, orderId: $orderId, imageUrls: $imageUrls, status: $status, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$IncidentReportImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.partnerId, partnerId) ||
                other.partnerId == partnerId) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            (identical(other.orderId, orderId) || other.orderId == orderId) &&
            const DeepCollectionEquality().equals(
              other._imageUrls,
              _imageUrls,
            ) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    partnerId,
    type,
    description,
    latitude,
    longitude,
    orderId,
    const DeepCollectionEquality().hash(_imageUrls),
    status,
    createdAt,
  );

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$IncidentReportImplCopyWith<_$IncidentReportImpl> get copyWith =>
      __$$IncidentReportImplCopyWithImpl<_$IncidentReportImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$IncidentReportImplToJson(this);
  }
}

abstract class _IncidentReport implements IncidentReport {
  const factory _IncidentReport({
    required final String id,
    required final String partnerId,
    required final String type,
    required final String description,
    required final double latitude,
    required final double longitude,
    final String? orderId,
    final List<String>? imageUrls,
    required final String status,
    required final DateTime createdAt,
  }) = _$IncidentReportImpl;

  factory _IncidentReport.fromJson(Map<String, dynamic> json) =
      _$IncidentReportImpl.fromJson;

  @override
  String get id;
  @override
  String get partnerId;
  @override
  String get type;
  @override
  String get description;
  @override
  double get latitude;
  @override
  double get longitude;
  @override
  String? get orderId;
  @override
  List<String>? get imageUrls;
  @override
  String get status;
  @override
  DateTime get createdAt;
  @override
  @JsonKey(ignore: true)
  _$$IncidentReportImplCopyWith<_$IncidentReportImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
