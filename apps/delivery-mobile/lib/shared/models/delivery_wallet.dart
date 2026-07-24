import 'package:freezed_annotation/freezed_annotation.dart';

part 'wallet_transaction.freezed.dart';
part 'wallet_transaction.g.dart';

/// Type of wallet transaction.
enum WalletTransactionType {
  credit,
  debit,
  withdrawal,
  refund,
  bonus,
  cashback,
}

/// Represents a wallet transaction.
@freezed
class WalletTransaction with _$WalletTransaction {
  const factory WalletTransaction({
    required String id,
    required String partnerId,
    required WalletTransactionType type,
    required double amount,
    required double balanceAfter,
    required String description,
    String? referenceId,
    String? status,
    required DateTime createdAt,
  }) = _WalletTransaction;

  factory WalletTransaction.fromJson(Map<String, dynamic> json) =>
      _$WalletTransactionFromJson(json);
}

/// Wallet state.
@freezed
class DeliveryWallet with _$DeliveryWallet {
  const factory DeliveryWallet({
    required String id,
    required String partnerId,
    required double balance,
    required double pendingBalance,
    required double totalWithdrawn,
    required DateTime lastUpdated,
  }) = _DeliveryWallet;

  factory DeliveryWallet.fromJson(Map<String, dynamic> json) =>
      _$DeliveryWalletFromJson(json);
}
