// lib/features/wallet/domain/usecase/add_wallet_money_use_case.dart
import 'package:customer_mobile/features/wallet/domain/repository/wallet_repository.dart';
import 'package:customer_mobile/features/wallet/data/repository/wallet_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AddWalletMoneyUseCase {
  final WalletRepository _repository;

  AddWalletMoneyUseCase(this._repository);

  Future<void> call(double amount) => _repository.addMoney(amount);
}

/// Provider for add wallet money use case
final addWalletMoneyUseCaseProvider = Provider<AddWalletMoneyUseCase>((ref) {
  final repository = ref.read(walletRepositoryProvider);
  return AddWalletMoneyUseCase(repository);
});
