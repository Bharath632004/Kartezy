// lib/features/wallet/domain/repository/wallet_repository.dart

abstract class WalletRepository {
  Future<double> getBalance();

  Future<void> addMoney(double amount);

  Future<void> withdrawMoney(double amount);
}
