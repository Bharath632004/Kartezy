import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:json_annotation/json_annotation.dart';

part 'wallet.freezed.dart';
part 'wallet.g.dart';

@freezed
@JsonSerializable()
class Wallet with _$Wallet {
  const factory Wallet({
    required double balance,
    String? currency,
    DateTime? lastUpdated,
  }) = _Wallet;

  factory Wallet.fromJson(Map<String, dynamic> json) => _$WalletFromJson(json);
  Map<String, dynamic> toJson() => _$WalletToJson(this);
}