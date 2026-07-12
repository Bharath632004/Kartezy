// lib/features/wallet/domain/usecase/withdraw_wallet_money_use_case.dart
import 'package:customer_mobile/features/wallet/domain/repository/wallet_repository.dart';
import 'package:customer_mobile/features/wallet/data/repository/wallet_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class WithdrawWalletMoneyUseCase {
  final WalletRepository _repository;

  WithdrawWalletMoneyUseCase(this._repository);

  Future<void> call(double amount) => _repository.withdrawMoney(amount);
}

/// Provider for withdraw wallet money use case
final withdrawWalletMoneyUseCaseProvider = Provider<WithdrawWalletMoneyUseCase>((ref) {
  final repository = ref.read(walletRepositoryProvider);
  return WithdrawWalletMoneyUseCase(repository);
});