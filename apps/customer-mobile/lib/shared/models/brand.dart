import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'brand.freezed.dart';
part 'brand.g.dart';

@freezed
@JsonSerializable()
class Brand with _$Brand {
  const factory Brand({
    required String id,
    required String name,
    required String imageUrl,
  }) = _Brand;

  factory Brand.fromJson(Map<String, dynamic> json) => _$BrandFromJson(json);
  Map<String, dynamic> toJson() => _$BrandToJson(this);
}