// lib/features/referral/domain/entities/referral.dart
class Referral {
  final String code;
  final String shareUrl;
  final int referralCount;
  final double earnedAmount;
  final DateTime createdAt;

  Referral({
    required this.code,
    required this.shareUrl,
    required this.referralCount,
    required this.earnedAmount,
    required this.createdAt,
  });

  factory Referral.fromJson(Map<String, dynamic> json) {
    return Referral(
      code: json['code'] as String,
      shareUrl: json['shareUrl'] as String,
      referralCount: json['referralCount'] as int,
      earnedAmount: (json['earnedAmount'] as num).toDouble(),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'code': code,
      'shareUrl': shareUrl,
      'referralCount': referralCount,
      'earnedAmount': earnedAmount,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}