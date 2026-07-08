// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'review.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Review _$ReviewFromJson(Map<String, dynamic> json) => Review(
  id: json['id'] as String,
  productId: json['productId'] as String,
  userId: json['userId'] as String,
  userName: json['userName'] as String,
  rating: (json['rating'] as num).toDouble(),
  title: json['title'] as String,
  comment: json['comment'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  isVerifiedPurchase: json['isVerifiedPurchase'] as bool,
  images: (json['images'] as List<dynamic>?)?.map((e) => e as String).toList(),
  videos: (json['videos'] as List<dynamic>?)?.map((e) => e as String).toList(),
  helpfulCount: (json['helpfulCount'] as num?)?.toInt(),
  notHelpfulCount: (json['notHelpfulCount'] as num?)?.toInt(),
);

Map<String, dynamic> _$ReviewToJson(Review instance) => <String, dynamic>{
  'id': instance.id,
  'productId': instance.productId,
  'userId': instance.userId,
  'userName': instance.userName,
  'rating': instance.rating,
  'title': instance.title,
  'comment': instance.comment,
  'createdAt': instance.createdAt.toIso8601String(),
  'isVerifiedPurchase': instance.isVerifiedPurchase,
  'images': instance.images,
  'videos': instance.videos,
  'helpfulCount': instance.helpfulCount,
  'notHelpfulCount': instance.notHelpfulCount,
};

_$ReviewImpl _$$ReviewImplFromJson(Map<String, dynamic> json) => _$ReviewImpl(
  id: json['id'] as String,
  productId: json['productId'] as String,
  userId: json['userId'] as String,
  userName: json['userName'] as String,
  rating: (json['rating'] as num).toDouble(),
  title: json['title'] as String,
  comment: json['comment'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  isVerifiedPurchase: json['isVerifiedPurchase'] as bool,
  images: (json['images'] as List<dynamic>?)?.map((e) => e as String).toList(),
  videos: (json['videos'] as List<dynamic>?)?.map((e) => e as String).toList(),
  helpfulCount: (json['helpfulCount'] as num?)?.toInt(),
  notHelpfulCount: (json['notHelpfulCount'] as num?)?.toInt(),
);

Map<String, dynamic> _$$ReviewImplToJson(_$ReviewImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'productId': instance.productId,
      'userId': instance.userId,
      'userName': instance.userName,
      'rating': instance.rating,
      'title': instance.title,
      'comment': instance.comment,
      'createdAt': instance.createdAt.toIso8601String(),
      'isVerifiedPurchase': instance.isVerifiedPurchase,
      'images': instance.images,
      'videos': instance.videos,
      'helpfulCount': instance.helpfulCount,
      'notHelpfulCount': instance.notHelpfulCount,
    };
