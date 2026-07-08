// lib/shared/models/banner.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'banner.freezed.dart';
part 'banner.g.dart';

@freeze class Banner with _$Banner {
  const Banner({
    required this.id,
    required this.imageUrl,
    required this.targetUrl,
    this.targetType, // e.g., 'category', 'product', 'store'
    this.title,
  });

  factory Banner.fromJson(Map<String, dynamic> json) => _$BannerFromJson(json);
  Map<String, String> toJson() => _$BannerToJson(this);

  final String id;
  final String imageUrl;
  final String targetUrl;
  final String? targetType;
  final String? title;
}