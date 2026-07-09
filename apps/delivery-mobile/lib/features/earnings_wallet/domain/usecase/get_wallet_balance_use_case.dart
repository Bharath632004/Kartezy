// lib/features/earnings_wallet/domain/usecase/get_wallet_balance_use_case.dart
import 'package:delivery_mobile/features/earnings_wallet/domain/repository/wallet_repository.dart';
import 'package:delivery_mobile/features/earnings_wallet/data/repository/wallet_repository_impl.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class GetWalletBalanceUseCase {
  final WalletRepository _repository;

  GetWalletBalanceUseCase(this._repository);

  Future<double> call() => _repository.getBalance();
}

/// Provider for get wallet balance use case
final getWalletBalanceUseCaseProvider = Provider<GetWalletBalanceUseCase>((ref) {
  final repository = ref.read(walletRepositoryProvider);
  return GetWalletBalanceUseCase(repository);
});