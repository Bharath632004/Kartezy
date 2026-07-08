// lib/shared/models/user.dart
import 'package:freezed_annotation/freezed_annotation.dart';
part 'user.freezed.dart';
part 'user.g.dart';

@Freezed()
class User with _$User {
  const factory User({
    required this.id,
    required this.email,
    required this.name,
    this.phone,
    this.avatarUrl,
    this.accessToken,
    this.refreshToken,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);

  final String id;
  final String email;
  final String name;
  final String? phone;
  final String? avatarUrl;
  final String? accessToken;
  final String? refreshToken;
}
