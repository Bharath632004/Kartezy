// lib/features/wallet/domain/repository/wallet_repository.dart

abstract class WalletRepository {
  Future<double> getBalance();
}
