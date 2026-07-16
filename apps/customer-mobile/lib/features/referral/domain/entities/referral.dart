import 'package:equatable/equatable.dart';

class Referral extends Equatable {
  final String code;
  final int referralCount;
  final double rewardsEarned;

  const Referral({
    required this.code,
    required this.referralCount,
    required this.rewardsEarned,
  });

  factory Referral.fromJson(Map<String, dynamic> json) => Referral(
    code: json['code'] as String,
    referralCount: json['referralCount'] as int,
    rewardsEarned: (json['rewardsEarned'] as num).toDouble(),
  );

  Map<String, dynamic> toJson() => {
    'code': code,
    'referralCount': referralCount,
    'rewardsEarned': rewardsEarned,
  };

  @override
  List<Object?> get props => [code, referralCount, rewardsEarned];
}
