@Freezed()
class Banner with _$Banner {
  const factory Banner({
    required this.id,
    required this.imageUrl,
    required this.targetUrl,
    this.targetType, // e.g., 'category', 'product', 'store'
    this.title,
  }) = _Banner;

  factory Banner.fromJson(Map<String, dynamic> json) => _$BannerFromJson(json);
  Map<String, String> toJson() => _$BannerToJson(this);

  final String id;
  final String imageUrl;
  final String targetUrl;
  final String? targetType;
  final String? title;
}
