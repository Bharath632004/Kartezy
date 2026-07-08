import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'banner.freezed.dart';
part 'banner.g.dart';

@freezed
@JsonSerializable()
class Banner with _$Banner {
  const factory Banner({
    required String id,
    required String imageUrl,
    required String targetUrl,
    String? targetType, // e.g., 'category', 'product', 'store'
    String? title,
  }) = _Banner;

  factory Banner.fromJson(Map<String, dynamic> json) => _$BannerFromJson(json);
  Map<String, dynamic> toJson() => _$BannerToJson(this);
}